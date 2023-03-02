import axios, { AxiosPromise } from "axios";
import { User } from "../../types";

export const signup = async (user: {
  name: string;
  email: string;
  password: string;
}): AxiosPromise<User> => await axios.post("/api/auth/signup", user);
