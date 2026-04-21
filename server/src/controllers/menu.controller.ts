import { Request, Response } from "express";
import { createMenu, getMenu, getMenuById } from "../services/menu.service";

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

// export const readById = async (req: Request, res: Response) => {
//   try {
//      const id = req.params.id as string;
//     const menu = await getMenuById(id);

//     res.json(menu);
//   } catch (error) {
//     res.json({ message: "Record not found" });
//   }
// };
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
