import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJwt } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';


export async function GET() {
  try {
    const cookiesObj = await cookies();

    const token      = cookiesObj.get('auth')?.value;
    console.log("token ", token);

    const allCookies = Array.from(cookiesObj.getAll()).map(c => ({
      name: c.name,
      value: c.value,
    }));

    //console.log("Cookies dispo:", allCookies);

    if (!token) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

    const payload = await verifyJwt<{ sub: string }>(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true, 
        email: true, 
        name: true, 
        first_name: true, 
        //phone: true,
        //country: true, cin: true, adresse: true, createdAt: true,
      },
    });
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json(user);
  } catch (e) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}