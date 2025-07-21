'use client';
import { useParams, useRouter } from 'next/navigation';
import "./page.css";
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const ChatInterface = () => {
  const [user, setUser] = useState(null);
  const [receiverInfo, setReceiverInfo] = useState(null);
  const [receiverActivityStatus, setReceiverActivityStatus] = useState(null);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const params = useParams();
  const router = useRouter();
  const receiver_id = parseInt(params?.id);

  // Function to generate profile image based on username
  const generateProfileImage = (username) => {
    if (!username) return '';
    
    const firstLetter = username.charAt(0).toUpperCase();
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
      '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
      '#0ABDE3', '#10AC84', '#F79F1F', '#A3CB38', '#FDA7DF'
    ];
    
    const colorIndex = username.charCodeAt(0) % colors.length;
    const backgroundColor = colors[colorIndex];
    
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="120" height="120" xmlns="https://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="60" fill="${backgroundColor}"/>
        <text x="60" y="75" font-family="Arial, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="white">${firstLetter}</text>
      </svg>
    `)}`;
  };

  useEffect(() => {
    // Get user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    // Fetch receiver info
    fetchReceiverInfo();
    fetchReceiverActivityStatus();

    // Initialize socket connection
    const newSocket = io('https://5.83.153.81:25608');
    setSocket(newSocket);

    // Join the chat room
    const room = `chat_${Math.min(user.user_id, receiver_id)}_${Math.max(user.user_id, receiver_id)}`;
    newSocket.emit('join', { room });

    // Load chat history
    fetchChatHistory();

    // Listen for new messages
    newSocket.on('new_message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    // Set up interval to update user activity status every 30 seconds
    const activityInterval = setInterval(() => {
      fetchReceiverActivityStatus();
    }, 30000);

    return () => {
      newSocket.close();
      clearInterval(activityInterval);
    };
  }, [user, receiver_id]);

  const fetchReceiverInfo = async () => {
    try {
      const response = await fetch(`https://5.83.153.81:25608/api/user/${receiver_id}`, {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });
      const data = await response.json();
      
      setReceiverInfo(data.user);
    } catch (error) {
      console.error('Error fetching receiver info:', error);
    }
  };

  const fetchReceiverActivityStatus = async () => {
    try {
      const response = await fetch(`https://5.83.153.81:25608/api/user-activity/${receiver_id}`, {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });
      const data = await response.json();
      
      setReceiverActivityStatus(data);
    } catch (error) {
      console.error('Error fetching receiver activity status:', error);
    }
  };

  const fetchChatHistory = async () => {
    try {
      const response = await fetch(`https://5.83.153.81:25608/api/chat-history/${receiver_id}`, {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });
      const data = await response.json();
      setMessages(data.messages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    socket.emit('private_message', {
      sender_id: user.user_id,
      receiver_id: receiver_id,
      message: newMessage.trim()
    });

    setNewMessage('');
  };

  const handleBackClick = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      {/* Custom Chat Header */}
      <div className="chat-header">
        <button className="back-button" onClick={handleBackClick}>
          ←
        </button>
        <div className="profile-avatar">
          <img 
            src={generateProfileImage(receiverInfo?.name)} 
            alt={receiverInfo?.name || 'User'} 
          />
          {/* Online indicator */}
          {receiverActivityStatus?.is_online && (
            <div className="online-indicator"></div>
          )}
        </div>
        <div className="user-info">
          <h3>{receiverInfo?.name || 'User'}</h3>
          <p className="user-status">
            {receiverActivityStatus?.is_online 
              ? 'ონლაინ' 
              : receiverActivityStatus?.status || 'უცნობი'
            }
          </p>
        </div>
      </div>

      <div className="chat-main">
        <div className="chat-box">
          {/* Messages Container */}
          <div className="messages-container">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.sender_id === user.user_id ? 'sent' : 'received'}`}
              >
                <div className="message-content">
                  <p>{message.message}</p>
                  <p className="message-time">
                    {new Date(message.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="input-form">
            <div className="input-container">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="message-input"
                placeholder="გაგზავნეთ წერილი"
              />
              <button type="submit" className="send-button">
                გაგზავნა
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;