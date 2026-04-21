import { RestaurantModel } from "../models/restaurant.model";



export const createRestaurant = async (managerId:string, name:string, address:string, categories:any, rating:number, image:string) => {
  try {
    const formattedCategories = Array.isArray(categories) ? categories : [categories];
    
    return await RestaurantModel.create({ 
      managerId, 
      name, 
      address, 
      categories: formattedCategories, 
      rating, 
      image 
    });
  } catch (err: any) {
    throw err;
  }
};



// export const getBookmarkById = async (id: string) => {
//   return await BookmarkModel.findById(id).populate("userId");
// };

export const getRestaurant = async () => {
  const res = await RestaurantModel.find();
  return res;
};

// export const deleteBookmark = async (id: string) => {
//   return await BookmarkModel.findByIdAndDelete(id);
// };
