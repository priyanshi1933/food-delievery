import { Request, Response } from "express";
import { createMenu, getMenu, getMenuById,updateMenu,deleteMenu } from "../services/menu.service";

export const addMenu = async (req: Request, res: Response) => {
  try {
    try {
      const { restaurantId, name, description, price, category, isAvailable } =
        req.body;
      const file = (req as any).file;

      if (!file) {
        return res.status(400).json({ message: "Image file is required" });
      }
      const menu = await createMenu(
        restaurantId,
        name,
        description,
        price,
        category,
        isAvailable,
        file.path,
      );
      res.json(menu);
    } catch (error: any) {
      res.status(400).json({ message: "Record not inserted" });
    }
  } catch (error) {
    console.error("Controller Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const readMenu = async (req: Request, res: Response) => {
  try {
    const rest = await getMenu();
    res.json(rest);
  } catch (error) {
    res.json({ message: "No Record" });
  }
};


export const readById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const menu = await getMenuById(id);

    if (!menu || menu.length === 0) {
      return res
        .status(404)
        .json({ message: "No menu items found for this restaurant" });
    }

    res.json(menu);
  } catch (error) {
    console.error(error); // Logs the actual error to your console
    res.status(500).json({ message: "Server error" });
  }
};


// UPDATE MENU
export const menuUpdate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Cast to string to resolve assignment errors
    const restaurantId = req.body.restaurantId as string; 
    const updateData = { ...req.body };
    const file = (req as any).file;

    if (file) {
      updateData.image = file.path;
    }

    const updated = await updateMenu(id as string, restaurantId, updateData);
    
    if (!updated) {
      // Returns 404 if the menu item doesn't exist OR doesn't belong to this restaurant
      return res.status(404).json({ 
        message: "Menu item not found or you don't have permission to edit it" 
      });
    }

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: "Update failed" });
  }
};


// DELETE MENU
export const menuRemove = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    // Explicitly cast to string to avoid the 'string | string[]' error
    const restaurantId = req.body.restaurantId as string;

    if (!restaurantId) {
      return res.status(400).json({ message: "restaurantId is required in body" });
    }

    const deleted = await deleteMenu(id, restaurantId);
    
    if (!deleted) {
      // This happens if the ID is wrong OR the restaurantId doesn't match that menu item
      return res.status(404).json({ message: "Menu item not found for this restaurant" });
    }

    res.json({ message: "Menu item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting menu item" });
  }
};
