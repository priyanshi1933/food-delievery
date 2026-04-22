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

// Update Menu Item
export const updateMenu = async (id: string, restaurantId: string, updateData: any) => {
  try {
    // 1. Ownership check is baked into the filter: { _id, restaurantId }
    // 2. Fix deprecation warning: use returnDocument: 'after' instead of new: true
    return await MenuModel.findOneAndUpdate(
      { _id: id, restaurantId: restaurantId },
      updateData,
      { returnDocument: 'after' } 
    );
  } catch (err: any) {
    throw err;
  }
};


// Delete Menu Item
export const deleteMenu = async (id: string, restaurantId: string) => {
  try {
    return await MenuModel.findOneAndDelete({ _id: id, restaurantId: restaurantId });
  } catch (err: any) {
    throw err;
  }
};



