"use server";

import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const getInterviewerProfile2 = async () => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await db.user.findUnique({
    where: { clerkUserId: user.id },
    select: {
      id: true,
      title: true,
      company: true,
      yearsExp: true,
      bio: true,
      categories: true,
      creditRate: true,
    },
  });

  if (!dbUser) throw new Error("User not found");
  return dbUser;
};

export const updateInterviewerProfile = async ({
  title,
  company,
  yearsExp,
  bio,
  categories,
  creditRate,
}) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await db.user.findUnique({ where: { clerkUserId: user.id } });
  if (!dbUser || dbUser.role !== "INTERVIEWER") throw new Error("Forbidden");

  if (!title?.trim()) throw new Error("Title is required");
  if (!company?.trim()) throw new Error("Company is required");
  if (!yearsExp || yearsExp < 1) throw new Error("Years of experience is required");
  if (!bio?.trim()) throw new Error("Bio is required");
  if (!categories?.length) throw new Error("Select at least one category");
  if (!creditRate || creditRate < 1) throw new Error("Credit rate must be at least 1");

  try {
    await db.user.update({
      where: { id: dbUser.id },
      data: {
        title: title.trim(),
        company: company.trim(),
        yearsExp: Number(yearsExp),
        bio: bio.trim(),
        categories,
        creditRate: Number(creditRate),
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/explore");
    return { success: true };
  } catch (err) {
    console.error("updateInterviewerProfile error:", err);
    throw new Error("Failed to update profile");
  }
};
