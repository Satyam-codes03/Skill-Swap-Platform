import express from "express";// import express
import { protectRoute } from "../middleware/auth.middleware.js";
import { getStreamToken } from "../controllers/chat.controller.js";

const router = express.Router();//create a router

router.get("/token", protectRoute, getStreamToken);// only autheticate user can hit endpoints
// chatRoutes=>chatcontroller=>stream
export default router;