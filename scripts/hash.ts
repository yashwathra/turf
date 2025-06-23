// hash.ts
import bcrypt from "bcrypt";

async function generateHash(password: string) {
  const hash = await bcrypt.hash(password, 10);
  console.log(`${password} → ${hash}`);
}

generateHash("yash123");

