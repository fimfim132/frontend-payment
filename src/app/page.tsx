"use client";
import { useRef, useState } from "react";
import useOmiseCard from "./hooks/useOmiseCard";

export default function Home() {
  const formRef = useRef<HTMLFormElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [promptPayURL, setPromptPayURL] = useState<string | null>(null);
  const OmiseCard = useOmiseCard();
  const [amount, setAmount] = useState<number>(0);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!OmiseCard) {
      console.error("OmiseCard is not loaded");
      return;
    }

    OmiseCard.configure({
      publicKey: "pkey_test_60825m9he0zc7scunk7",
    });

    OmiseCard.open({
      amount: amount,
      currency: 'THB',
      defaultPaymentMethod: 'credit_card',
      onCreateTokenSuccess: async (nonce: string) => {
        if (formRef.current) {
          try {
            const response = await fetch('http://localhost:8080/charge', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                Token: nonce,
                Total: amount
              }),
            });
  
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
  
            const data = await response.json();
            setMessage(`Payment successful! Charge ID: ${data.id}`);
          } catch (error) {
            console.error('Error processing payment:', error);
            setMessage(`Payment failed. Please try again. ${nonce}`);
          }
        }
      },
    });
  };


  const handlePromptPay = async () => {
    try {
      const response = await fetch('http://localhost:8080/promptpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ total: amount }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setPromptPayURL(data.promptPayURL);
      setMessage(`PromptPay created successfully! Please scan the QR code.`);
    } catch (error) {
      console.error('Error creating PromptPay:', error);
      setMessage(`PromptPay creation failed. Please try again.`);
    }
  };

  const setAmountValue = (value: number) => {
    setAmount(value);
    setSelectedAmount(value);
  };

  return (
    <div className="max-w-md mx-auto mt-8">
    <form id="checkoutForm" ref={formRef} className="flex flex-col space-y-4 bg-white p-6 rounded-lg shadow-lg">
      <label htmlFor="amount" className="text-lg font-semibold">Select value</label>
      <div className="flex space-x-2">
          <button 
            type="button" 
            onClick={() => setAmountValue(12900)} 
            className={`py-2 px-4 rounded-lg transition duration-300 ${selectedAmount === 12900 ? 'bg-gray-400 text-white' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`}
          >
            129
          </button>
          <button 
            type="button" 
            onClick={() => setAmountValue(25500)} 
            className={`py-2 px-4 rounded-lg transition duration-300 ${selectedAmount === 25500 ? 'bg-gray-400 text-white' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`}
          >
            255
          </button>
          <button 
            type="button" 
            onClick={() => setAmountValue(38400)} 
            className={`py-2 px-4 rounded-lg transition duration-300 ${selectedAmount === 38400 ? 'bg-gray-400 text-white' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`}
          >
            384
          </button>
          <button 
            type="button" 
            onClick={() => setAmountValue(51500)} 
            className={`py-2 px-4 rounded-lg transition duration-300 ${selectedAmount === 51500 ? 'bg-gray-400 text-white' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`}
          >
            515
          </button>
          <button 
            type="button" 
            onClick={() => setAmountValue(64300)} 
            className={`py-2 px-4 rounded-lg transition duration-300 ${selectedAmount === 64300 ? 'bg-gray-400 text-white' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`}
          >
            643
          </button>
        </div>
        <button 
          type="submit" 
          onClick={handleClick} 
          id="checkoutButton" 
          className={`bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 ${!selectedAmount ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!selectedAmount}
        >
          Checkout
        </button>
        <button 
          type="button" 
          onClick={handlePromptPay} 
          id="promptPayButton" 
          className={`bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300 ${!amount ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!amount}
        >
        Generate PromptPay QR Code
      </button>
    </form>
    {message && <p className="mt-4 text-red-500">{message}</p>}
    {promptPayURL && <img src={promptPayURL} alt="PromptPay QR Code" className="w-96 mt-4 mx-auto" />}
  </div>
  
  );
}
