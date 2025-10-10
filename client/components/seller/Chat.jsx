import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";

export default function Chat() {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  const fetchMessages = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/messages/seller/${user.id}`
      );
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const sendMessage = async () => {
    if (!newMessage || !selectedBuyer) return;
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/messages`, {
        senderId: user.id,
        receiverId: selectedBuyer.id,
        content: newMessage,
      });
      setNewMessage("");
      fetchMessages();
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  useEffect(() => {
    if (user?.id) fetchMessages();
  }, [user?.id]);

  return (
    <div className="flex h-full gap-4">
      {/* Buyers List */}
      <div className="w-1/4 bg-white rounded shadow p-4 overflow-auto">
        <h3 className="font-semibold mb-2">Buyers</h3>
        {messages.length === 0 && (
          <p className="text-gray-400 text-sm">No messages yet.</p>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded mb-2 cursor-pointer ${
              selectedBuyer?.id === msg.senderId
                ? "bg-blue-100"
                : "hover:bg-gray-100"
            }`}
            onClick={() => setSelectedBuyer(msg.sender)}
          >
            {msg.sender.name || "Anonymous"}
          </div>
        ))}
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-white rounded shadow p-4">
        <div className="flex-1 overflow-auto mb-2">
          {selectedBuyer ? (
            messages
              .filter(
                (m) =>
                  m.senderId === selectedBuyer.id ||
                  m.receiverId === selectedBuyer.id
              )
              .map((m) => (
                <div
                  key={m.id}
                  className={`p-2 my-1 rounded max-w-xs ${
                    m.senderId === user.id
                      ? "bg-green-100 ml-auto"
                      : "bg-gray-100"
                  }`}
                >
                  {m.content}
                  <div className="text-xs text-gray-400">
                    {new Date(m.timestamp).toLocaleString()}
                  </div>
                </div>
              ))
          ) : (
            <p className="text-gray-400">Select a buyer to start chatting.</p>
          )}
        </div>

        {selectedBuyer && (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 border rounded px-3 py-2 outline-none"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
