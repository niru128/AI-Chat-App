    import express from 'express';
    import {authMiddleware} from '../middleware/auth.js';
    import User from '../models/User.js';
    import Chat from '../models/Chat.js';
    import Message from '../models/Message.js';
    import {callLLM} from '../services/llm.js';

    const router = express.Router();

    router.use(authMiddleware);

    //listing the chats

    router.get("/", async (req,res)=>{
        try{
            const chats = await Chat.find({user : req.user.id}).populate("messages");
            res.json(chats);
        }catch(err){
            console.log(err);
            res.status(500).json({message: "Server Error"});    
        }
    })
    // GET single chat by ID
router.get("/:chatId", async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId)
      .populate({
        path: "messages",
        populate: { path: "user", select: "username" }
      })
      .populate("user", "username");

    if (!chat) return res.status(404).json({ message: "Chat not found" });

    res.json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});


    //create chat
    router.post('/', async (req,res)=>{
        try{

            const chat = await Chat.create({
                user : req.user.id,
                organization : req.user.activeOrganization,
            })
            res.json(chat);

        }catch(err){
            console.log(err);
            res.status(500).json({message: "Server Error"});
        }
    })

    //send message

   // send message
router.post("/:chatId/message", async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content } = req.body;

    // find the chat by ID and populate messages with username
    const chat = await Chat.findById(chatId)
      .populate('user', 'username') // populate chat owner's username
      .populate({
        path: 'messages',
        populate: { path: 'user', select: 'username' } // populate message sender's username
      });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // check credits
    if (req.user.credits <= 0) {
      return res.status(403).json({ message: "Not enough credits" });
    }

    // create user message
    const userMessage = await Message.create({
      chat: chatId,
      role: "user",
      content,
      user: req.user._id,
    });

    chat.messages.push(userMessage);
    await chat.save();

    const messageForLLM = [
      ...chat.messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: "user", content },
    ];

    // call LLM
    const { content: assistantText, usage } = await callLLM({ messages: messageForLLM });

    const totalTokens = usage?.total_tokens
      ? usage.total_tokens
      : Math.min(100, Math.floor(assistantText.length / 4));

    // deduct credits
    req.user.credits = Math.max(0, req.user.credits - totalTokens);
    await req.user.save();

    // save assistant message
    const assistantMessage = await Message.create({
      chat: chat._id,
      role: "assistant",
      content: assistantText,
      tokens: totalTokens,
    });

    chat.messages.push(assistantMessage);
    await chat.save();

    return res.json({
      message: assistantMessage,
      remainingCredits: req.user.credits,
      totalTokens,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});


    export default router;