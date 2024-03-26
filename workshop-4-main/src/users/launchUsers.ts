

// launchUsers.ts

import { simpleUser } from './user'; // Changed from { user as startUserServer }

export async function launchUsers(userCount: number): Promise<any[]> {
  const userServers = [];
  
  for (let userId = 0; userId < userCount; userId++) {
    const userServer = simpleUser(userId); // Changed from startUserServer
    userServers.push(userServer);
  }

  // Wait for all user servers to be started if they return promises
  await Promise.all(userServers);
  
  return userServers;
}
