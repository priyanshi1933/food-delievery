import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMenu extends Document {
  restaurantId: Types.ObjectId;
  name: string;
  description: string;
  price:number;
  category: string;
  isAvailable: boolean;
  image:string;
}

const MenuSchema: Schema<IMenu> = new Schema<IMenu>(
  {
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required:true
    },
    isAvailable:{
        type:Boolean,
        default:true,
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
export const MenuModel = mongoose.model<IMenu>(
  "Menu",
  MenuSchema,
);
