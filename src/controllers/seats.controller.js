import ApiResponse from '../utils/ApiResponse.js';
import { getAllSeats, bookSeat, getMyBookings } from '../services/seats.service.js';


 const GetAllSeats = async (req, res) => {
  const data = await getAllSeats();
  ApiResponse.ok(res, "Seats fetched successfully", data);
};


 const BookSeatLegacy = async (req, res) => {
  const id = parseInt(req.params.id);
  const name = req.user.name; 
  const userId = req.user.id;

  const seat = await bookSeat(id, userId, name);
  res.send(seat); 
};


 const GetMyBookings = async (req, res) => {
  const data = await getMyBookings(req.user.id);
  ApiResponse.ok(res, "Your bookings", data);
};

export {
  GetAllSeats,
  BookSeatLegacy,
  GetMyBookings
}