import * as dotenv from "dotenv";

dotenv.config();
let path;
switch (process.env.NODE_ENV) {
  case "test":
    path = `${__dirname}/../../.env.test`;
    break;
  case "production":
    path = `${__dirname}/../../.env.production`;
    break;
  default:
    path = `${__dirname}/../../.env.development`;
}
dotenv.config({ path: path });

export const JWT_SECRET = process.env.JWT_SECRET as string;
export const G_CLIENT = process.env.G_CLIENT as string;
export const APP_ANGULAR = process.env.APP_ANGULAR as string;
export const G_MAILU = process.env.G_MAILU as string;
export const G_MAILP = process.env.G_MAILP as string;
export const P_MAIL = process.env.P_MAIL as string;