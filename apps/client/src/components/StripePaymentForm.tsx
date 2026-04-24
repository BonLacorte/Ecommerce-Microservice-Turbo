"use client";

import { useAuth } from '@clerk/nextjs';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import { useEffect, useState } from "react";
import { CartItemsType, ShippingFormInputs } from "@repo/types";
import useCartStore from "@/stores/cartStore";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const fetchClientSecret = async (cart: CartItemsType, token: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL}/sessions/create-checkout-session`,
    {
      method: "POST",
      body: JSON.stringify({ cart }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  
  if (!response.ok) throw new Error("Failed to create session");
  const json = await response.json();
  return json.clientSecret; // We'll update the server to return this name
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
    getToken().then(setToken);
  }, []);

  if (!token) return <div className="p-8 text-center">Authenticating...</div>;

  const options = { fetchClientSecret: () => fetchClientSecret(cart, token) };

  return (
    <div id="checkout" className="min-h-[600px]">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};



export default StripePaymentForm;