import express from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Organization from '../models/Organization.js';
// import { authMiddleware } from '../middleware/auth.js';
import { OAuth2Client } from 'google-auth-library';
// import { use } from 'passport';



dotenv.config();

const router = express.Router();

const signToken = (user) => jwt.sign({id : user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

router.post('/signup', async (req, res) => {
        const {username, email, password } = req.body;
        try{

            if(!email || !password || !username){
                return res.status(400).json({message: "Please provide all required fields"});
            }

            const existingUser = await User.findOne({email});
            if(existingUser){
                return res.status(400).json({message: "User already exists"});
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const user = await User.create({email, passwordHash: hashedPassword, username});

            const org = await Organization.create({
                name: `${username || email}-org`, members: [{ user: user._id, role: "admin"}]
            })

            user.organization.push(org._id);
            user.activeOrganization = org._id;
            // user.credits = 10; 
            await user.save();
            const token = signToken(user);
            res.json({token, user: { id: user._id,username: user.username, email: user.email, credits: user.credits }})
        }catch(error){
            res.status(500).json({message: "Server error", error: error.message});
            console.log(error);
        }
})


router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = signToken(user);
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        credits: user.credits,
        username : user.username
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
    console.log(error);
  }
});


//google oath routes

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
router.post('/google', async (req, res) => {
  const { id_token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        username: name,
        email,
        googleId: sub,
      });

      const org = await Organization.create({
        name: `${name || email}-org`,
        members: [{ user: user._id, role: "admin" }]
      });

      user.organization.push(org._id);
      user.activeOrganization = org._id;
      await user.save();
    } else {
      if (!user.googleId) {
        user.googleId = sub;
        await user.save();
      }
    }

    const token = signToken(user);

    // ✅ Send username correctly
    return res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        credits: user.credits
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;