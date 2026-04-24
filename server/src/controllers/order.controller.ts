import { Request, Response } from "express";
import { OrderModel } from "../models/order.model";
import { createOrder, updateOrderStatus } from "../services/order.service";
import mongoose from "mongoose";

export const placeOrder = async (req: Request, res: Response) => {
  try {
    const order = await createOrder(req.body);
    res.status(201).json(order);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const changeStatus = async (req: Request, res: Response) => {
  try {
    const { orderId, status } = req.body;
    const updatedOrder = await updateOrderStatus(orderId, status);
    if (!updatedOrder) {
      res.status(400).json({ message: "Order not found" });
    }
    res.status(200).json(updatedOrder);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const claimOrder = async (req: Request, res: Response) => {
  try {
    const { orderId, driverId } = req.body;

    const order = await OrderModel.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(orderId),
        status: "READY",

        $or: [{ driverId: { $exists: false } }, { driverId: null }],
      },
      {
        driverId: new mongoose.Types.ObjectId(driverId),
        status: "PICKED_UP",
        $push: {
          statusHistory: { status: "PICKED_UP", timestamp: new Date() },
        },
      },
      { new: true },
    );

    if (!order) {
      return res
        .status(400)
        .json({ message: "Order is already claimed or no longer ready." });
    }

    res.status(200).json(order);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// export const getTracking = async (req: Request, res: Response) => {
//   try {
//     const { orderId } = req.params;

//     const order = await OrderModel.findById(orderId)
//       .populate({
//         path: "driverId",
//         select: "currentLocation vehicle",
//         populate: { path: "userId", select: "name phone" }
//       })
//       .populate("restaurantId", "name coordinates address");

//     res.status(200).json(order);
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const getTracking = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const order = await OrderModel.findById(orderId)

      .populate("driverId", "name phone")
      .populate("restaurantId", "name coordinates address");

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getRestaurantOrders = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;

    if (!restaurantId || typeof restaurantId !== "string") {
      return res.status(400).json({ message: "Invalid Restaurant ID" });
    }

    const orders = await OrderModel.find({
      $or: [
        { restaurantId: restaurantId },
        { restaurantId: new mongoose.Types.ObjectId(restaurantId) },
      ],
    })
      .populate("customerId", "name phone")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// export const getAvailableOrders = async (req: Request, res: Response) => {
//   try {
//     const orders = await OrderModel.find({
//       status: "READY",
//       driverId: { $exists: false }
//     }).populate("restaurantId", "name address deliveryCoords");

//     res.status(200).json(orders);
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const getCustomerOrders = async (req: Request, res: Response) => {
//   try {
//     const { customerId } = req.params;

//     const orders = await OrderModel.find({ customerId })
//       .populate("restaurantId", "name address")
//       .sort({ createdAt: -1 })
//       .lean();

//     res.status(200).json(orders);
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const getAvailableOrders = async (req: Request, res: Response) => {
  try {
    const orders = await OrderModel.find({
      status: "READY",

      $or: [{ driverId: { $exists: false } }, { driverId: null }],
    })
      .populate("restaurantId", "name address deliveryCoords")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to fetch available orders: " + error.message });
  }
};

// export const getCustomerOrders = async (req: Request, res: Response) => {
//   try {
//     const { customerId } = req.params;

//     const orders = await OrderModel.find({ customerId })
//       .populate("restaurantId", "name address")
//       .populate({
//         path: "driverId",
//         populate: { path: "userId", select: "name phone" } // Populate driver's user info
//       })
//       .sort({ createdAt: -1 })
//       .lean();

//     res.status(200).json(orders);
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const getCustomerOrders = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;

    const orders = await OrderModel.find({ customerId })
      .populate("restaurantId", "name address")
      .populate("driverId", "name phone")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
