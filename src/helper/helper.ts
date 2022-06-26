/* eslint-disable no-useless-catch */
import bcrypt from 'bcrypt';

export const comparePassword = async (password: string, hash: string) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    throw error;
  }
};

export const generatePasswordHash = async (password: string) => {
  try {
    const salt = await bcrypt.genSalt(10);
    // now we set user password to hashed password
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    throw error;
  }
};
