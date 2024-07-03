"use client";
import { useEffect, useRef, useState } from "react";
import useOmiseCard from "./hooks/useOmiseCard";
import CreditCard from "./components/payment/CreditCard";
import PromptPay from "./components/payment/PromptPay";
import PriceButton from "./components/button/PriceButton";
import MoblieBank from "./components/payment/MoblieBank";
import TrueMoney from "./components/payment/TrueMoney";
import AliPay from "./components/payment/AliPay";

export default function Home() {
  const formRef = useRef<HTMLFormElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [promptPayURL, setPromptPayURL] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [prices, setPrices] = useState<{ amount: number; label: string }[]>([]);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [banks, setBanks] = useState<{ value: string; label: string }[]>([]);
  const [authorize_uri, setAuthorize_uri] = useState<string | null>(null);

  const setAmountValue = (value: number) => {
    setAmount(value);
    setSelectedAmount(value);
  };

  useEffect(() => {
    const fetchData = async () => {
      fetch("/price/data.json")
        .then((response) => response.json())
        .then((data) => setPrices(data))
        .catch((error) => console.error("Error fetching JSON:", error));
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchBanks = async () => {
      fetch("/bank/data.json")
        .then((response) => response.json())
        .then((data) => setBanks(data))
        .catch((error) => console.error("Error fetching banks JSON:", error));
    };
    fetchBanks();
  }, []);

  const handleBankChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBank(event.target.value);
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <form
        id="checkoutForm"
        ref={formRef}
        className="flex flex-col space-y-4 bg-white p-6 rounded-lg shadow-lg"
      >
        <label htmlFor="amount" className="text-lg font-semibold">
          Select value
        </label>
        <div className="flex space-x-2">
          {prices.map(({ amount, label }) => (
            <PriceButton
              key={amount}
              amount={amount}
              label={label}
              selectedAmount={selectedAmount}
              onClick={setAmountValue}
            />
          ))}
        </div>
        <CreditCard setMessage={setMessage} amount={amount} />
        <PromptPay
          setMessage={setMessage}
          amount={amount}
          setPromptPayURL={setPromptPayURL}
        />
        <TrueMoney 
          amount={amount}
          setMessage={setMessage}
          setAuthorize_uri={setAuthorize_uri}
          />
          <AliPay 
          amount={amount}
          setMessage={setMessage}
          setAuthorize_uri={setAuthorize_uri}
          />
        <MoblieBank
          banks={banks}
          selectedBank={selectedBank}
          handleBankChange={handleBankChange}
          amount={amount}
          setMessage={setMessage}
          setAuthorize_uri={setAuthorize_uri}
        />
      </form>
      {message && <p className="mt-4 text-red-500">{message}</p>}
      {promptPayURL && (
        <img
          src={promptPayURL}
          alt="PromptPay QR Code"
          className="w-96 mt-4 mx-auto"
        />
      )}
      {authorize_uri && (
        <a href={authorize_uri}
        className={`py-2 px-4 rounded-lg transition duration-300 ${selectedAmount === amount ? 'bg-gray-400 text-white' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`}>
          go to pay in app
        </a>
      )}
    </div>
  );
}
