import ApiResponse from '../utils/ApiResponse.js';
import { register, login, refreshToken,logout,getMe } from '../services/auth.service.js';

 const Register = async (req, res) => {
  const user = await register(req.body);
  ApiResponse.created(res, "User registered successfully", user);
};

 const Login = async (req, res) => {
  const { user, accessToken, refreshToken: rToken } = await login(req.body);

  res.cookie('refreshToken', rToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  ApiResponse.ok(res, "User logged in successfully", { user, accessToken });
};
 const RefreshToken = async (req, res) => {
  const token = req.cookies?.refreshToken;
  const { accessToken } = await refreshToken(token);
  ApiResponse.ok(res, "Token refreshed", { accessToken });
};

 const Logout = async (req, res) => {
  await logout(req.user.id);
  res.clearCookie('refreshToken');
  ApiResponse.noContent(res);
};

  const GetMe=async(req,res)=>{
    const user = await getMe(req.user.id);
    ApiResponse.ok(res, "User details fetched successfully", user);
  }

  
export {
  Register,
  Login,
  RefreshToken,
  Logout,
  GetMe
}
