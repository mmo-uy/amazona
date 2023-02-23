import React, { useContext, useEffect } from "react";
import { Layout } from "../../components";
import { CheckoutWizard } from "../../components";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getError } from "../../utils/index";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { updateShippingAddress } from "../../redux/slices/cart";
import { useRouter } from "next/router";

type FormValues = {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};
const ShippingScreen = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormValues>();
  const { shippingAddress } = useAppSelector((state) => state.cart);
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      dispatch(updateShippingAddress(data));
      router.push("/payment");
    } catch (err) {
      toast.error(getError(err));
    }
  };
  useEffect(() => {
    setValue("fullName", shippingAddress?.fullName!);
    setValue("address", shippingAddress?.address!);
    setValue("city", shippingAddress?.city!);
    setValue("country", shippingAddress?.country!);
    setValue("postalCode", shippingAddress?.postalCode!);
  }, [shippingAddress, setValue]);

  return (
    <Layout title="Shipping Address">
      <CheckoutWizard activeStep={1} />
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="mb-4 text-xl">Shipping Address</h1>
        <div className="mb-4">
          <label htmlFor="fullName">Full Name</label>
          <input
            className="w-full"
            id="fullName"
            autoFocus
            {...register("fullName", {
              required: "Please enter full name",
            })}
          />
          {errors.fullName && (
            <div className="text-red-500">{errors.fullName.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="address">Address</label>
          <input
            className="w-full"
            id="address"
            {...register("address", {
              required: "Please enter address",
              minLength: { value: 3, message: "Address is more than 2 chars" },
            })}
          />
          {errors.address && (
            <div className="text-red-500">{errors.address.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="city">City</label>
          <input
            className="w-full"
            id="city"
            {...register("city", {
              required: "Please enter city",
            })}
          />
          {errors.city && (
            <div className="text-red-500 ">{errors.city.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="postalCode">Postal Code</label>
          <input
            className="w-full"
            id="postalCode"
            {...register("postalCode", {
              required: "Please enter postal code",
            })}
          />
          {errors.postalCode && (
            <div className="text-red-500 ">{errors.postalCode.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="country">Country</label>
          <input
            className="w-full"
            id="country"
            {...register("country", {
              required: "Please enter country",
            })}
          />
          {errors.country && (
            <div className="text-red-500 ">{errors.country.message}</div>
          )}
        </div>
        <div className="mb-4 flex justify-between">
          <button className="primary-button">Next</button>
        </div>
      </form>
    </Layout>
  );
};

export default ShippingScreen;
ShippingScreen.auth = true;
