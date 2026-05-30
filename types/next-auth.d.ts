import { RoleCode } from "@prisma/client";
import type { DefaultSession } from "next-auth";
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    role?: RoleCode;
    permissions?: string[];
  }

  interface Session {
    user: {
      id: string;
      role?: RoleCode;
      permissions: string[];
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: RoleCode;
    permissions?: string[];
  }
}
