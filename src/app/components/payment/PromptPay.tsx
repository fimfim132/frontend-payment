import useOmiseCard from "@/app/hooks/useOmiseCard";
import React, { useState } from "react";

interface PromptPayProps {
  amount: number;
  setMessage: any;
  setPromptPayURL: any;
}

const PromptPay: React.FC<PromptPayProps> = ({
  amount,
  setMessage,
  setPromptPayURL,
}) => {
  const OmiseCard = useOmiseCard();
  const handlePromptPay = async () => {
    if (!OmiseCard) {
      console.error("OmiseCard is not loaded");
      return;
    }

    OmiseCard.configure({
      publicKey: "pkey_test_60825m9he0zc7scunk7",
    });

    OmiseCard.open({
      amount: amount,
      currency: "THB",
      defaultPaymentMethod: "promptpay",
      onCreateTokenSuccess: async (token: string) => {
        try {
          const response = await fetch("http://localhost:8080/promptpay", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              Token: token,
              Total: amount,
            }),
          });
          
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.json();
          setPromptPayURL(data.promptPayURL);
          setMessage(
            `PromptPay created successfully! Please scan the QR code.`
          );
        } catch (error) {
          console.error("Error creating PromptPay:", error);
          setMessage(`PromptPay creation failed. Please try again.`);
        }
      },
    });
  };
  return (
    <button
      type="button"
      onClick={handlePromptPay}
      id="promptPayButton"
      className={`bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300 ${
        !amount ? "opacity-50 cursor-not-allowed" : ""
      }`}
      disabled={!amount}
    >
      Generate PromptPay QR Code
    </button>
  );
};

export default PromptPay;
