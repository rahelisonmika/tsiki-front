import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const idSchema       = z.string().min(1);
const updateSchema   = z.object({
  name: z.string().min(2).optional(),
});

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id   = idSchema.parse(params.id);
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(user);
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = idSchema.parse(params.id);
    const data = updateSchema.parse(await req.json());
    const user = await prisma.user.update({ where: { id }, data });
    return NextResponse.json(user);
  } catch (err: any) {
    if (err?.name === 'ZodError') {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    if (err?.code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = idSchema.parse(params.id);
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err?.code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
