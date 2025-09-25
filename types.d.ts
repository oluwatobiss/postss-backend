// Declaration Merging: Augment passport-local's default `IVerifyOptions`.
declare module "passport-local" {
  interface IVerifyOptions extends DoneOptions {
    message?: string;
  }
}

type DoneOptions = { msg: string; path: string };
type Error = { cause: DoneOptions };
type User = {
  id: number;
  firstName: string | null;
  lastName: string | null;
  username: string;
  bio: string;
  email: string;
  website: string;
  password: string;
  status: string;
  followers: number[];
  following: number[];
  iat: number;
};
type PostUserOption = User & {
  admin: boolean;
  adminCode: string;
};

export type { DoneOptions, Error, User, PostUserOption };
