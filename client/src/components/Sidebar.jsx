import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchChats, createChat, setCurrentChat,fetchMessages } from '../features/chatSlice'

export default function Sidebar() {
  const dispatch = useDispatch()
  const chats = useSelector(s => s.chat.chats)
  const currentChat = useSelector((state) => state.chat.currentChat);


  useEffect(() => { dispatch(fetchChats()) }, [dispatch])

  return (
    <div className="w-64 bg-white h-full  p-2 flex flex-col shadow-xl shadow-blue-200">
      <div className="flex flex-col items-start justify-start p-2 space-y-4">
        <h3 className="font-semibold">Conversations</h3>
        <button onClick={() => {dispatch(createChat());dispatch(fetchMessages(c._id));}} className="text-sm px-4 cursor-pointer hover:bg-blue-500 py-3 bg-blue-600 text-white rounded-2xl w-full">New</button>
      </div>
      <div className="mt-2 overflow-y-auto flex-1">
        {chats.map(c => (
          <div key={c._id} onClick={() => {dispatch(setCurrentChat(c._id));dispatch(fetchMessages(c._id));}} className="p-2 m-1 rounded hover:bg-gray-100 cursor-pointer ">
            <div className="font-medium">{c.title || c.messages?.[0]?.content.slice(0,20) || 'Untitled'}
</div>
            <div className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  )
}