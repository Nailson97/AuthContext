import { AuthTokenError } from './../services/errors/AuthTokenError';
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import decode from 'jwt-decode'
import { destroyCookie, parseCookies } from "nookies";
import { validationUserPermitiions } from './validationUserPermissions';

interface WitchSRRAuthOptions {
  permissions?: string[]
  roles?: string[]
}

export function witchSSRAuth<P>(fn: GetServerSideProps<P>, options?: WitchSRRAuthOptions ) {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);
    const token = cookies["auth.token"]

    if (!token) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

   if (options) {
    const user = decode<{ permissions: string[], roles: string[] }>(token)
    const { permissions, roles } = options

    const userHasValidPermissions = validationUserPermitiions({
      user,
      permissions,
      roles
    })

    if(!userHasValidPermissions) {
      return {
        redirect: {
          destination: "/dashboard",
          permanent: false,
        }
      }
    }
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
