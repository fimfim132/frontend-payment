import useOmiseCard from '@/app/hooks/useOmiseCard';
import React, { useState } from 'react';

interface TrueMoneyProps {
    amount: number;
    setMessage: (message: string | null) => void;
    setAuthorize_uri: (authorize_uri: string | null) => void;
}

const TrueMoney: React.FC<TrueMoneyProps> = ({
    amount,
    setMessage,
    setAuthorize_uri,
}) => {
    const OmiseCard = useOmiseCard();
    const returnURI = "http://localhost:3000/complete"
    const handleMobileBank = () => {
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
            defaultPaymentMethod: "truemoney_jumpapp",
            onCreateTokenSuccess: async (token: string) => {
              try {
                const response = await fetch("http://localhost:8080/truemoney", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    Token: token,
                    Total: amount,
                    ReturnURI: returnURI
                  }),
                });
                
                if (!response.ok) {
                  throw new Error("Network response was not ok");
                }
      
                const data = await response.json();
                setAuthorize_uri(data.authorize_uri)
                setMessage(
                  `TrueMoney created successfully!`
                );
              } catch (error) {
                console.error("Error creating TrueMoney:", error);
                setMessage(`TrueMoney creation failed. Please try again.`);
              }
            },
          });
    }
  return (
    <button
        type="button"
        onClick={handleMobileBank}
        id="promptPayButton"
        className={`bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition duration-300 ${
          !amount ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={!amount }
      >
        Checkout TrueMoney
      </button>
  );
};

export default TrueMoney;