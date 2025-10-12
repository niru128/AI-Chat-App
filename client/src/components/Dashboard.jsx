import React, { useEffect } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import ChatWindow from '../components/ChatWindow.jsx';
import TopBar from '../components/TopBar.jsx';
import { useSelector, useDispatch } from 'react-redux';
import socket from '../socket';
import { initCredits, restoreChat, setCurrentChat, fetchMessages } from '../features/chatSlice';
import { restoreUser } from '../features/authSlice';

export default function Dashboard() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const remainingCredits = useSelector(
    (state) => state.chat.remainingCredits ?? 0
  );

  // Restore user from localStorage
  useEffect(() => {
    dispatch(restoreUser());
  }, [dispatch]);

  useEffect(() => {
  const savedChat = localStorage.getItem('currentChat');
  if (savedChat) {
    dispatch(setCurrentChat(savedChat));
    dispatch(fetchMessages(savedChat));
  }
}, [dispatch]);


  // Initialize credits from user
  useEffect(() => {
    if (user?.credits != null) {
      dispatch(initCredits(user.credits));
    }
  }, [user, dispatch]);

  useEffect(() => {
  const savedUser = JSON.parse(localStorage.getItem('user'));
  if (savedUser) {
    dispatch(initCredits(savedUser.credits));
  }
}, [dispatch]);


  // Restore last opened chat from localStorage
  useEffect(() => {
    dispatch(restoreChat());
  }, [dispatch]);

  // Connect socket once
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !socket.connected) {
      socket.connect();

      try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        socket.emit('identify', tokenPayload.id);
      } catch (e) {
        console.error('Failed to parse token:', e);
      }

      socket.on('notification', (n) => {
        if (n?.title) alert(`Notif: ${n.title}`);
      });
    }

    return () => {
      socket.off('notification');
      socket.disconnect();
    };
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <TopBar credits={remainingCredits} />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <ChatWindow />
        </div>
      </div>
    </div>
  );
}
