"use client";

import { ShippingFormInputs } from "@repo/types";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";

const CheckoutForm = ({
  shippingForm,
}: {
  shippingForm: ShippingFormInputs;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3002/return",
        receipt_email: shippingForm.email,
        shipping: {
          address: {
            line1: shippingForm.address,
            city: shippingForm.city,
            country: "US",
          },
          name: shippingForm.email, // Or use a real name field if available
        }
      },
    });

    if (error) {
      setError(error.message || "An error occurred");
    }
    setLoading(false);
  };

  return (
    <form className="space-y-6">
      <PaymentElement options={{ layout: "accordion" }} />
      <button
        disabled={loading || !stripe}
        onClick={handleClick}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing...
          </div>
        ) : (
          `Pay Now`
        )}
      </button>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-medium animate-pulse">
          {error}
        </div>
      )}
    </form>
  );
};

export default CheckoutForm;
