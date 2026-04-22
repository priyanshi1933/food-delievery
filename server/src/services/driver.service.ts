import { DriverModel } from "../models/driver.model";

export const createDriver = async (userId: string, vehicle: string) => {
  try {
    return await DriverModel.create({
      userId,
      vehicle,
      isAvailable: true,
      currentLocation: { lat: 0, lng: 0 }
    });
  } catch (err: any) {
    throw new Error("Could not create driver profile: " + err.message);
  }
};

export const updateDriverLocation = async (driverId: string, lat: number, lng: number) => {
  try {
    return await DriverModel.findByIdAndUpdate(
      driverId,
      {
        currentLocation: { lat, lng },
        lastUpdated: new Date()
      },
      { new: true }
    );
  } catch (err: any) {
    throw new Error("Failed to update location: " + err.message);
  }
};

