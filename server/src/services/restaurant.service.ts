

import { RestaurantModel } from "../models/restaurant.model";
import { MenuModel } from "../models/menu.model";

// CREATE
export const createRestaurant = async (
  managerId: string, 
  name: string, 
  address: string, 
  categories: any, 
  rating: number, 
  image: string
) => {
  const formattedCategories = Array.isArray(categories) ? categories : [categories];
  
  return await RestaurantModel.create({ 
    managerId, 
    name, 
    address, 
    categories: formattedCategories, 
    rating, 
    image 
  });
};


export const getRestaurant = async () => {
  return await RestaurantModel.find();
};

export const getRestaurantById = async (id: string) => {
  return await RestaurantModel.findById(id); 
};

export const getRestaurantsByManagerId = async (managerId: string) => {
  return await RestaurantModel.find({ managerId });
};

export const updateRestaurant = async (id: string, managerId: string, updateData: any) => {
  if (updateData.categories) {
    updateData.categories = Array.isArray(updateData.categories) 
      ? updateData.categories 
      : [updateData.categories];
  }

  // Uses both IDs to ensure only the owner can update
  return await RestaurantModel.findOneAndUpdate(
    { _id: id, managerId: managerId }, 
    updateData, 
    { new: true }
  );
};

export const deleteRestaurant = async (id: string, managerId: string) => {
  const deletedRestaurant = await RestaurantModel.findOneAndDelete({ 
    _id: id, 
    managerId: managerId 
  });
  if (deletedRestaurant) {
    await MenuModel.deleteMany({ restaurantId: id });
  }

  return deletedRestaurant;
};