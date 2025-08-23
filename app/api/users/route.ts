import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import argon2 from "argon2";

const createUserSchema = z.object({
    email: z.string().email(),
    name: z.string().min(2),
    first_name: z.string().min(2).optional(),
    phone: z.string().optional(),
    country: z.string().min(1),
    password: z.string().min(8).regex(/[A-Za-z]/).regex(/\d/),
    cin: z.string().min(12),
    adresse: z.string().min(2),
});

// GET /api/users → list
export async function GET() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(users);
}

// POST /api/users → create
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = createUserSchema.parse(body);
    const hashedPassword = await argon2.hash(data.password);

    //const user = await prisma.user.create({ data});

    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (err: any) {
    if (err?.name === 'ZodError') {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    // gestion des erreurs doublon email
    if (err?.code === 'P2002') {
      return NextResponse.json({ error: 'Email déjà utilisé' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
