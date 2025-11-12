// Re-export all API functions from separated modules for backward compatibility

// Farms API
export { getFarms, getFarm, getFarmsByHost } from "@/lib/api/farms";

// Users API
export { createUser, getUser, getUserByEmail, updateUser } from "@/lib/api/users";

// Reservations API
export {
  getReservations,
  createReservation,
  updateReservation,
  cancelReservation,
} from "@/lib/api/reservations";

// Reviews API
export { getReviews, createReview } from "@/lib/api/reviews";

// Posts API
export { getPosts, createPost } from "@/lib/api/posts";

// Comments API
export { getComments, createComment } from "@/lib/api/comments";
