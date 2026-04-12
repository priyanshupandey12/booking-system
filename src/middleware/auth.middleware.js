import ApiError from '../utils/ApiError.js';
import { verifyAccessToken as verify } from '../utils/jwtUtils.js';
import db from '../db/db.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';


export const authenticate = async (req, res, next) => {
  let token;



  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }


  if (!token) throw ApiError.unauthorized("Not authenticated");

  const decoded = verify(token);


  const result = await db.select().from(users).where(eq(users.id, decoded.id));
  const user = result[0];

  if (!user) throw ApiError.unauthorized("User no longer exists");

  req.user = {
    id: user.id,
    name: user.name,
    email: user.email,
  };

  next();
};


