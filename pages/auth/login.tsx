import React, { useEffect } from "react";
import { Layout } from "../../components";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { getError } from "../../utils/index";

type FormValues = {
  password: string;
  email: string;
};
const LoginPage = () => {
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const router = useRouter();
  const { redirect } = router.query;
  useEffect(() => {
    if (session?.user) {
      let url = "/";
      if (redirect) {
        url = redirect.toString();
      }
      router.push(url);
    }
  }, [router, session, redirect]);
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: data["email"],
        password: data["password"],
      });
      if (res?.error) {
        toast.error(res.error);
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };
  return (
    <Layout title="Login">
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="mb-4 text-xl">Login</h1>
        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            {...register("email", {
              required: "Please enter email",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: "Please enter valid email",
              },
            })}
            className="w-full"
            id="email"
            autoFocus
          ></input>
          {errors.email && (
            <div className="text-red-500">{errors.email.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            {...register("password", {
              required: "Please enter password",
              minLength: { value: 6, message: "password is more than 5 chars" },
            })}
            className="w-full"
            id="password"
          ></input>
          {errors.password && (
            <div className="text-red-500 ">{errors.password.message}</div>
          )}
        </div>
        <div className="mb-4 ">
          <button className="primary-button">Login</button>
        </div>
        <div className="mb-4 ">
          Don&apos;t have an account? &nbsp;
          <Link className={"text-green-600"} href={`/auth/register`}>
            Register
          </Link>
        </div>
      </form>
    </Layout>
  );
};

export default LoginPage;
