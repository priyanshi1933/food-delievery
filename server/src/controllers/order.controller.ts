import { Request,Response } from "express";
import { OrderModel } from "../models/order.model";
import { createOrder,updateOrderStatus } from "../services/order.service";

export const placeOrder=async(req:Request,res:Response)=>{
    try {
        const order=await createOrder(req.body);
        res.status(201).json(order);
    } catch (error:any) {
        res.status(400).json({message:error.message});
    }
}

export const changeStatus=async(req:Request,res:Response)=>{
    try {
        const {orderId,status}=req.body;
        const updatedOrder=await updateOrderStatus(orderId,status);
        if(!updatedOrder){
            res.status(400).json({message:"Order not found"});
        }
        res.status(200).json(updatedOrder);
    } catch (error:any) {
        res.status(400).json({message:error.message});
    }
}

export const claimOrder = async (req: Request, res: Response) => {
  try {
    const { orderId, driverId } = req.body;

    const order = await OrderModel.findByIdAndUpdate(
      orderId,
      { 
        driverId, 
        status: "PICKED_UP",
        $push: { statusHistory: { status: "PICKED_UP", timestamp: new Date() } }
      },
      { new: true }
    );

    res.status(200).json(order);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getTracking = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
 
    const order = await OrderModel.findById(orderId)
      .populate({
        path: "driverId",
        select: "currentLocation vehicle",
        populate: { path: "userId", select: "name phone" }
      })
      .populate("restaurantId", "name coordinates address");

    res.status(200).json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};