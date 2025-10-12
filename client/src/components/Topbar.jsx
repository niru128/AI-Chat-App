import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../features/authSlice'
import socket from '../socket'
import { Bell, Settings, LogOut, User as UserIcon } from 'lucide-react'
import API from '../api/api'

export default function TopBar({ credits }) {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)

  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifMenu, setShowNotifMenu] = useState(false)
  const [notifications, setNotifications] = useState([])

  const userMenuRef = useRef(null)
  const notifMenuRef = useRef(null)

  // fetch initial notifications
  useEffect(() => {
    if (!user?._id) return
    API.get('/notifications')
      .then(res => setNotifications(res.data))
      .catch(err => console.error('Error fetching notifications', err))
  }, [user])

  // socket.io listener
  useEffect(() => {
    if (!user?._id) return
    socket.connect()
    socket.emit('identify', user._id)

    socket.on('notification', (notif) => {
      setNotifications(prev => [notif, ...prev])
    })

    return () => {
      socket.off('notification')
      socket.disconnect()
    }
  }, [user])

  const unreadCount = notifications.filter(n => !n.read).length

  // close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        userMenuRef.current && !userMenuRef.current.contains(e.target) &&
        notifMenuRef.current && !notifMenuRef.current.contains(e.target)
      ) {
        setShowUserMenu(false)
        setShowNotifMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    dispatch(logout())
  }

  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`)
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, read: true } : n)
      )
    } catch (err) {
      console.error('Error marking read', err)
    }
  }

  return (
    <div className="flex items-center justify-between p-3 bg-white shadow-cl  shadow-blue-400 ">
      {/* Logo */}
      <div className="font-semibold text-3xl">AI Chat</div>

      {/* Right Section */}
      <div className="flex items-center gap-10 relative">
        {/* Credits */}
        <div className="text-sm py-3 px-4 bg-blue-100 rounded-2xl hover:bg-blue-200 cursor-pointer">
          Credits: <span className="font-medium">{credits ?? '-'}</span>
        </div>

        {/* Notifications Bell */}
        <div className="relative" ref={notifMenuRef}>
          <button onClick={() => setShowNotifMenu(p => !p)}>
            <Bell className="w-5 h-6 text-center justify-center items-center mb-0 text-gray-700 hover:text-blue-600 cursor-pointer mt-1" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
              {notifications.length === 0 && (
                <div className="p-3 text-sm text-gray-500 text-center">
                  No notifications
                </div>
              )}
              {notifications.map(n => (
                <div
                  key={n._id}
                  className={`p-3 text-sm border-b cursor-pointer hover:bg-gray-50 ${
                    !n.read ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => markAsRead(n._id)}
                >
                  <div className="font-medium">{n.title}</div>
                  <div className="text-gray-600 text-xs">{n.body}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(prev => !prev)}
            className="flex items-center gap-2 bg-gray-100 hover:bg-blue-200 px-3 py-2 rounded-2xl"
          >
          <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
              <UserIcon size={16} />
            </div>
            <span className="font-medium">{user?.username}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg z-50">
              <button
                onClick={() => alert('Settings clicked')}
                className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
              >
                <Settings size={16} /> Settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
