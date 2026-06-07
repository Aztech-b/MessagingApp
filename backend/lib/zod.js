import { z } from "zod";

export const loginSchema = z.object({
    username: z.string().min(1, "Username is too short"),
    password: z.string().min(8, "Password is too short"),
});
