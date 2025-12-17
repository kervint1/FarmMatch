import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      dbUserId?: number;
      email?: string;
      name?: string;
      image?: string;
      userType?: string;
    };
  }

  interface User {
    id: string;
    dbUserId?: number;
    email?: string;
    name?: string;
    image?: string;
    userType?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    dbUserId?: number;
    email?: string;
    name?: string;
    picture?: string;
    userType?: string;
    accessToken?: string;
  }
}
