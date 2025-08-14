import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import prisma from "@/lib/prisma";
import { User as UserModel } from "@prisma/client";
import { User } from "next-auth";

export async function POST(request: Request){
    const session = await getServerSession(authOptions);
    
    if(!session || !session.user){
        return Response.json({ 
            success: false,
            message: "Unauthorized" 
        }, { status: 401 });
    }
    const user: User = session.user;
    const userId = user.id;

    const { acceptMessages } = await request.json();

    try{
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { isAcceptingMessages: acceptMessages },
        });
        if(updatedUser){
            return Response.json({ success: true, message: "Settings updated successfully" });
        }
        return Response.json({ success: false, message: "Failed to update settings" });


    }
    catch(error){
        console.log(error)
        return Response.json({ 
            success: false,
            message: "An error occurred while updating your settings" 
        }, { status: 500 });
    }
}

export async function GET(request: Request){
    const session = await getServerSession(authOptions);

    if(!session || !session.user){
        return Response.json({ 
            success: false,
            message: "Unauthorized" 
        }, { status: 401 });
    }
    const user: User = session.user;
    const userId = user.id;

    try{
        const userSettings = await prisma.user.findUnique({
            where: { id: userId },
            select: { isAcceptingMessages: true },
        });
        if(userSettings){
            return Response.json({ 
                success: true, 
                isAcceptingMessages: userSettings.isAcceptingMessages 
            });
        }
        return Response.json({ success: false, message: "Failed to retrieve settings" });

    }
    catch(error){
        console.log(error)
        return Response.json({ 
            success: false,
            message: "An error occurred while retrieving your settings" 
        }, { status: 500 });
    }
}