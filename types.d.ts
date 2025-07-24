// Declaration Merging: Augment passport-local's default `IVerifyOptions`.
declare module "passport-local" {
  interface IVerifyOptions extends DoneOptions {
    message?: string;
  }
}

type DoneOptions = { msg: string; path: string };
type Error = { cause: DoneOptions };
type User = {
  email: string;
  password: string;
  username: string;
};
type Payload = User & {
  id: number;
  firstName: string | null;
  lastName: string | null;
  status: string;
};
type PostUserOption = User & {
  admin: boolean;
  adminCode: string;
};

export type { DoneOptions, Error, Payload, PostUserOption };
