
import { Request, Response } from "express";
import * as RestaurantService from "../services/restaurant.service";

// CREATE RESTAURANT
export const create = async (req: Request, res: Response) => {
  try {
    // FIX: Use 'as string' to resolve the 'string | string[]' error
    const managerId = req.body.managerId as string;
    const name = req.body.name as string;
    const address = req.body.address as string;
    const { categories, rating } = req.body;
  
    const file = (req as any).file; 
    if (!file) return res.status(400).json({ message: "Image file is required" });

    const product = await RestaurantService.createRestaurant(
      managerId,
      name,
      address,
      categories,
      Number(rating), 
      file.path 
    );

    res.status(201).json(product);
  } catch (error: any) {
    res.status(400).json({ message: "Record not inserted" });
  }
};

// READ BY MANAGER ID
// export const readByManager = async (req: Request, res: Response) => {
//   try {
//     const managerId = req.params.managerId as string;
//     const restaurants = await RestaurantService.getRestaurantsByManagerId(managerId);
//     res.json(restaurants);
//   } catch (error) {
//     res.status(404).json({ message: "No records found" });
//   }
// };

// READ ALL
// export const read = async (req: Request, res: Response) => {
//   try {
//     const rest = await RestaurantService.getRestaurant();
//     res.json(rest);
//   } catch (error) {
//     res.status(500).json({ message: "No Records" });
//   }
// };

// export const readById = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params; // Captures :id from the URL

//     const restaurant = await getSingleRestaurantById(id);

//     if (!restaurant) {
//       return res.status(404).json({ message: "Restaurant not found" });
//     }

//     // This sends back { name: "...", address: "..." } directly
//     res.json(restaurant); 
//   } catch (error) {
//     res.status(500).json({ message: "Error retrieving record" });
//   }
// };

export const read = async (req: Request, res: Response) => {
  try {
    const rest = await RestaurantService.getRestaurant();
    res.json(rest);
  } catch (error) {
    res.status(500).json({ message: "No Records Found" });
  }
};

// READ BY ID (Edit Page)
// This is what your frontend Edit page MUST call to fill the form
export const readByResId = async (req: Request, res: Response) => {
  try {
    // FIX: Add 'as string' to satisfy the service parameter
    const id = req.params.id as string; 
    const restaurant = await RestaurantService.getRestaurantById(id);

    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
    res.json(restaurant); 
  } catch (error) {
    res.status(500).json({ message: "Error retrieving record" });
  }
};

// READ BY MANAGER ID (Manager Dashboard)
export const readByManager = async (req: Request, res: Response) => {
  try {
    const managerId = req.params.managerId as string;
    const restaurants = await RestaurantService.getRestaurantsByManagerId(managerId);
    res.json(restaurants);
  } catch (error) {
    res.status(404).json({ message: "No records found" });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    // FIX: Add 'as string' here
    const id = req.params.id as string;
    const managerId = (req as any).user.id as string; 
    
    const updateData = { ...req.body };
    const file = (req as any).file;
    if (file) updateData.image = file.path;

    const updated = await RestaurantService.updateRestaurant(id, managerId, updateData);
    
    if (!updated) {
      return res.status(403).json({ message: "Not authorized or Not found" });
    }
    
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: "Update failed" });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    // FIX: Add 'as string' here
    const id = req.params.id as string;
    const managerId = (req as any).user.id as string;

    const deleted = await RestaurantService.deleteRestaurant(id, managerId);
    
    if (!deleted) {
      return res.status(403).json({ message: "Not authorized or Not found" });
    }
    
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};

