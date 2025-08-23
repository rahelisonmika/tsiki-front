import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function signJwt(payload: Record<string, unknown>, expiresIn = process.env.JWT_EXPIRES_IN || '7d') {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);
}

export async function verifyJwt<T = unknown>(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return payload as T;
}