import db from '../db/db.js';
import { seats } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';
import ApiError from '../utils/ApiError.js';

 const getAllSeats = async () => {
  return await db.select().from(seats).orderBy(seats.id);
};


 const bookSeat = async (seatId, userId, name) => {

  return await db.transaction(async (tx) => {

    const result = await tx
      .select()
      .from(seats)
      .where(and(eq(seats.id, seatId), eq(seats.isbooked, 0)))
      .for('update'); 

    if (result.length === 0) {
      throw ApiError.conflict("Seat already booked");
    }


    const updated = await tx
      .update(seats)
      .set({
        isbooked: 1,
        name,
        userId,
      })
      .where(eq(seats.id, seatId))
      .returning();

    return updated[0];
  });
};


 const getMyBookings = async (userId) => {
  return await db
    .select()
    .from(seats)
    .where(and(eq(seats.userId, userId), eq(seats.isbooked, 1)));
};

export {
  getAllSeats,
  bookSeat,
  getMyBookings
}