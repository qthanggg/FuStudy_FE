"use client";
import React, { useEffect, useState } from 'react';
import { GetAllMentorBookingByUserId, AcceptBooking, RejectBooking } from '@/lib/service/bookingService';
import { getChatByUserID, getConversationMessagesByConversationId, createConversationMessage } from '@/lib/service/chatService';
import useAuthStore from '@/lib/hooks/useUserStore';
import { Conversation, Message } from "@/app/myorder/type"

interface Booking {
  id: number;
  startTime: string;
  status: string;
  user: {
    fullname: string;
  };
}

const MyRequest: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const bookingsPerPage = 5;
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState<string>('');

  const { userInfo, token } = useAuthStore((state) => ({
    userInfo: state.userInfo,
    token: state.token,
  }));

  useEffect(() => {
    const fetchBookings = async () => {
      if (userInfo && userInfo.id) {
        try {
          const response = await GetAllMentorBookingByUserId(userInfo.id);
          setBookings(response.data.data);
        } catch (error) {
          console.error('Failed to fetch bookings:', error);
        }
      }
    };

    const fetchConversations = async () => {
      if (token) {
        try {
          const response = await getChatByUserID(token);
          if (response.status === 200) {
            const data = Array.isArray(response.data) ? response.data : [];
            setConversations(data.filter(conversation => !conversation.isClose));
          } else {
            console.error('Failed to fetch conversations: ', response.statusText);
          }
        } catch (error) {
          console.error('Failed to fetch conversations:', error);
        }
      }
    };

    fetchBookings();
    fetchConversations();
  }, [token, userInfo]);

  const handleAccept = async (id: number) => {
    try {
      const response = await AcceptBooking(id, token);
      if (response.status === 200) {
        alert('Booking accepted successfully!');
        setBookings(bookings.map((booking) => 
          booking.id === id ? { ...booking, status: 'Accepted' } : booking
        ));
      } else {
        alert('Failed to accept booking');
      }
    } catch (error) {
      console.error('Failed to accept booking:', error);
    }
  };

  const handleReject = async (id: number) => {
    try {
      const response = await RejectBooking(id, token);
      if (response.status === 200) {
        alert('Booking rejected successfully!');
        setBookings(bookings.map((booking) => 
          booking.id === id ? { ...booking, status: 'Declined' } : booking
        ));
      } else {
        alert('Failed to reject booking');
      }
    } catch (error) {
      console.error('Failed to reject booking:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'text-green-500';
      case 'Declined':
        return 'text-red-500';
      case 'Pending':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  const filteredBookings = filterStatus === 'All' 
    ? bookings 
    : bookings.filter((booking) => booking.status === filterStatus);

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleConversationClick = async (conversationId: number) => {
    setCurrentConversationId(conversationId);
    if (token) {
      try {
        const response = await getConversationMessagesByConversationId(conversationId, token);
        if (response.status === 200) {
          setMessages(response.data);
        } else {
          console.error('Failed to fetch messages: ', response.statusText);
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    }
  };

  const handleSendMessage = async () => {
    if (currentConversationId && newMessage.trim() !== '') {
      try {
        const response = await createConversationMessage({ conversationId: currentConversationId, content: newMessage }, token);
        if (response.status === 200) {
          setMessages([...messages, response.data]);
          setNewMessage('');
        } else {
          console.error('Failed to send message: ', response.statusText);
        }
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">My Bookings</h2>

      <div className="mb-4">
        <label htmlFor="statusFilter" className="mr-2">Filter by status:</label>
        <select
          id="statusFilter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded p-2"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Accepted">Accepted</option>
          <option value="Declined">Declined</option>
          <option value="OverTime">OverTime</option>
        </select>
      </div>

      {currentBookings.length > 0 ? (
        <div className="space-y-4">
          {currentBookings.map((booking) => (
            <div key={booking.id} className="p-4 border rounded-lg shadow-md bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Start Time</h3>
                  <p>{new Date(booking.startTime).toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Booked By</h3>
                  <p>{booking.user.fullname}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Status</h3>
                  <p className={getStatusColor(booking.status)}>{booking.status}</p>
                </div>
                {booking.status === 'Pending' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAccept(booking.id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(booking.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No bookings found.</p>
      )}

      <div className="flex justify-center mt-4">
        {Array.from({ length: Math.ceil(filteredBookings.length / bookingsPerPage) }, (_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={`px-4 py-2 mx-1 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Conversations</h2>
        <div className="space-y-4">
          {conversations.map((conversation) => (
            <div key={conversation.id} className="p-4 border rounded-lg shadow-md bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <p>Last Message: {conversation.lastMessage}</p>
                </div>
                <button
                  onClick={() => handleConversationClick(conversation.id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-full"
                >
                  Chat
                </button>
              </div>
            </div>
          ))}
        </div>

        {currentConversationId && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Messages</h2>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className="p-4 border rounded-lg shadow-md bg-white">
                  <p>{message.content}</p>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="border rounded p-2 w-full"
                placeholder="Type your message"
              ></textarea>
              <button
                onClick={handleSendMessage}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-full"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequest;
