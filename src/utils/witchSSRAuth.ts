import { AuthTokenError } from './../services/errors/AuthTokenError';
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { destroyCookie, parseCookies } from "nookies";

export function witchSSRAuth<P>(fn: GetServerSideProps<P>) {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);

    if (!cookies["auth.token"]) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
    try {
      return await fn(ctx);
    } catch (err) {
    if (err instanceof AuthTokenError) {
      destroyCookie(ctx, "auth.token");
      destroyCookie(ctx, "auth.refreshToken");

      return {
         redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
    }
  };
}
