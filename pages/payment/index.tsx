import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { CheckoutWizard, Layout } from "../../components";
import { selectPaymentMethod } from "../../redux/slices/cart";
import { PaymentMethod } from "../../types";
import { availablePaymentMethods } from "../../utils/mocked";

const PaymentScreen = () => {
  const dispatch = useAppDispatch();
  const { paymentMethod } = useAppSelector((state) => state.cart);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(paymentMethod!);
  const router = useRouter();
  const submitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault();
    dispatch(selectPaymentMethod(selectedPaymentMethod!));
    router.push("/order");
  };

  return (
    <Layout title="Payment Method">
      <CheckoutWizard activeStep={2} />
      <form className="mx-auto max-w-screen-md" onSubmit={submitHandler}>
        <h1 className="mb-4 text-xl">Payment Method</h1>
        {availablePaymentMethods.map((payment) => (
          <div key={payment.value} className="mb-4">
            <input
              name="paymentMethod"
              className="p-2 outline-none focus:ring-0"
              id={payment.value!}
              type="radio"
              checked={selectedPaymentMethod?.name === payment.name}
              onChange={() => setSelectedPaymentMethod(payment)}
            />

            <label className="p-2" htmlFor={payment.value}>
              {payment.name}
            </label>
          </div>
        ))}
        <div className="mb-4 flex justify-between">
          <button
            onClick={() => router.push("/shipping")}
            type="button"
            className="default-button"
          >
            Back
          </button>
          <button className="primary-button">Next</button>
        </div>
      </form>
    </Layout>
  );
};

export default PaymentScreen;
PaymentScreen.auth = true;
