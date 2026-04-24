import { z } from "zod";

export const userSchema = z.object({
  name: z
    .string()
    .min(3, "Name contain minimum of 3 characters")
    .max(10, "Name contain maximum of 10 characters"),
  email: z.string().email("Please enter valid email format"),
  password: z.string().min(6, "Password contain minimum of 6 characters"),
  role: z.string().min(1, "Please select a role"), 
  phone: z
    .string()
    .length(10, "Only 10 digits are allowed")
    .regex(/^\d+$/, "Phone number must contain only numbers"),
      vehicle: z.string().optional(), 
}).refine((data) => {
  if (data.role === "driver" && !data.vehicle) return false;
  return true;
}, {
  message: "Vehicle is required for drivers",
  path: ["vehicle"],
});;
