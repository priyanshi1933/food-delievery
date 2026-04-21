import { MenuModel } from "../models/menu.model";

export const createMenu = async (
  restaurantId: string,
  name: string,
  description: string,
  price: number,
  category: string,
  isAvailable: boolean,
  image:string
) => {
  try {
    return await MenuModel.create({
      restaurantId,
      name,
      description,
      price,
      category,
      isAvailable,
      image
    });
  } catch (err: any) {
    console.error("Database or URL Error:", err);
    throw err;
  }
};

export const getMenu = async () => {
  const res = await MenuModel.find();
  return res;
};

export const getMenuById = async (id: string) => {
  return await MenuModel.find({restaurantId:id}).populate("restaurantId");
};



