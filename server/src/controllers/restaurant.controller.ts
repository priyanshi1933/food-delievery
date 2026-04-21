import { Request, Response } from "express";
import { createRestaurant, getRestaurant } from "../services/restaurant.service";


export const create = async (req: Request, res: Response) => {
  try {
    const { managerId, name, address, categories, rating } = req.body;
  
    const file = (req as any).file; 

    if (!file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const product = await createRestaurant(
      managerId,
      name,
      address,
      categories,
      rating,
      file.path 
    );

    res.json(product);
  } catch (error: any) {
    console.error("Controller Error:", error);
    res.status(400).json({ message: "Record not inserted" });
  }
};






// export const readById = async (req: Request, res: Response) => {
//   try {
//     const id = Object(req.params.id);
//     const bookmark = await getBookmarkById(id);
//     res.json(bookmark);
//   } catch (error) {
//     res.json({ message: "Record not found" });
//   }
// };

export const read = async (req: Request, res: Response) => {
  try {
    const rest = await getRestaurant();
    res.json(rest);
  } catch (error) {
    res.json({ message: "No Record" });
  }
};

// export const delBookmark = async (req: Request, res: Response) => {
//   try {
//     const id = Object(req.params.id);
//     const deleted = await deleteBookmark(id);
//     res.json(deleted);
//   } catch (error) {
//     console.log(error)
//     res.json({ message: "Record is not deleted" });
//   }
// };
