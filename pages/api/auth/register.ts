import { connectDB } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const { name, email, password } = req.body;

  try {
    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'User registered', userId: newUser._id });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
}
