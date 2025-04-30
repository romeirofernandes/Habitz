import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import debounce from "lodash/debounce";

const ChatWindow = ({ partnerId, partnerName, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [typingUsers, setTypingUsers] = useState([]);
  const [chatMongoId, setChatMongoId] = useState(null);
  const messagesEndRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const socketRef = useRef(null);
  // Add this line to create a consistent chatId
  const chatId = [currentUser.id, partnerId].sort().join("-");

  // Add this for handling typing state
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!chatMongoId) return;
    socketRef.current = io(import.meta.env.VITE_API_URL);

    // Join the chat room using the real MongoDB chat _id
    socketRef.current.emit("join-chat", chatMongoId);

    socketRef.current.on("typing-update", (typingUsers) => {
      setTypingUsers(typingUsers || []);
      setIsTyping(typingUsers?.includes(partnerId));
    });

    socketRef.current.on("message-received", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });

    socketRef.current.on("read-receipt-update", ({ messageId, readBy }) => {
      setMessages((prev) =>
        prev.map((msg) => (msg._id === messageId ? { ...msg, readBy } : msg))
      );
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [chatMongoId, partnerId]);

  const debouncedStopTyping = debounce(() => {
    if (!chatMongoId) return;
    socketRef.current?.emit("typing-stopped", {
      chatId: chatMongoId,
      userId: currentUser.id,
    });
  }, 1000);

  const handleTyping = () => {
    if (!chatMongoId) return;
    socketRef.current?.emit("typing-started", {
      chatId: chatMongoId,
      userId: currentUser.id,
    });
    debouncedStopTyping();
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatMongoId) return;

    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_API_URL
        }/api/partners/chat/${partnerId}/messages`,
        {
          content: newMessage,
          chatId: chatMongoId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setNewMessage("");
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      socketRef.current?.emit("new-message", {
        chatId: chatMongoId,
        message: response.data,
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    }
  };

  // Mark messages as read
  useEffect(() => {
    if (!chatMongoId) return;
    if (messages.length > 0) {
      messages.forEach((message) => {
        if (
          message.sender._id !== currentUser.id &&
          !message.readBy?.includes(currentUser.id)
        ) {
          socketRef.current?.emit("message-read", {
            chatId: chatMongoId,
            messageId: message._id,
            userId: currentUser.id,
          });
        }
      });
    }
  }, [messages, currentUser.id, chatMongoId]);

  // Update the fetchMessages function
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/partners/chat/${partnerId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setMessages(response.data.messages || []);
        setChatMongoId(response.data.chatId); // This triggers the socket useEffect above
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      } catch (error) {
        console.error("Failed to fetch messages:", error);
        toast.error("Failed to load messages");
      }
    };
    fetchMessages();
  }, [partnerId]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#0a0a0a] w-full max-w-lg rounded-xl shadow-xl flex flex-col"
        style={{ maxHeight: "80vh" }}
      >
        {/* Chat Header */}
        <div className="p-4 border-b border-[#222] flex justify-between items-center">
          <h3 className="font-bold">Chat with {partnerName}</h3>
          <button
            onClick={onClose}
            className="text-[#f5f5f7]/60 hover:text-[#f5f5f7]"
          >
            ×
          </button>
        </div>

        {/* Messages Area */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-4"
          style={{ minHeight: "300px", maxHeight: "50vh" }}
        >
          {messages.length === 0 && (
            <div className="text-center text-[#f5f5f7]/40 py-12">
              No messages yet
            </div>
          )}
          {messages.map((message, index) => {
            const isCurrentUser = message.sender._id === currentUser.id;
            const messageDate = new Date(message.createdAt);
            const formattedTime =
              messageDate instanceof Date && !isNaN(messageDate)
                ? messageDate.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Invalid date";

            const otherParticipantIds = [partnerId];
            const allOthersRead = otherParticipantIds.every((id) =>
              message.readBy?.includes(id)
            );

            return (
              <div
                key={index}
                className={`flex flex-col ${
                  isCurrentUser ? "items-end" : "items-start"
                }`}
              >
                {/* Sender Name */}
                <span className="text-xs text-[#f5f5f7]/60 mb-1">
                  {isCurrentUser ? "You" : partnerName}
                </span>

                {/* Message Bubble */}
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    isCurrentUser
                      ? "bg-[#A2BFFE] text-[#080808]"
                      : "bg-[#222] text-[#f5f5f7]"
                  }`}
                >
                  <p className="break-words">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isCurrentUser ? "opacity-80" : "opacity-60"
                    }`}
                  >
                    {formattedTime}
                  </p>
                </div>
                {isCurrentUser && allOthersRead && (
                  <span className="text-xs text-[#f5f5f7]/60 mt-1">Seen</span>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
          {typingUsers.length > 0 &&
            typingUsers.some((id) => id !== currentUser.id) && (
              <div className="text-sm text-[#f5f5f7]/60 italic">
                {typingUsers.length === 1
                  ? "Partner is typing..."
                  : "Partners are typing..."}
              </div>
            )}
        </div>

        {/* Add typing indicator */}
        {isTyping && (
          <div className="text-sm text-[#f5f5f7]/60 italic px-4 py-2">
            {partnerName} is typing...
          </div>
        )}

        {/* Message Input */}
        <form onSubmit={sendMessage} className="p-4 border-t border-[#222]">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping();
              }}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 bg-[#1a1a1a] border border-[#222] rounded-lg focus:outline-none focus:border-[#A2BFFE]"
            />
            <motion.button
              type="submit"
              className="px-4 py-2 bg-[#A2BFFE] text-[#080808] rounded-lg font-bold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Send
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ChatWindow;
