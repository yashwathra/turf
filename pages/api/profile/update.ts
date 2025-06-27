import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import User from '@/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Authorization token missing' });

  const userData = await verifyToken(token);
  if (!userData || (!userData._id && !userData.email)) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const { name, phone, gender, dob, address, avatarUrl } = req.body;

  // ✅ Simple validation
  const allowedGenders = ['male', 'female', 'other'];
  if (gender && !allowedGenders.includes(gender)) {
    return res.status(400).json({ error: 'Invalid gender value' });
  }

  if (dob && isNaN(Date.parse(dob))) {
    return res.status(400).json({ error: 'Invalid date format' });
  }

  try {
    // ✅ Prefer _id if present, fallback to email
    const query = userData._id ? { _id: userData._id } : { email: userData.email };

    const updatedUser = await User.findOneAndUpdate(
      query,
      { name, phone, gender, dob, address, avatarUrl },
      { new: true }
    ).select('-password');

    if (!updatedUser) return res.status(404).json({ error: 'User not found' });

    return res.status(200).json({ user: updatedUser });
  } catch (err) {
    console.error('Profile update error:', err);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
}
