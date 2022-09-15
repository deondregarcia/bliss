import * as express from "express";
import { Profile } from "passport-google-oauth20";

declare global {
  namespace Express {
    // tslint:disable-next-line:no-empty-interface
    interface AuthInfo {}
    // tslint:disable-next-line:no-empty-interface
    export interface User {
      id: string;
      profile: Profile;
      accessToken: string;
    }

    interface Request {
      authInfo?: AuthInfo | undefined;
      user?: User | undefined;

      // These declarations are merged into express's Request type
      login(user: User, done: (err: any) => void): void;
      login(user: User, options: any, done: (err: any) => void): void;
      logIn(user: User, done: (err: any) => void): void;
      logIn(user: User, options: any, done: (err: any) => void): void;

      logout(
        options: { keepSessionInfo?: boolean },
        done: (err: any) => void
      ): void;
      logout(done: (err: any) => void): void;
      logOut(
        options: { keepSessionInfo?: boolean },
        done: (err: any) => void
      ): void;
      logOut(done: (err: any) => void): void;

      isAuthenticated(): this is AuthenticatedRequest;
      isUnauthenticated(): this is UnauthenticatedRequest;
    }

    interface AuthenticatedRequest extends Request {
      user: User;
    }

    interface UnauthenticatedRequest extends Request {
      user?: undefined;
    }
  }
}

// declare global {
//     namespace Express {
//       interface Request {
//         context: Context
//       }
//     }
//   }

//   interface Profile {
//   provider: string;
//   id: string;
//   displayName: string;
//   username?: string | undefined;
//   name?:
//     | {
//         familyName: string;
//         givenName: string;
//         middleName?: string | undefined;
//       }
//     | undefined;
//   emails?:
//     | Array<{
//         value: string;
//         type?: string | undefined;
//       }>
//     | undefined;
//   photos?:
//     | Array<{
//         value: string;
//       }>
//     | undefined;
// }

// export interface User extends Request {
//   id: string;
//   profile: Profile;
//   accessToken: string;
// }
