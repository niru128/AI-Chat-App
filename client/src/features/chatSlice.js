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
// Send message (optimistic update)
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ chatId, content }, { dispatch }) => {
    // Optimistic UI: immediately show the user message
    dispatch({
      type: 'chat/addTemporaryMessage',
      payload: { chatId, role: 'user', content },
    });

    try {
      const res = await API.post(`/chat/${chatId}/message`, { content });

      return {
        chatId,
        assistantMessage: res.data.message,
        remainingCredits: res.data.remainingCredits,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
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
    },
    addTemporaryMessage(state, action) {
      const { chatId, role, content } = action.payload;
      if (!state.messages[chatId]) state.messages[chatId] = [];
      state.messages[chatId].push({ role, content });
    },

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
        state.isAITyping = true; // show typing bubble
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { chatId, assistantMessage, remainingCredits } = action.payload;
        if (!state.messages[chatId]) state.messages[chatId] = [];

        // remove "typing" message if it exists
        state.messages[chatId] = state.messages[chatId].filter(
          m => m.role !== 'typing'
        );

        // add final assistant reply
        state.messages[chatId].push({
          role: 'assistant',
          content: assistantMessage.content
        });

        state.remainingCredits = remainingCredits;
        state.isAITyping = false;
      })
      // .addCase(sendMessage.rejected, (state) => {
      //   state.isAITyping = false;
      // })


      .addCase(fetchMessages.fulfilled, (state, action) => {
        const { chatId, messages } = action.payload;
        state.messages[chatId] = messages;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sendMessageStatus = 'failed';
        state.isAITyping = false;
        state.error = action.error.message;
      });
  },
});

export const { setCurrentChat, initCredits, restoreChat } = chatSlice.actions;
export default chatSlice.reducer;
