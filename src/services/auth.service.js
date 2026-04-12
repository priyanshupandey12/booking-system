import ApiError from '../utils/ApiError.js';
import {     generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken } from '../utils/jwtUtils.js';
import bcrypt from 'bcryptjs';
import { users } from '../db/schema.js';
import db from '../db/db.js';
import { eq } from "drizzle-orm";
import crypto from 'crypto';

const hashToken=(token)=>{
   return crypto.createHash('sha256').update(token).digest('hex');
}

const register=async({name,email,password})=>{
    const existingUser=await db.select().from(users).where(eq(users.email, email));
    if(existingUser.length > 0){
        throw ApiError.conflict("User already exists");
    }

    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt);


    const user=await db.insert(users).values({
    name,
    email,
    password: hashedPassword,
  }).returning({
    id: users.id,
    name: users.name,
    email: users.email,
    createdAt: users.createdAt,
  });

    return user[0];

}

const login=async({email,password})=>{
      const result = await db.select().from(users).where(eq(users.email, email));
      const user = result[0]; 

  if (!user) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw ApiError.unauthorized("Invalid email or password");
  }


  const accessToken = generateAccessToken({ id: user.id }); 
  const refreshToken = generateRefreshToken({ id: user.id });



  await db.update(users)
    .set({ refreshToken: hashToken(refreshToken) })
    .where(eq(users.id, user.id));



  const { password: _, refreshToken: __, ...userObj } = user;
  
  return { user: userObj, accessToken, refreshToken };
}

const refreshToken=async(refreshToken)=>{
    if(!refreshToken){
        throw ApiError.unauthorized("Refresh token is required");
    }
    const decoded=verifyRefreshToken(refreshToken);
  const result = await db.select().from(users).where(eq(users.id, decoded.id));
  const user = result[0];

  if (!user || user.refreshToken !== hashToken(token)) {
    throw ApiError.unauthorized("Invalid refresh token");
  }

  const accessToken = generateAccessToken({ id: user.id });
  return { accessToken };
}

const logout = async (userId) => {
  await db.update(users)
    .set({ refreshToken: null })
    .where(eq(users.id, userId));
};

const getMe=async(userId)=>{
    const result = await db.select().from(users).where(eq(users.id, userId));
    const user = result[0];
    if (!user) {
        throw ApiError.notFound("User not found");
    }
    const { password: _, refreshToken: __, ...userObj } = user;
    return userObj;

}

export  {
    register,
    login,
    refreshToken,
    logout,
    getMe
}