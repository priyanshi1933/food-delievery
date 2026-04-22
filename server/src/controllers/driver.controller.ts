import { Request, Response } from "express";
import { createDriver, updateDriverLocation } from "../services/driver.service";
import { DriverModel } from "../models/driver.model";

export const addDriver = async (req: Request, res: Response) => {
  try {
    const { userId, vehicle } = req.body;

    if (!userId || !vehicle) {
      return res.status(400).json({ message: "UserId and Vehicle are required" });
    }

    const newDriver = await createDriver(userId, vehicle);
    
    res.status(201).json({
      message: "Driver profile created successfully",
      driver: newDriver
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getDriverProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; 

    const driverInfo = await DriverModel.findById(id)
      .populate("userId", "name email phone"); 

    if (!driverInfo) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.status(200).json(driverInfo);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const patchLocation = async (req: Request, res: Response) => {
  try {
    const { driverId, lat, lng } = req.body;

    if (!driverId || lat === undefined || lng === undefined) {
      return res.status(400).json({ message: "driverId, lat, and lng are required" });
    }

    const updatedDriver = await updateDriverLocation(driverId, lat, lng);

    if (!updatedDriver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.status(200).json({
      message: "Location updated",
      currentLocation: updatedDriver.currentLocation
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

