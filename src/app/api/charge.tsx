// pages/api/charge.ts
import { NextApiRequest, NextApiResponse } from 'next';
import omise from 'omise';

const omiseClient = omise({
  publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
  secretKey: process.env.NEXT_PUBLIC_SECRET_KEY,
});

const handleCharge = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' });
    return;
  }

  const { token } = req.body;

  try {
    const charge = await omiseClient.charges.create({
      amount: 20000, // amount in satangs (100 satangs = 1 THB)
      currency: 'thb',
      card: token,
    });

    res.status(200).json(charge);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export default handleCharge;
