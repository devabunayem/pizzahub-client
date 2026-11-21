import { auth, ensureAuthDbConnected } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';

const handler = toNextJsHandler(auth);

export const GET = async (req: Request) => {
  await ensureAuthDbConnected();
  return handler.GET(req);
};

export const POST = async (req: Request) => {
  await ensureAuthDbConnected();
  return handler.POST(req);
};
