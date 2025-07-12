

// import express from "express";
// import { protectRoute } from "../middleware/auth.middleware.js";
// import {
//   acceptFriendRequest,
//   getFriendRequests,
//   getMyFriends,
//   getOutgoingFriendReqs,
//   getRecommendedUsers,
//   sendFriendRequest,
// } from "../controllers/user.controller.js";

// const router = express.Router();


// // router.get("/",protectRoute, getRecommendedUsers);
// // router.get("/",protectRoute, getMyFriends);// multiple frnd , multiple time protectRoute=>so use simple one line

// // apply auth middleware to all routes, if it success them call below 
// router.use(protectRoute);


// //some recommended user from database
// router.get("/", getRecommendedUsers);
// router.get("/friends", getMyFriends);// get friend of curently authenticated user

// router.post("/friend-request/:id", sendFriendRequest);
// router.put("/friend-request/:id/accept", acceptFriendRequest);//yha se acptfrndreq call hoga, in user.controller me execute

// router.get("/friend-requests", getFriendRequests);
// router.get("/outgoing-friend-requests", getOutgoingFriendReqs);

// export default router;
















import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  acceptFriendRequest,
  getFriendRequests,
  getMyFriends,
  getOutgoingFriendReqs,
  getRecommendedUsers,
  sendFriendRequest,
  completeOnboarding,
  getUserById, // ✅ added
} from "../controllers/user.controller.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(protectRoute);

// User-related routes
router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);
router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);
router.get("/friend-requests", getFriendRequests);
router.get("/outgoing-friend-requests", getOutgoingFriendReqs);





// ✅ Onboarding route
router.post("/onboarding", completeOnboarding);

router.get("/:id", getUserById);

export default router;
