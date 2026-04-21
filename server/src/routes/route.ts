
import express from "express";

import { registerUser,loginUser,getUsers } from "../controllers/user.controller";
import {create, read} from "../controllers/restaurant.controller"
import upload from '../config/multer';
import {addMenu,readMenu,readById} from "../controllers/menu.controller"
import { verifyToken } from "../middleware/auth";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", getUsers);

router.post("/addRestaurant",verifyToken,upload.single("image"),create);
router.get("/getRestaurant",read);

router.post("/addMenu",verifyToken,upload.single("image"),addMenu);
router.get("/getMenu",readMenu);
router.get("/getMenuById/:id",readById);

export default router;
