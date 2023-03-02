import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Layout } from "../../components";
import { signup } from "../../services/auth";
import Link from "next/link";
import { toast } from "react-toastify";

import { useRouter } from "next/router";

type FormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};
const RegisterPage = () => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm<FormValues>();
  const submitHandler: SubmitHandler<FormValues> = async (data) => {
    try {
      const { name, email, password } = data;
      const user = await signup({ name, email, password });
      if (!user.data) {
        //TODO move to utils
        toast.error("An error ocurred!!!", {
          autoClose: 1500,
        });
      }
      //TODO move to utils
      toast.success(`Welcome! ${user.data.name}`, {
        autoClose: 2000,
      });
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch (err) {
      //TODO move to utils
      toast.error("An error ocurred!!!", {
        autoClose: 1500,
      });
    }
  };
  return (
    <Layout title="Create Account">
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Create Account</h1>
        <div className="mb-4">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="w-full"
            id="name"
            autoFocus
            {...register("name", {
              required: "Please enter name",
            })}
          />
          {errors.name && (
            <div className="text-red-500">{errors.name.message}</div>
          )}
        </div>

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
        <div className="mb-4">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            className="w-full"
            type="password"
            id="confirmPassword"
            {...register("confirmPassword", {
              required: "Please enter confirm password",
              validate: (value) => value === getValues("password"),
              minLength: {
                value: 6,
                message: "confirm password is more than 5 chars",
              },
            })}
          />
          {errors.confirmPassword && (
            <div className="text-red-500 ">
              {errors.confirmPassword.message}
            </div>
          )}
          {errors.confirmPassword &&
            errors.confirmPassword.type === "validate" && (
              <div className="text-red-500 ">Password do not match</div>
            )}
        </div>

        <div className="mb-4 ">
          <button className="primary-button">Register</button>
        </div>
        <div className="mb-4 ">
          Already have an account? &nbsp;
          <Link className={"text-green-600"} href="/auth/login">
            Login
          </Link>
        </div>
      </form>
    </Layout>
  );
};

export default RegisterPage;
