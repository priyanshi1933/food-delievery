
import express from "express";

import { registerUser,loginUser,getUsers } from "../controllers/user.controller";
import {create, read,readByManager,readByResId, update,remove} from "../controllers/restaurant.controller"
import { addDriver,getDriverProfile, patchLocation } from "../controllers/driver.controller";
import upload from '../config/multer';
import {addMenu,readMenu,readById,menuUpdate,menuRemove} from "../controllers/menu.controller"
import { verifyToken } from "../middleware/auth";
import { changeStatus, claimOrder, getActiveDriverOrder, getAvailableOrders, getCustomerOrders, getRestaurantOrders, getTracking, placeOrder, rateOrder } from "../controllers/order.controller";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", getUsers);

router.post("/addRestaurant",verifyToken,upload.single("image"),create);
router.get("/getRestaurant", read);
router.get("/getSingleRestaurant/:id", readByResId);
router.get("/getRestaurantsByManager/:managerId", readByManager);
router.put("/updateRestaurant/:id", verifyToken, upload.single("image"), update);
router.delete("/deleteRestaurant/:id", verifyToken, remove);

router.post("/addMenu",verifyToken,upload.single("image"),addMenu);
router.get("/getMenu",readMenu);
router.get("/getMenuById/:id",readById);
router.put("/updateMenu/:id", verifyToken, upload.single("image"), menuUpdate);
router.delete("/deleteMenu/:id", verifyToken, menuRemove);

router.post("/addDriver", verifyToken, addDriver);
router.get("/getDriver/:id", verifyToken, getDriverProfile);
router.patch("/update-location", verifyToken, patchLocation);

router.post("/orders/checkout", verifyToken, placeOrder);
router.patch("/orders/status", verifyToken, changeStatus);
router.patch("/orders/claim", verifyToken, claimOrder);
router.get("/orders/available", verifyToken, getAvailableOrders);
router.get("/orders/track/:orderId", verifyToken, getTracking);
router.get("/orders/driver/:driverId/active", verifyToken, getActiveDriverOrder);
router.get("/orders/customer/:customerId", verifyToken, getCustomerOrders);
router.get("/orders/restaurant/:restaurantId", verifyToken, getRestaurantOrders);
router.post("/orders/:orderId/rate", verifyToken, rateOrder);


export default router;
