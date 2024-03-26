import express from 'express';
import { BASE_ONION_ROUTER_PORT, REGISTRY_PORT } from '../config';
import { generateRsaKeyPair, exportPubKey } from '../crypto'; // Ensure the path is correct
import axios from 'axios';

let lastReceivedEncryptedMessage: string | null = null;
let lastReceivedDecryptedMessage: string | null = null;
let lastMessageDestination: number | null = null;

export async function simpleOnionRouter(nodeId: number) {
  const onionRouter = express();
  onionRouter.use(express.json());

  onionRouter.get('/getLastReceivedEncryptedMessage', (req, res) => {
    res.json({ lastReceivedEncryptedMessage });
  });

  onionRouter.get('/getLastReceivedDecryptedMessage', (req, res) => {
    res.json({ lastReceivedDecryptedMessage });
  });

  onionRouter.get('/getLastMessageDestination', (req, res) => {
    res.json({ lastMessageDestination });
  });

  onionRouter.get('/status', (req, res) => {
    res.send('Node is alive and kicking!');
  });

  const server = onionRouter.listen(BASE_ONION_ROUTER_PORT + nodeId, async () => {
    console.log(`Onion router node ${nodeId} is listening on port ${BASE_ONION_ROUTER_PORT + nodeId}`);

    try {
      const { publicKey, privateKey } = await generateRsaKeyPair();
      const publicKeyString = await exportPubKey(publicKey);

      await axios.post(`http://localhost:${REGISTRY_PORT}/registerNode`, {
        nodeId,
        publicKey: publicKeyString,
      });

      console.log(`Node ${nodeId} registered with registry.`);
    } catch (error) {
      console.error(`Error during registration of node ${nodeId}:`, error);
    }
  });

  return server;
}
