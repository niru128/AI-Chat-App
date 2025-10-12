import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import Organization from '../models/Organization.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

const router = express.Router();

router.use(authMiddleware);

//create argainization

router.post("/", async (req, res) => {

    try {

        const { name } = req.body;
        const org = await Organization.create({
            name,
            members: [{ user: req.user.id, role: "admin" }]
        })
        req.user.organization.push(org._id);
        req.user.activeOrganization = org._id;
        await req.user.save();
        res.json(org);

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }

})

//rename organization

router.put("/:orgId", async (req, res) => {

    try {

        const { orgId } = req.params;
        const { name } = req.body;

        const org = await Organization.findById(orgId);
        if (!org) {
            return res.status(404).json({ message: "Organization not found" });
        }

        const isAdmin = org.members.some(m => m.user.toString() === req.user._id.toString() && m.role === "admin");
        if (!isAdmin) {
            return res.status(403).json({ message: "Only admin can rename organization" });
        }

        org.name = name || org.name;
        await org.save();
        res.json(org);

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }

})

//invite member by email

router.post("/:orgId/invite", async (req, res) => 
    {

        try {

            const { orgId } = req.params;
            const { email, role = "member" } = req.body;
            const org = await Organization.findById(orgId);
            if (!org) return res.status(404).json({ message: "Org not found" });
            // create a user record placeholder if not exists
            let invited = await User.findOne({ email });
            if (!invited) {
                invited = await User.create({ email, username: email.split("@")[0], credits: 0 }); // no password yet
            }
            // add to organization
            if (!org.members.some(m => m.user.toString() === invited._id.toString())) {
                org.members.push({ user: invited._id, role });
                await org.save();
            }
            // optionally create an Invite doc (skipped for brevity)
            res.json({ message: "Invited (record created)", invitedUser: invited });

        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "Server Error" });
        }
    })


export default router;