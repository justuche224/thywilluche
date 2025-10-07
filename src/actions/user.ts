"use server";

import db from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getUserRole = async (userId: string) => {
    const userData = await db.select({role: user.role}).from(user).where(eq(user.id, userId)).limit(1);
    return userData[0].role;
};
