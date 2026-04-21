import mongoose, { Schema, Document, Types } from "mongoose";

export interface IRestaurant extends Document {
  managerId: Types.ObjectId;
  name: string;
  address: string;
  categories: string[];
  rating: number;
  image:string;
}

const RestaurantSchema: Schema<IRestaurant> = new Schema<IRestaurant>(
  {
    managerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    categories: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
    },
    image:{
      type:String,
      required:true,
    }
  },
  {
    timestamps: true,
  },
);
export const RestaurantModel = mongoose.model<IRestaurant>(
  "Restaurant",
  RestaurantSchema,
);
