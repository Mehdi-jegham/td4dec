import express from 'express';
import { REGISTRY_PORT } from '../config';

type NodeInfo = {
  nodeId: number;
  publicKey: string;
};

const nodeRegistry: NodeInfo[] = [];

const app = express();
app.use(express.json());

app.post('/registerNode', (req, res) => {
  const { nodeId, publicKey } = req.body;
  const existingNode = nodeRegistry.find(node => node.nodeId === nodeId);

  if (existingNode) {
    return res.status(400).json({ message: 'Node already registered.' });
  }

  nodeRegistry.push({ nodeId, publicKey });
  console.log(`Node ${nodeId} registered with publicKey: ${publicKey}`);
  res.status(201).json({ message: 'Node registered successfully.' });
});

app.get('/getNodes', (req, res) => {
  res.json({ nodes: nodeRegistry });
});

app.listen(REGISTRY_PORT, () => {
  console.log(`Registry server is listening on port ${REGISTRY_PORT}`);
});

export default app;
