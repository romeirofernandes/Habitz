const WebSocket = require('ws');

let wss; // WebSocket server
const challengeUpdates = []; // Store recent updates for new connections

// Initialize WebSocket server
const initWebsocket = (server) => {
  wss = new WebSocket.Server({ server });
  
  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    
    // Send recent updates to newly connected clients
    if (challengeUpdates.length > 0) {
      ws.send(JSON.stringify({ 
        type: 'history', 
        updates: challengeUpdates.slice(-20) // Last 20 updates
      }));
    }
    
    ws.on('close', () => console.log('Client disconnected'));
  });
  
  console.log('WebSocket server initialized');
};

// Send challenge update to all connected clients
const sendChallengeUpdate = (update) => {
  if (!wss) {
    console.error("WebSocket server not initialized");
    return;
  }
  
  // Ensure the username is included in the message
  if (!update.username && update.userId) {
    // If username is missing but we have userId, use "User" as fallback
    update.message = update.message.replace("undefined", "User");
  }
  
  // Add timestamp to update
  const timestampedUpdate = {
    ...update,
    timestamp: new Date().toISOString()
  };
  
  // Broadcast to all connected WebSocket clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(timestampedUpdate));
    }
  });
};

module.exports = {
  initWebsocket,
  sendChallengeUpdate
};