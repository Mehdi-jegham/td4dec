import express from 'express';
import { BASE_USER_PORT } from "../config";

// Define a data structure to store the last sent and received messages
let lastReceivedMessage: string | null = null;
let lastSentMessage: string | null = null;

export async function simpleUser(userId: number) {
  const userServer = express();
  userServer.use(express.json());

  // Implement the status route
  userServer.get('/status/', (req, res) => {
    res.send('live');
  });

  // GET route to return the last received message
  userServer.get('/getLastReceivedMessage', (req, res) => {
    res.json({ result: lastReceivedMessage });
  });

  // GET route to return the last sent message
  userServer.get('/getLastSentMessage', (req, res) => {
    res.json({ result: lastSentMessage });
  });

  // Start the server and listen on the calculated port for users
  const server = userServer.listen(BASE_USER_PORT + userId, () => {
    console.log(`User ${userId} is listening on port ${BASE_USER_PORT + userId}`);
  });

  return server;
}
