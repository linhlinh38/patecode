import bcrypt from "bcrypt";

export async function encryptedPassword(password: string) {
  const salt = await bcrypt.genSalt(8);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}
