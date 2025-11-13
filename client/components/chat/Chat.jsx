// src/ChatContainer.jsx (New file)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chat from './Chat'; // The existing Chat component

// --- CONFIGURATION ---
const API_BASE_URL = "http://localhost:5000/api/chat";
// --- END CONFIGURATION ---

// Mock/Contextual Data (Same as before, passed down)
const MOCK_CURRENT_USER_ID = 2;

const ChatPage = () => {
    const [currentUserId] = useState(MOCK_CURRENT_USER_ID);
    const [chatList, setChatList] = useState([]);
    // State to track which winning ID (chat) is currently selected
    const [selectedWinningId, setSelectedWinningId] = useState(null);
    const [loading, setLoading] = useState(true);

    // --- FETCH CHAT LIST ---
    useEffect(() => {
        const fetchChatList = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/list/${currentUserId}`);
                const list = response.data;
                setChatList(list);
                // Automatically select the first chat if available
                if (list.length > 0) {
                    setSelectedWinningId(list[0].id);
                }
            } catch (error) {
                console.error("Error fetching chat list:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchChatList();
    }, [currentUserId]);

    if (loading) {
        return <div className="p-8 text-center text-xl">Loading chats...</div>;
    }
    
    // Helper function to get the name of the OTHER party in the chat
    const getOtherPartyName = (chat) => {
        if (chat.sellerId === currentUserId) {
            return chat.winner.username; // Current user is seller, chatting with winner
        } else {
            return chat.seller.username; // Current user is winner, chatting with seller
        }
    };
    
    return (
        <div className="flex h-screen bg-gray-100">
            
            {/* 1. Sidebar (Chat List) */}
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-lg">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">
                        My Chats ({chatList.length})
                    </h2>
                    <p className="text-sm text-gray-500">Your ID: {currentUserId}</p>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {chatList.map((chat) => {
                        const otherPartyName = getOtherPartyName(chat);
                        const lastMessage = chat.messages[0];
                        
                        return (
                            <div
                                key={chat.id}
                                className={`p-4 cursor-pointer border-b hover:bg-gray-50 transition ${
                                    chat.id === selectedWinningId ? 'bg-blue-100 border-l-4 border-blue-600' : ''
                                }`}
                                onClick={() => setSelectedWinningId(chat.id)}
                            >
                                <div className="font-semibold text-gray-900">
                                    Chat with **{otherPartyName}**
                                </div>
                                <div className="text-xs text-gray-500 truncate mt-1">
                                    {lastMessage ? lastMessage.content : "No messages yet."}
                                </div>
                            </div>
                        );
                    })}
                    {chatList.length === 0 && (
                        <p className="p-4 text-gray-500 text-center">No active chats found.</p>
                    )}
                </div>
            </div>

            {/* 2. Main Chat Window */}
            <div className="flex-1 flex flex-col">
                {selectedWinningId ? (
                    <Chat 
                        winningId={selectedWinningId}
                        currentUserId={currentUserId}
                        // Note: You would likely need to pass the receiverId/opponent data here too
                        // to simplify the logic in the Chat component.
                    />
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500 text-lg">
                        Select a chat to begin messaging.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;