import { prisma } from "@/lib/prisma";
import argon2 from "argon2";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end(); // Method Not Allowed

  const { name, email, password } = req.body;
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return res.status(409).json({ error: "User already exists" }); // Conflict
  }

  const hashedPassword = await argon2.hash(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  res.status(201).json({
    user: { id: user.id, email: user.email }
  }); // Created
}
