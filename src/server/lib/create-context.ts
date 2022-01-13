import { GetServerSidePropsContext } from 'next';
import prisma from 'server/lib/prisma';
import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';

type CreateContextOptions =
  | trpcNext.CreateNextContextOptions
  | GetServerSidePropsContext;

async function getUserFromSession() {
  const user = await Promise.resolve({
    id: '1',
    email: 'user@domain.tld',
    locale: 'en',
  });

  // some hacks to make sure `email` is never inferred as `null`
  if (!user) {
    return null;
  }
  const { email } = user;
  if (!email) {
    return null;
  }

  const locale = user.locale || 'unknown';
  return {
    ...user,
    locale,
  };
}

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = async ({ res }: CreateContextOptions) => {
  // for API-response caching see https://trpc.io/docs/caching
  const viewer = await getUserFromSession();
  const user = await Promise.resolve(viewer);
  const mockIncomingLocale = 'en-US';
  return {
    locale: mockIncomingLocale,
    prisma,
    res,
    user,
    session: null,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
