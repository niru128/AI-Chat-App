import express from "express"
import { authMiddleware } from "../middleware/auth.js"
import Notification from "../models/Notification.js"

const router = express.Router()
router.use(authMiddleware)

// 📥 Get all notifications for the logged-in user
router.get("/", async (req, res) => {
  try {
    const notifs = await Notification.find({ 
      $or: [
        { toUser: req.user._id }, 
        { toUser: null } // global notifications
      ]
    }).sort({ createdAt: -1 })
    res.json(notifs)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// 📤 Mark one notification as read
router.put("/:id/read", async (req, res) => {
  try {
    const notif = await Notification.findById(req.params.id)
    if (!notif) return res.status(404).json({ message: "Not found" })
    if (notif.toUser && notif.toUser.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Forbidden" })
    notif.read = true
    await notif.save()
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
