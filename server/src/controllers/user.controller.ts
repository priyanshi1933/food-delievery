import { Request, Response } from "express";
import { getUser, login, register } from "../services/user.service";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { RestaurantModel } from "../models/restaurant.model";
import { createDriver } from "../services/driver.service";

dotenv.config({ path: ".env.local" });
console.log("Secret loaded:", process.env.JWT_SECRET);

const secret = process.env.JWT_SECRET as string;

// export const registerUser = async (req: Request, res: Response) => {
//   try{
// const { name,email, password: hashedPassword,role,phone } = req.body;
//   const user = await register(name,email, hashedPassword,role,phone);
//   res.status(201).json(user);
//   }catch(error:any){
//     res.status(400).json({message:error.message})
//   }

// };

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, phone, vehicle } = req.body;

    // 1. Pre-validation: If role is driver, vehicle MUST be present
    if (role === 'driver' && !vehicle) {
      return res.status(400).json({ 
        field: "vehicle", 
        message: "Vehicle details are required for driver registration" 
      });
    }

    // 2. Create the User
    const user = await register(name, email, password, role, phone);

    // 3. Create the Driver Profile
    if (role === 'driver') {
      // Using .toString() to avoid the ObjectId type error
      await createDriver(user._id.toString(), vehicle);
    }

    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await login(email);
    if (!user) {
      return res
        .status(404)
        .json({ field: "email", message: "No user available" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ field: "password", message: "Password is not match" });
    }
    // --- NEW LOGIC: Find the restaurant linked to this manager ---
    let restaurantId = null;
    if (user.role === "manager") {
      const restaurant = await RestaurantModel.findOne({ managerId: user._id });
      restaurantId = restaurant ? restaurant._id : null;
    }
    const managedRestaurants = await RestaurantModel.find({
      managerId: user._id,
    });
    let token = jwt.sign({ id: user._id, role: user.role }, secret, {
      expiresIn: "1h",
    });
    res.cookie("token", token);
    res.json({
      token,
      role: user.role,
      id: user._id,
      name: user.name,
      restaurantId: restaurantId,
      managedRestaurants: managedRestaurants.map((r) => ({
        id: r._id,
        name: r.name,
      })),
    });
  } catch (error: any) {
    res.status(400).json({ field: "email", message: error.message });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const user = await getUser();
    res.json(user);
  } catch (error: any) {
    res.status(400).json({ message: "No User Available" });
  }
};
