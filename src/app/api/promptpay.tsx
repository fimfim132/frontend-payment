// pages/api/promptpay.ts
import { NextApiRequest, NextApiResponse } from 'next';
import omise from 'omise';

const omiseClient = omise({
    publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
    secretKey: process.env.NEXT_PUBLIC_SECRET_KEY,
});

const handlePromptPay = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' });
    return;
  }

  const { total } = req.body;

  try {
    // Create PromptPay source
    const source = await omiseClient.sources.create({
      amount: total,
      currency: 'thb',
      type: 'promptpay',
    });

    // Create charge using the PromptPay source ID
    const charge = await omiseClient.charges.create({
      amount: total,
      currency: 'thb',
      source: source.id,
    });

    res.status(200).json({
      charge,
      promptPayURL: source.scannable_code?.image?.download_uri, // Correctly access the QR code URL
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export default handlePromptPay;
