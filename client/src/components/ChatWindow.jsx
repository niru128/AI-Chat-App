import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sendMessage, restoreChat } from '../features/chatSlice';
import { selectMessagesByChat } from '../features/chatSelectors';

export default function ChatWindow() {
  const dispatch = useDispatch();
  const currentChat = useSelector((state) => state.chat.currentChat);

  // Use memoized selector
  const messages = useSelector((state) =>
    selectMessagesByChat(state, currentChat)
  );
  useEffect(() => {
  dispatch(restoreChat());
}, [dispatch]);


  const [text, setText] = useState('');

  const onSend = async () => {
    if (!text.trim() || !currentChat) return;

    try {
      await dispatch(sendMessage({ chatId: currentChat, content: text })).unwrap();
      setText('');
    } catch (err) {
      console.error(err);
      alert('Failed to send message');
    }
  };

  // Scroll to bottom whenever messages update
  useEffect(() => {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
  }, [messages]);

  if (!currentChat)
    return <div className="flex-1 flex items-center justify-center">Select or create a chat</div>;

  return (
    <div className="flex-1 flex flex-col h-full py-10 px-20">
      <div id="chat-container" className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((m, i) => {
          const isUser = m.role !== 'assistant';
          const time = new Date(m.createdAt || Date.now()).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          });

          return (
            <div key={i} className={`flex justify-start`}>
              <div
                className={`max-w-xl flex flex-col gap-1 `}
              >
                {/* Top row: avatar, username, and time */}
                <div className={`flex items-center gap-2 flex-row`}>
                  {/* Avatar */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold ${isUser ? 'bg-blue-600' : 'bg-gray-500'
                      }`}
                  >
                    {isUser ? 'U' : '🤖'}
                  </div>

                  {/* Username and time */}
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="font-semibold">
                      {isUser ? 'You' : 'AI Assistant'}
                    </span>
                    <span>{time}</span>
                  </div>
                </div>

                {/* Message bubble */}
                <div
                  className={`p-3 rounded-lg shadow-sm ${isUser
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-gray-100 text-gray-800 rounded-tl-none'
                    }`}
                >
                  {typeof m.content === 'string'
                    ? m.content
                    : JSON.stringify(m.content)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3 bg-white">
        <div className="relative">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-4 pr-12 rounded-2xl border focus:outline-blue-100"
            placeholder="Type your message"
            onKeyDown={(e) => e.key === 'Enter' && onSend()}
          />
          <button
            onClick={onSend}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-500 hover:bg-blue-400 rounded-full flex items-center justify-center text-white"
          >

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 cursor-pointer"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>


    </div>
  );
}
