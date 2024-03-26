import { generateKeyPair, randomBytes, publicEncrypt, privateDecrypt, createCipheriv, createDecipheriv } from 'crypto';
import { promisify } from 'util';

// Convert callback-based generateKeyPair to a Promise-based function
const generateKeyPairAsync = promisify(generateKeyPair);

// Type definition for RSA key pair
type GenerateRsaKeyPair = {
  publicKey: string;
  privateKey: string;
};

// Generates a pair of private / public RSA keys
export async function generateRsaKeyPair(): Promise<GenerateRsaKeyPair> {
  const { publicKey, privateKey } = await generateKeyPairAsync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });

  return {
    publicKey: publicKey.toString(),
    privateKey: privateKey.toString(),
  };
}

// Export a crypto public key to a base64 string format
export async function exportPubKey(key: string): Promise<string> {
  // Assuming the key is already in PEM format
  return Buffer.from(key).toString("base64");
}

// Export a crypto private key to a base64 string format
export async function exportPrvKey(key: string): Promise<string> {
  // Assuming the key is already in PEM format
  return Buffer.from(key).toString("base64");
}

// RSA encryption using a public key
export function rsaEncrypt(data: string, publicKey: string): string {
  const buffer = Buffer.from(data);
  const encrypted = publicEncrypt(publicKey, buffer);
  return encrypted.toString('base64');
}

// RSA decryption using a private key
export function rsaDecrypt(encryptedData: string, privateKey: string): string {
  const buffer = Buffer.from(encryptedData, 'base64');
  const decrypted = privateDecrypt(privateKey, buffer);
  return decrypted.toString();
}

// Generate a random symmetric key
export async function createRandomSymmetricKey(): Promise<string> {
  const key = randomBytes(32); // For AES-256
  return key.toString('base64');
}

// Symmetric encryption using AES-256
export function symEncrypt(key: string, data: string): string {
  const iv = randomBytes(16); // Initialization vector for AES
  const cipher = createCipheriv('aes-256-gcm', Buffer.from(key, 'base64'), iv);
  let encrypted = cipher.update(data, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
}

// Symmetric decryption using AES-256
export function symDecrypt(key: string, encryptedData: string): string {
  const iv = randomBytes(16); // The IV must be the same used for encryption
  const decipher = createDecipheriv('aes-256-gcm', Buffer.from(key, 'base64'), iv);
  let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
