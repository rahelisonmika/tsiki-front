import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import argon2 from 'argon2';
import { signJwt } from '@/lib/jwt';
const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

// Pour ne jamais exposer le hash
const userPublicSelect = {
  id: true,
  email: true,
  name: true,
  first_name: true,
  phone: true,
  country: true,
  cin: true,
  adresse: true,
  createdAt: true,
  // password: false  <-- inutile, on ne le sélectionne pas
} as const;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    // 1) Récupère l'utilisateur par email
    const user = await prisma.user.findUnique({
      where: { email },
      select: { ...userPublicSelect, password: true }, // on récupère le hash pour vérifier
    });

    if (!user) {
      return NextResponse.json({ error: 'Identifiants invalides' }, { status: 401 });
    }

    // 2) Vérifie le mot de passe (clair vs hash en base)
    const ok = await argon2.verify(user.password, password);
    if (!ok) {
      return NextResponse.json({ error: 'Identifiants invalides' }, { status: 401 });
    }

    // 3) Ne renvoie jamais le hash et information sensible
    const { password: _omitPassword, 
            cin: _omitCin, 
            phone: _omitPhone, 
            adresse: _omitAdresse, 
            email: _omitEmail,
            country: _omitCountry,
            createdAt: _omitCreatedAt,
            ...publicUser } = user;

    // Ici tu peux générer un token/mettre un cookie (JWT, session, etc.)
    const token = await signJwt({
      sub: user.id,
      email: user.email,
      // rôle/permissions si tu en as : role: user.role
    });

    //console.log("token ", token);
    
    //Dépose le cookie HttpOnly
    const response = NextResponse.json(publicUser, { status: 200 });
    response.cookies.set('auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      // expires: new Date(Date.now() + 7*24*3600*1000) // sinon sers-toi de exp du JWT côté lecture
      maxAge: 60 * 60 * 24 * 7, // 7 jours
    });

    // response.cookies.getAll().forEach(cookie => {
    //   console.log(`Cookie: ${cookie.name}=${cookie.value}`);
    // });

    return response;
  } catch (err: any) {
    if (err?.name === 'ZodError') {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    console.error('LOGIN error:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}