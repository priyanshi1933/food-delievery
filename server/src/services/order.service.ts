import { OrderModel } from "../models/order.model";

export const createOrder = async (orderData: any) => {
  try {
    const initialStatus = {
      status: "PENDING",
      timestamp: new Date(),
    };
    const order = new OrderModel({
      ...orderData,
      status: "PENDING",
      statusHistory: [initialStatus],
    });
    return await order.save();
  } catch (err: any) {
    throw new Error("Service Error: " + err.message);
  }
};

export const updateOrderStatus = async (orderId: string, newStatus: string) => {
  try {
    return await OrderModel.findByIdAndUpdate(
      orderId,
      {
        $set: { status: newStatus },
        $push: { statusHistory: { status: newStatus, timestamp: new Date() } },
      },
      {
        new: true,
      },
    );
  } catch (err: any) {
    throw new Error("Service Error: " + err.message);
  }
};


