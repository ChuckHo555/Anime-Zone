import { AuthObject } from "@clerk/nextjs/dist/types/server";

declare module "next" {
  interface NextApiRequest {
    auth: () => Promise<AuthObject>;
  }
}
