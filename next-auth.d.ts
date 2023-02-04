// import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
// import { User } from "./types";

// declare module "next-auth/jwt" {
//   interface User {
//     isAdmin: true | false;
//     id: User["id"];
//   }
// }
// declare module "next-auth/jwt" {
//   interface JWT {
//     id: User["id"];
//     isAdmin: true | false;
//   }
// }
// declare module "next-auth" {
//   interface JWT {
//     isAdmin: true | false;
//   }
// }
// declare module "next-auth" {
//   interface Session {
//     user: User;
//     isAdmin: true | false;
//   }
// }
import { DefaultSession, DefaultUser } from "next-auth";
import { Role } from "./types";

interface IUser extends DefaultUser {
  role?: Role;
}
declare module "next-auth" {
  interface User extends IUser {}
  interface Session {
    user?: User;
  }
}
declare module "next-auth/jwt" {
  interface JWT extends IUser {}
}
