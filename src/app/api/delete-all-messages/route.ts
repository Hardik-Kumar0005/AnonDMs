import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";




export async function DELETE(req: Request) {

  const session = await getServerSession(authOptions);
  const user:User = session?.user as User;

  // console.log(messageId)
  console.log(user.id)

  if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Unauthorized"
        }, { status: 401 });
    }

  try {
    await prisma.message.deleteMany({
      where: {
        userId: user.id
      },
    });
    return new Response("All Messages deleted", { status: 200 });
  }

  catch (error) {
    if (error === 'P2025') {
      return Response.json(
        {
          success: false,
          message: "Message not found or you do not have permission to delete it.",
        },
        { status: 404 }
      );
    }

    // Generic fallback for other unexpected errors
    console.error("Error deleting message:", error);
    return Response.json(
      { success: false, message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
};
