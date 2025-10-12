import { createSelector } from '@reduxjs/toolkit';

// Memoized selector to get messages for a chat
export const selectMessagesByChat = createSelector(
  (state) => state.chat.messages,          // messages object
  (state, currentChat) => currentChat,    // current chat ID
  (messages, currentChat) => messages[currentChat] ?? [] // always return array
);
