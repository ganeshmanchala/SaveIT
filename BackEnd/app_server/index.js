import 'dotenv/config';
import cookie from 'cookie';
import express from 'express';
import mongoose from 'mongoose';
import os from 'os';
import jwt from 'jsonwebtoken';
import { WebSocketServer } from 'ws';
import { createAccount } from './Routers/CreateAccount.js';
import { displayProducts } from './Routers/DisplayProducts.js';
import { addProduct } from './Routers/addProducts.js';
import { handleMyCart } from './Routers/handleMyCart.js';
import cookieParser from 'cookie-parser';
import http from 'http';



// Add these at the top
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import cors from 'cors'

const app = express();
const server = http.createServer(app)
app.use(cors({
    origin: ['http://localhost:5173', 'http://192.168.1.113:5173'], // Your frontend origin
    credentials: true
}));
app.use(cookieParser());

const wss = new WebSocketServer({ noServer: true });
const activeConnections = new Map();


// Configure Cloudinary after imports
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const allowedOrigins = process.env.NODE_ENV === 'production' 
? ['https://your-production-domain.com']
: ['http://localhost:5173', 'http://192.168.1.113:5173'];


server.on('upgrade', (request, socket, head) => {
    const origin = request.headers.origin;
  
    if (!allowedOrigins.includes(origin)) {
      socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
      socket.destroy();
      return;
    }
  
    const cookies = cookie.parse(request.headers.cookie || '');
    const token = cookies.jwt;
  
    if (!token) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
      }
  
      wss.handleUpgrade(request, socket, head, (ws) => {
        // Handle the connection in this callback
        wss.emit('connection', ws, request, decoded.user);
        
        // Add connection logic here instead of separate handler
        ws.on('message', (message) => {
          // Handle messages from client
        });
  
        ws.on('close', () => {
          activeConnections.delete(decoded.user.id);
          console.log(`User ${decoded.user.id} disconnected`);
        });
      });
    });
  });

  wss.on('connection', (ws) => {
    ws.isAlive = true;
    ws.on('pong', () => ws.isAlive = true);
    
    const interval = setInterval(() => {
      if (!ws.isAlive) {
        console.log('Terminating dead connection');
        return ws.terminate();
      }
      ws.isAlive = false;
      ws.ping();
    }, 30000);
  
    ws.on('close', () => clearInterval(interval));
  });

// wss.on('connection', (ws, req) => {
//     // Verify JWT from cookies
//     const cookies = cookie.parse(req.headers.cookie || '');
//     const token = cookies.jwt;
  
//     if (!token) {
//       ws.close(4401, 'Unauthorized');
//       return;
//     }
  
//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//       if (err) {
//         ws.close(4401, 'Invalid token');
//         return;
//       }
  
//       // Store authenticated connection
//       activeConnections.set(decoded.user.id, ws);
//       console.log(`User ${decoded.user.id} connected`);
  
//       ws.on('message', (message) => {
//         // Handle messages from client
//       });
  
//       ws.on('close', () => {
//         activeConnections.delete(decoded.user.id);
//         console.log(`User ${decoded.user.id} disconnected`);
//       });
//     });
//   });
  // Broadcast function


const getNetworkIP = () => {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]) {
        if (iface.family === 'IPv4' && !iface.internal) {
          return iface.address;
        }
      }
    }
    return '0.0.0.0';
  };
// Add this middleware before your routes
const upload = multer({ storage: multer.memoryStorage() });
app.use(upload.any()); // For multipart/form-data

const mongoURL = process.env.MONGODB_URI;

mongoose
    .connect(mongoURL)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.error("Error during mongoose connection", err);
    });


app.use(express.json())


app.use('/api',createAccount)

app.use('/api',displayProducts)
app.use('/api',addProduct)
app.use('/api', handleMyCart(wss));


app.get('/', async (req, res) => {
   
   
});

server.listen(8000, '0.0.0.0', () => {
    console.log(`Server running at:
    - Local: http://localhost:8000
    - Network: http://${getNetworkIP()}:8000`);
  });

// app.listen(8000, '0.0.0.0', () => {
//     console.log(`Server running at:
//     - Local: http://localhost:8000
//     - Network: http://${getNetworkIP()}:8000`);
//   });
  
