type Error = { cause: { msg: string; path: string } };
type PostUserOption = {
  username: string;
  email: string;
  password: string;
  admin: boolean;
  adminCode: string;
};

export type { Error, PostUserOption };
