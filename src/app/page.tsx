'use client'
import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import bellAnimation from './Animation - 1721293985874.json';
import io from 'socket.io-client';
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as any);
console.log(process.env.NEXT_PUBLIC_SOCKET_URL, 'process.env.SOCKET_URL ');

const NotificationComponent: React.FC = () => {
  const [notifications, setNotifications] = useState<{
    title: string;
    message: string;
    from: string;
    timestamp: string;
  }>({
    title: '',
    message: '',
    from: '',
    timestamp: '',
  });

  const [newMessage, setNewMessage] = useState<string>('');

  const handleSendNotification = () => {
    const notificationData = {
      title: 'User Notification',
      message: newMessage,
      from: 'user'
    };
    socket.emit('sendNotification', notificationData);
    setNewMessage('');
  };

  useEffect(() => {
    socket.on('receiveNotificationFromAdmin', (data) => {
      setNotifications({
        ...data,
        timestamp: dayjs().tz('Asia/Kolkata').format('DD-MM-YYYY hh:mm:ss A')
      });
      console.log(data, 'data.from');
      console.log(notifications, 'notifications');
    });

    return () => {
      socket.off('receiveNotificationFromUser');
    };
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[radial-gradient(circle,#2E236C_0%,#402E7A_100%)] text-white">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Hola!</h1>
      </div>
      <div className="flex items-center justify-center bg-[#2E236C] p-8 border-white bottom-3 rounded-full mb-8">
        <Lottie animationData={bellAnimation} className="h-24 w-24" />
      </div>
      <div className="text-center mb-8">
        <p className="text-gray-300">{notifications?.title}</p>
        {notifications.message.length > 0 && <h2 className="text-xl font-semibold">{`${notifications?.message} received at ${notifications?.timestamp}`} </h2>}
      </div>
      <div className="w-full max-w-sm">
        <input
          type="text"
          className="w-full p-3 mb-4 text-black rounded"
          placeholder="Enter notification message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          onClick={handleSendNotification}
          className="w-full p-3 bg-purple-600 rounded hover:bg-purple-500 transition"
        >
          Send Notification
        </button>
      </div>
    </div>
  );
};

export default NotificationComponent;
