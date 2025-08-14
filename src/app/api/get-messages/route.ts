import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import prisma from "@/lib/prisma";
import { User as UserModel } from "@prisma/client";
import { User } from "next-auth";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Unauthorized"
        }, { status: 401 });
    }
    const user: User = session.user;
    const userId = user.id;

    try {
        const messages = await prisma.message.findMany({
           where: {
             userId: userId,
         },
         orderBy: { 
              createdAt: 'desc',
         },
         });

         return Response.json({
             success: true,
             messages: messages
         });
    } 
    catch (error) {
        console.log(error);
        return Response.json({
            success: false,
            message: "An error occurred while retrieving your messages"
        }, { status: 500 });
    }
}