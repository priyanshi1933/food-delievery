import mongoose, { Schema, Document, Types } from "mongoose";

export interface IOrder extends Document {
  customerId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  driverId?: Types.ObjectId;
  items: {
    menuItemId: Types.ObjectId;
    name: string;
    priceAtTime: number;
    quantity: number;
  }[];
  status:
    | "PENDING"
    | "ACCEPTED"
    | "READY"
    | "PICKED_UP"
    | "ON_THE_WAY"
    | "DELIVERED"
    | "CANCELLED";
  statusHistory: {
    status: string;
    timestamp: Date;
  }[];
  deliveryAddress: string;
  deliveryCoords: {
    lat: number;
    lng: number;
  };
  totalAmount: number;
  ratings: {
    restaurant?: number;
    driver?: number;
  };
}

const OrderSchema: Schema<IOrder> = new Schema<IOrder>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    driverId: { type: Schema.Types.ObjectId, ref: "Driver" },

    items: [
      {
        menuItemId: { type: Schema.Types.ObjectId, required: true },
        name: { type: String, required: true },
        priceAtTime: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],

    status: {
      type: String,
      enum: [
        "PENDING",
        "ACCEPTED",
        "READY",
        "PICKED_UP",
        "ON_THE_WAY",
        "DELIVERED",
        "CANCELLED",
      ],
      default: "PENDING",
    },

    statusHistory: [
      {
        status: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],

    deliveryAddress: { type: String, required: true },

    deliveryCoords: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },

    totalAmount: { type: Number, required: true },

    ratings: {
      restaurant: { type: Number, min: 1, max: 5 },
      driver: { type: Number, min: 1, max: 5 },
    },
  },
  {
    timestamps: true,
  },
);

export const OrderModel = mongoose.model<IOrder>("Order", OrderSchema);
