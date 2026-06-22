import { currentUser, auth } from "@clerk/nextjs/server";
import { db } from "./prisma";

const PLAN_CREDITS = {
  free: 1,
  starter: 5,
  pro: 15,
};

const getCurrentUserPlan = async() =>{
    const {has} = await auth();
    if(has({plan:'pro'}))return "pro";
    if(has({plan:'starter'})) return "starter";
    return "free";
}
const shouldAllocateCredits = (user,plan)=>{
    if(user.currentPlan !== plan) return true;

    if(!user.creditsLastAllocatedAt)return true;

    const now = new Date();
    const last = new Date(user.creditsLastAllocatedAt);
    const isNewMonth =
    now.getFullYear() >last.getFullYear()|| now .getMonth()>last.getMonth();
    return isNewMonth;

    

}
export const checkUser = async()=>{
    const user = await currentUser();
    if(!user) return null;

    try{
        const currentPlan = await getCurrentUserPlan();

        const credits = PLAN_CREDITS[currentPlan];

        const loggedInUser = await db.user.findUnique({
            where:{clerkUserId: user.id}
        })

        if(loggedInUser){
            if(loggedInUser.role ==="INTERVIEWER" )return loggedInUser;

            if(shouldAllocateCredits(loggedInUser,currentPlan)){
                return await db.user.update({
                    where:{clerkUserId:user.id},
                    data:{
                        credits,
                        currentPlan,
                        creditsLastAllocatedAt:new Date(),
                    },
                });
            }
            return loggedInUser;
        }
        
        const name = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
        return await db.user.create({
            data:{
                clerkUserId:user.id,
                name,
                imageUrl:user.imageUrl,
                email:user.emailAddresses[0].emailAddress,
                credits,
                currentPlan,
                creditsLastAllocatedAt:new Date(),
            },
        })
    }
    catch (error){
        console.error("CheckUser error:",error.message);
        return null;
     }
}