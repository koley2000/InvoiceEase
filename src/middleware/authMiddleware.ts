import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../pages/api/auth/[...nextauth]"; // adjust path if needed
import { prisma } from "@/lib/prisma";


export const authMiddleware = async ( req: NextApiRequest, res: NextApiResponse ) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user?.email) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }

  return user; // Return user if authenticated
}
