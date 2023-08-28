import bcrypt from "bcrypt";
import CryptoJS from "crypto-js";
// import { createHash } from 'crypto'; // Import for SHA-256
import Sha2 from 'sha2';

export const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(12, (err, salt) => {
      if (err) {
        reject(err);
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err);
        }
        resolve(hash); 
      });
    });
  });
};

export const comparePassword = (password, hashed) => {
  return bcrypt.compare(password, hashed);
};

// export const hashData = (data, secretKey) => {
//   const hash = new Keccak(256);
//   const hashedData = hash.update(data).update(secretKey)
//   return hashedData;
// };

export const hashData = (data, secretKey) => {
  let key = secretKey ? secretKey : '';
  const concatenatedData = data + key;
  const hashedData = Sha2.sha256(concatenatedData).toString('hex');
  return hashedData;
};

export const encryptData = (data, secretKey) => {
  const encrypted = CryptoJS.AES.encrypt(data, secretKey).toString();
  return encrypted;
};
