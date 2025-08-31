import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const identifier = url.searchParams.get('identifier');

    if (!identifier) {
      return Response.json({ success: false, message: 'Missing identifier' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ id: identifier }, { username: identifier }]
      },
      select: { id: true, username: true, isAcceptingMessages: true }
    });

    if (!user) {
      return Response.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return Response.json({ success: true, user });
  } catch (error) {
    console.error('get-user error', error);
    return Response.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
