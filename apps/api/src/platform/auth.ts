import { SignJWT, jwtVerify } from "jose";
const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "dev-secret-change-me-32-chars-min");
export async function signSession(sub: string, login: string) {
  return new SignJWT({ login }).setProtectedHeader({alg:"HS256"}).setSubject(sub).setIssuedAt().setIssuer("ssm").setAudience("ssm-api").setExpirationTime("7d").sign(secret);
}
export async function verifySession(token: string) {
  const { payload } = await jwtVerify(token, secret, { issuer:"ssm", audience:"ssm-api" });
  return payload as { sub: string; login: string };
}
