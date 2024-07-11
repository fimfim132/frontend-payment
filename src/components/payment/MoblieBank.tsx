import useOmiseCard from "@/hooks/useOmiseCard";
import React, { useState } from "react";

interface MoblieBankProps {
    banks: { value: string; label: string }[];
    selectedBank: string | null;
    handleBankChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    amount: number;
    setMessage: (message: string | null) => void;
    setAuthorize_uri: (authorize_uri: string | null) => void;
  }

const MoblieBank: React.FC<MoblieBankProps> = ({
    banks,
    selectedBank,
    handleBankChange,
    amount,
    setMessage,
    setAuthorize_uri,
}) => {
    const OmiseCard = useOmiseCard();
    const returnURI = "http://localhost:3000/complete"
    const handleMobileBank = async () => {
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
          defaultPaymentMethod: selectedBank,
          onCreateTokenSuccess: async (token: string) => {
            try {
              const response = await fetch("http://localhost:8080/mobilebank", {
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
              console.log(token);
              
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
    
              const data = await response.json();
              setMessage(
                `Mobile Bank created successfully!`
              );
              setAuthorize_uri(data.authorize_uri)
            } catch (error) {
              console.error("Error creating Mobile Bank:", error);
              setMessage(`Mobile Bank creation failed. Please try again.`);
            }
          },
        });
      };
  return (
    <>
      <label htmlFor="bank" className="text-lg font-semibold mt-4">
        Select Bank
      </label>
      <select
        id="bank"
        value={selectedBank || ""}
        onChange={handleBankChange}
        className="py-2 px-4 rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400 transition duration-300"
      >
        <option value="" disabled>
          Select a bank
        </option>
        {banks.map((bank) => (
          <option key={bank.value} value={bank.value}>
            {bank.label}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={handleMobileBank}
        id="promptPayButton"
        className={`bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300 ${
          !amount || selectedBank == null ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={!amount || selectedBank == null}
      >
        Checkout Mobile Bank {selectedBank}
      </button>
    </>
  );
};

export default MoblieBank;
