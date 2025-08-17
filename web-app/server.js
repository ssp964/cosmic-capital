// server.js
require('dotenv').config();
const express = require('express');

const bodyParser = require('body-parser');
const { spawn } = require('child_process');
console.log('BASESEPOLIA KEY:', process.env.HYP_BASESEPOLIA_PRIVATE_KEY);
console.log('HOLESKY KEY:', process.env.HYP_HOLESKY_PRIVATE_KEY);

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Enable CORS for the web app
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Combined endpoint: deploy and immediately send (with streaming logs)
// Combined endpoint: deploy and immediately send (with streaming logs, using HYP_KEY)
app.post('/deploy-and-send', (req, res) => {
    const {
      configPath,
      from,
      to,
      tokenAddress,
      recipient,
      amount
    } = req.body;
  
    if (!configPath || !from || !to || !tokenAddress || !recipient || !amount) {
      return res.status(400).json({ error: 'Missing required parameters.' });
    }
  
    // Single Hyperlane private key from .env
    const hyperlaneKey = process.env.HYP_KEY;
    if (!hyperlaneKey) {
      return res.status(500).json({ error: 'HYP_KEY not found in environment variables.' });
    }
  
    console.log('[+] Starting deployment (stream mode)...');
  
    // Spawn the deployment process
    const deployProc = spawn('hyperlane', [
      'warp', 'deploy',
      '--config', configPath,
      '--yes'
    ], {
      env: {
        ...process.env,    // includes HYP_KEY from dotenv
      },
      stdio: ['pipe', 'pipe', 'pipe']
    });
  
    deployProc.stdout.on('data', (data) => {
      console.log(`[deploy] ${data.toString()}`);
    });
  
    deployProc.stderr.on('data', (data) => {
      console.error(`[deploy] ${data.toString()}`);
    });
  
    deployProc.on('close', (code) => {
      console.log(`[deploy] Process exited with code ${code}`);
  
      if (code !== 0) {
        return res.status(500).json({ error: 'Deploy failed with exit code ' + code });
      }
  
      console.log('✅ Deployment completed, starting send...');
  
      const sendProc = spawn('hyperlane', [
        'warp', 'send',
        '--from', from,
        '--to', to,
        '--token-address', tokenAddress,
        '--recipient', recipient,
        '--amount', amount,
        '--relay'
      ], {
        env: { ...process.env }
      });
  
      sendProc.stdout.on('data', (data) => {
        console.log(`[send] ${data.toString()}`);
      });
  
      sendProc.stderr.on('data', (data) => {
        console.error(`[send] ${data.toString()}`);
      });
  
      sendProc.on('close', (sendCode) => {
        console.log(`[send] Process exited with code ${sendCode}`);
        if (sendCode !== 0) {
          return res.status(500).json({ error: 'Send failed with exit code ' + sendCode });
        }
        res.json({ message: 'Deploy and send completed successfully!' });
      });
    });
  });
  

app.listen(port, () => {
  console.log(`Local Hyperlane server listening at http://localhost:${port}`);
});
