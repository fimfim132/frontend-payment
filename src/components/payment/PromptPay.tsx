import useOmiseCard from "@/hooks/useOmiseCard";
import next from "next";
import React, { useEffect, useState } from "react";

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
          console.table(data)
          setPromptPayURL(data.promptPayURL);
          setMessage(
            `PromptPay created successfully! Please scan the QR code. ${data.chargeID}`
          );
          console.log("chargeID" + data.chargeID);

          checkStatus(data.chargeID);
        } catch (error) {
          console.error("Error creating PromptPay:", error);
          setMessage(`PromptPay creation failed. Please try again.`);
        }
      },
    });
  };

  const checkStatus = async (
    chargeID: string,
    interval: number = 5000
  ): Promise<void> => {
    let paymentSuccess = false;

    while (!paymentSuccess) {
      try {
        const response = await fetch(
          `http://localhost:8080/check-status/${chargeID}`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        const expireTime = new Date(data.expire).getTime();
        const currentTime = new Date().getTime();

        if (expireTime > currentTime) {
          if (data.status === "successful") {
            paymentSuccess = true;
            console.log("Status is Successful");
            window.location.href = "/complete";
            setMessage(`Payment Successful!`);
            setPromptPayURL(null);
          } else {
            console.log("Status is Pending");
          }
        } else {
          console.log("Status is Expired");
          setMessage(`Payment Expired!`);
          setPromptPayURL(null);
          paymentSuccess = true;
        }
        
        await new Promise((resolve) => setTimeout(resolve, interval));
      } catch (error) {
        console.error("Error checking payment status:", error);
        break;
      }
    }
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
