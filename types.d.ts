// Declaration Merging: Augment passport-local's default `IVerifyOptions`.
declare module "passport-local" {
  interface IVerifyOptions {
    message?: string;
    msg: string;
    path: string;
  }
}

type Error = { cause: { msg: string; path: string } };
type PostUserOption = {
  username: string;
  email: string;
  password: string;
  admin: boolean;
  adminCode: string;
};

export type { Error, PostUserOption };
