import { Router } from "express";
import { GetAllSeats,  BookSeatLegacy, GetMyBookings } from "../controllers/seats.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();


router.get("/seats", GetAllSeats);
      
router.put("/:id/:name", authenticate, BookSeatLegacy);    
router.get("/my-bookings", authenticate, GetMyBookings);  

export default router;