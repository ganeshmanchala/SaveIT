import express from 'express'
import { Router } from 'express'

import { Accounts } from '../Accounts.js'
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose';

const jwtSecrete = process.env.JWT_SECRET;
const app = express();

const router = Router();

router.post('/createAccount',
  body('Email', 'Not a Email').isEmail(),
  body('Password', 'Not Required Length Password').isLength({ min: 5 }),
  body('Username', 'Not Required Length Username').isLength({ min: 5 }),
  body('Name', 'Not Required Length LastName').isLength({ min: 1 }),
  body('Phone', 'Not Numeric').isNumeric(),
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const salt=await bcrypt.genSalt(10);
    let securePass=await bcrypt.hash(req.body.Password,salt)
    try {
      const existingUser = await Accounts.findOne({ Username: req.body.Username });
      if (existingUser) {
        return res.status(400).json({ errors: [{ msg: 'Username is already in use' }] });
      }
      const existingEmail = await Accounts.findOne({ Email: req.body.Email });
      if (existingEmail) {
        return res.status(400).json({ errors: [{ msg: 'Email is already in use' }] });
      }

      await Accounts.create({
        Name: req.body.Name,
        Username: req.body.Username,
        Email: req.body.Email,
        Password: securePass,
        Phone: req.body.Phone
      })
      res.json({ success: true })
    }
    catch (error) {
      console.log("errror during creation of the account");
      res.json({ success: false })
    }
  })


router.post('/loginAccount',
  body('Password', 'Not Required Length Password').isLength({ min: 5 }),
  body('Username', 'Not Required Length Username').isLength({ min: 5 }),
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const username = req.body.Username;
    const password = req.body.Password;
    try {
      
      const foundData = await Accounts.findOne({ Username: username })
      if (!foundData) {
        return res.status(400).json({ errors: [{ msg: "Enter the Correct Credentials" }] });
      }
     
      const pwdCompare =await bcrypt.compare(req.body.Password,foundData.Password)
      if (!pwdCompare) {
        return res.status(400).json({ errors: [{ msg: "Enter the Correct Credentials" }] });
      }
      const data={
        user:{
          id:foundData.id,
        }
      }
      const authToken = jwt.sign(data, process.env.JWT_SECRET);
      res.cookie('jwt', authToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        maxAge: 24 * 60 * 60 * 1000
        // Remove domain property entirely
      });

      res.json({ success: true, username: foundData.Username });
      
    }
    catch (error) {
      console.error(error);
      res.status(500).json({ success: false });
    }
  })

  // Add logout route
  router.post('/logout', (req, res) => {
    res.clearCookie('jwt');
    res.json({ success: true });
  });

  // Add logout route


// Add auth check route
router.get('/checkAuth', async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) return res.json({ isAuthenticated: false });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Accounts.findById(decoded.user.id).select('-Password');
    
    if (!user) return res.json({ isAuthenticated: false });
    
    res.json({ isAuthenticated: true, user });
  } catch (error) {
    console.error('Auth check error:', error); // Add logging
    res.clearCookie('jwt'); // Clear invalid token
    res.json({ isAuthenticated: false });
  }
});

export const createAccount = router;