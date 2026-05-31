"use server"

import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export const completeOnboarding = async (data) => {
    const user = await currentUser();
    if (!user) {
        return { error: "Unauthorized" };
    }

    const { role, title, company, yearsExp, bio, categories } = data;

    if (!role || !["INTERVIEWEE", "INTERVIEWER"].includes(role)) {
        throw new Error("Invalid role");
    }

    if (role === "INTERVIEWER") {
        if (!title || !company || !yearsExp || !bio || !categories?.length) {
            throw new Error("Please fill in all required fields");
        }
    }

    try {
        const name = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
        const email = user.emailAddresses?.[0]?.emailAddress ?? "";

        await db.user.upsert({
            where: { clerkUserId: user.id },
            create: {
                clerkUserId: user.id,
                name,
                email,
                imageUrl: user.imageUrl,
                role,
                ...(role === "INTERVIEWER" && {
                    title,
                    company,
                    yearsExp,
                    bio,
                    categories,
                }),
            },
            update: {
                role,
                ...(role === "INTERVIEWER" && {
                    title,
                    company,
                    yearsExp,
                    bio,
                    categories,
                }),
            },
        });

        return { success: true };
    } catch (error) {
        console.error("completeOnboarding error:", error);
        return { error: "Failed to complete onboarding" };
    }
};
