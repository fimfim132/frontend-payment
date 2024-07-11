import React, { useState } from "react";

interface PriceButtonProps {
    amount: number;
    label: string;
    selectedAmount: number | null;
    onClick: (amount: number) => void;}

const PriceButton: React.FC<PriceButtonProps> = ({ amount, label, selectedAmount, onClick }) => {
  return (
    <button
      type="button"
      onClick={() => onClick(amount)}
      className={`py-2 px-4 rounded-lg transition duration-300 ${selectedAmount === amount ? 'bg-gray-400 text-white' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`}
    >
      {label}
    </button>
  );
};

export default PriceButton;
