import useOmiseCard from "@/app/hooks/useOmiseCard";
import React, { useRef, useState } from "react";

interface CreditCardProps {
  amount: number;
  setMessage: any;
}

const CreditCard: React.FC<CreditCardProps> = ({ amount, setMessage }) => {
  const OmiseCard = useOmiseCard();
  const handleCard = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!OmiseCard) {
      console.error("OmiseCard is not loaded");
      return;
    }

    OmiseCard.configure({
      publicKey: "pkey_test_60825m9he0zc7scunk7",
    });

    //ส่ง order รับ return เลข order

    OmiseCard.open({
      amount: amount,
      currency: "THB",
      defaultPaymentMethod: "credit_card",
      onCreateTokenSuccess: async (nonce: string) => {
        try {
          const response = await fetch("http://localhost:8080/card", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              Token: nonce,
              Total: amount,
            }),
          });

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.json();
          setMessage(`Credit/Debit Card created successfully!`);
        } catch (error) {
          console.error("Error processing payment:", error);
          setMessage(`Payment failed. Please try again. ${nonce}`);
        }
      },
    });
  };
  return (
    <button
      type="submit"
      onClick={handleCard}
      id="checkoutButton"
      className={`bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 ${
        !amount ? "opacity-50 cursor-not-allowed" : ""
      }`}
      disabled={!amount}
    >
      Checkout Credit/Debit Card
    </button>
  );
};

export default CreditCard;
