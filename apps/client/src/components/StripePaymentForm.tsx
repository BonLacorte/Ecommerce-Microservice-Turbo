'use client'

import { useAuth } from '@clerk/nextjs';
import { CheckoutProvider } from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import { useEffect, useState } from "react";
import { CartItemsType, ShippingFormInputs } from "@repo/types";
import CheckoutForm from "./CheckoutForm";
import useCartStore from "@/stores/cartStore";

// const stripe = loadStripe("pk_test_51SbchuQbmZcBa2zNyqf6ZI7GEMkSJ82KvpPMdpgz1u8lnz0Fez3Npl58cmmx0mZ4PHo9c3AeE7lGug5fgbWdhs6t00zMd5fpF2");

const stripePromise = loadStripe(
  "pk_test_51SbchfHe2WNNGOd950qplQbthFZFleKicj1VyVKGPp0IbTceocNAHAf58pKULgoNRQqBFdWjIZMArsZFnA3ZbEJT00ilMRgSJf"
); // Renamed for clarity

const fetchClientSecret = async (cart: CartItemsType, token: string) => {
  return fetch(
    `${process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL}/sessions/create-checkout-session`,
    {
      method: "POST",
      body: JSON.stringify({
        cart,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((response) => response.json())
    .then((json) => json.checkoutSessionClientSecret);
};

const StripePaymentForm = ({
  shippingForm,
}: {
  shippingForm: ShippingFormInputs;
}) => {
  const { cart } = useCartStore();
  const [token, setToken] = useState<string | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    getToken().then((token) => setToken(token));
  }, []);

  if (!token) {
    return <div className="">Loading...</div>;
  }

  return (
    <CheckoutProvider
      // Pass the promise directly
      stripe={stripePromise} 
      options={{ fetchClientSecret: () => fetchClientSecret(cart, token!) }}
    >
      <CheckoutForm shippingForm={shippingForm} />
    </CheckoutProvider>
  );
};



export default StripePaymentForm;