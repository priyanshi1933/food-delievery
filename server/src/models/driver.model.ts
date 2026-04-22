import mongoose, { Schema, Document, Types } from "mongoose";

export interface IDriver extends Document {
  userId: Types.ObjectId;
  isAvailable: boolean;
  vehicle: string;
  currentLocation: {
    lat: number;
    lng: number;
  };
  lastUpdated: Date;
}

const DriverSchema: Schema<IDriver> = new Schema<IDriver>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, 
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    vehicle: {
      type: String,
      required: true,
    },
    currentLocation: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

export const DriverModel = mongoose.model<IDriver>("Driver", DriverSchema);
