// hooks/useOmiseCard.ts
import { useEffect, useState } from 'react';

const useOmiseCard = () => {
  const [OmiseCard, setOmiseCard] = useState<any>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.omise.co/omise.js';
    script.async = true;
    script.onload = () => setOmiseCard((window as any).OmiseCard);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return OmiseCard;
};

export default useOmiseCard;
