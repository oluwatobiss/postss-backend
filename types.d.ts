// Declaration Merging: Augment passport-local's default `IVerifyOptions`
// by adding DoneOptions to it and making its default message optional.
declare module "passport-local" {
  interface IVerifyOptions extends DoneOptions {
    message?: string;
  }
}

type GithubProfileJson = {
  avatar_url: string;
  bio: string;
  blog: string;
  email: string;
};
type GithubProfile = {
  id: string;
  nodeId: string;
  displayName: string;
  username: string;
  profileUrl: string;
  emails: { value: string }[];
  photos: { value: string }[];
  provider: string;
  _json: GithubProfileJson;
};
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

export type { DoneOptions, Error, GithubProfile, PostUserOption, User };
