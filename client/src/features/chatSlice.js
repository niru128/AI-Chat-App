import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/api';

const initialState = {
  chats: [],
  currentChat: null,
  messages: {},
  remainingCredits: 0, // default to 0
  fetchChatsStatus: 'idle',
  createChatStatus: 'idle',
  sendMessageStatus: 'idle',
  error: null,
};

// Fetch chats
export const fetchChats = createAsyncThunk('chat/fetchChats', async () => {
  const res = await API.get('/chat');
  return res.data;
});

// Fetch messages for a single chat
export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (chatId) => {
    const res = await API.get(`/chat/${chatId}`);
    // Assuming your backend returns the chat with messages populated
    return { chatId, messages: res.data.messages || [] };
  }
);


// Create chat
export const createChat = createAsyncThunk('chat/createChat', async () => {
  const res = await API.post('/chat');
  return res.data;
});

// Send message
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ chatId, content }) => {
    const res = await API.post(`/chat/${chatId}/message`, { content });
    return {
      chatId,
      userMessage: content,
      assistantMessage: res.data.message,
      remainingCredits: res.data.remainingCredits,
    };
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentChat(state, action) {
      state.currentChat = action.payload;
      localStorage.setItem('currentChat', action.payload); // ✅ persist selected chat
    },
    restoreChat(state, action) {
  const saved = localStorage.getItem('currentChat');
  if (saved) {
    state.currentChat = saved;
  }
},
    initCredits(state, action) {
      state.remainingCredits = action.payload ?? 0;
    }
  },

  extraReducers: (builder) => {
    builder
      // Fetch chats
      .addCase(fetchChats.pending, (state) => {
        state.fetchChatsStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.fetchChatsStatus = 'succeeded';
        state.chats = action.payload;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.fetchChatsStatus = 'failed';
        state.error = action.error.message;
      })

      // Create chat
      .addCase(createChat.pending, (state) => {
        state.createChatStatus = 'loading';
        state.error = null;
      })
      .addCase(createChat.fulfilled, (state, action) => {
        state.createChatStatus = 'succeeded';
        state.chats.unshift(action.payload);
        state.currentChat = action.payload._id;
      })
      .addCase(createChat.rejected, (state, action) => {
        state.createChatStatus = 'failed';
        state.error = action.error.message;
      })

      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.sendMessageStatus = 'loading';
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { chatId, userMessage, assistantMessage, remainingCredits } = action.payload;

        if (!state.messages[chatId]) state.messages[chatId] = [];
        state.messages[chatId].push({ role: 'user', content: userMessage });
        state.messages[chatId].push({ role: 'assistant', content: assistantMessage.content });

        state.remainingCredits = remainingCredits;

        // persist credits
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          user.credits = remainingCredits;
          localStorage.setItem('user', JSON.stringify(user));
        }
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
  const { chatId, messages } = action.payload;
  state.messages[chatId] = messages;
})
      .addCase(sendMessage.rejected, (state, action) => {
        state.sendMessageStatus = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setCurrentChat, initCredits, restoreChat } = chatSlice.actions;
export default chatSlice.reducer;
