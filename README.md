#  AI Chat App Dashboard

## Overview

AI-Chat-App is a real-time AI-powered chat application built with **React**, **Redux Toolkit**, **Node.js**, **Express**, and **MongoDB**. The platform allows authenticated users to create chats, send messages, and interact with an AI assistant. Credits are consumed based on AI usage, and the app provides real-time notifications using **WebSockets**.

---

## Features

* User authentication (JWT-based)
* Real-time messaging with **Socket.io**
* AI assistant integration
* Credit management for AI usage
* Multi-chat support
* Dynamic dashboard with sidebar and chat windows
* Notifications for new messages or system alerts
* Redux Toolkit for state management
* Responsive UI

---

## Technologies Used

* **Frontend:** React, Redux Toolkit, TailwindCSS, React Router
* **Backend:** Node.js, Express
* **Database:** MongoDB
* **Real-time:** Socket.io
* **AI Integration:** Custom LLM service (can be OpenAI GPT or other API)
* **Authentication:** JWT

---

## Project Structure

```
ChatX/
├─ client/                 # React frontend
│  ├─ src/
│  │  ├─ components/       # Sidebar, ChatWindow, TopBar
│  │  ├─ features/         # Redux slices (auth, chat)
│  │  ├─ api/              # API wrapper
│  │  └─ App.jsx
├─ server/                 # Node.js backend
│  ├─ models/              # Mongoose models (User, Chat, Message)
│  ├─ routes/              # Express routes (auth, chat)
│  ├─ middleware/          # Auth middleware
│  ├─ services/            # AI call service
│  └─ server.js
└─ README.md
```

---

## Setup Instructions

### Backend

1. Clone the repository:

```bash
git clone <repo-url>
cd ChatX/server
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with the following:

```env
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
PORT=5000
```

4. Start the server:

```bash
npm run dev
```

### Frontend

1. Navigate to client:

```bash
cd ../client
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the frontend:

```bash
npm run dev
```

5. Access the app at `http://localhost:5173`.

---

## Key Features Implementation

### Credits Management

* Users start with **1500 credits**.
* Each AI response consumes credits based on token usage.
* Credits are displayed on the **TopBar** in real-time.
* Redux slice `chatSlice` manages credits with:

  * `initCredits` - initialize from user
  * `remainingCredits` - updated after each message

### Real-time Chat

* **Socket.io** is used to receive notifications.
* The dashboard connects to the socket on load.
* Notifications are displayed via browser alerts.

### Redux State Management

* **Slices:** `authSlice`, `chatSlice`
* **Async thunks:** `fetchChats`, `createChat`, `sendMessage`
* `chatSlice` tracks chats, messages, and credits.

---

## Usage

1. Log in or register using your credentials.
2. View your remaining credits on the dashboard.
3. Create a new chat or select an existing chat.
4. Send messages to the AI assistant.
5. Credits are deducted in real-time.
6. Receive notifications for updates.

---

##Screenshots
<img width="1919" height="912" alt="Screenshot 2025-10-13 013848" src="https://github.com/user-attachments/assets/20234b90-baab-472c-8314-3171b469162d" />
<img width="1919" height="902" alt="Screenshot 2025-10-13 013910" src="https://github.com/user-attachments/assets/9f2c7e4a-18bd-455b-86ed-02a3b74f3dae" />
<img width="1909" height="904" alt="Screenshot 2025-10-13 013859" src="https://github.com/user-attachments/assets/6a4bb1ba-c49a-49ec-ab2c-24a3aec3d378" />

## Notes

* Backend must be running for the frontend to work.
* Ensure `JWT` token is stored in `localStorage` for API authentication.
* MongoDB must be connected; otherwise, chats and messages will fail.

---


## License

This project is for educational and assessment purposes.
