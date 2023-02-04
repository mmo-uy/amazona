import { compareSync, hashSync } from "bcryptjs";

export const hashPassword = (pass: string) => hashSync(pass);

export const verifyHashedPassword = (pass: string, userPass: string) =>
  compareSync(pass, userPass);

export const getError = (err: any) =>
  err.response && err.response.data && err.response.data.message
    ? err.response.data.message
    : err.message;
