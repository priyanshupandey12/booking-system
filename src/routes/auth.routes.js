import { Router } from "express";
import { Register, Login, RefreshToken, Logout ,GetMe} from "../controllers/auth.controller.js";
import validate from "../middleware/validation.middleware.js";
import { loginSchema,registerSchema } from "../validators/auth.validator.js";
import { authenticate }from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", validate(registerSchema), Register);
router.post("/login", validate(loginSchema), Login);
router.post("/refresh-token", RefreshToken);
router.post("/logout", authenticate, Logout);
router.get("/me", authenticate, GetMe);

export default router;