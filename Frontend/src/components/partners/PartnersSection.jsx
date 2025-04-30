import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import ChatWindow from "./ChatWindow";
import { FaUserMinus } from "react-icons/fa";
import { debounce } from "lodash";

const PartnersSection = () => {
  const currentUser = JSON.parse(localStorage.getItem("user")); // Add this line
  const [partners, setPartners] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeChatPartner, setActiveChatPartner] = useState(null);

  // Add this state
  const [unreadCounts, setUnreadCounts] = useState({});

  useEffect(() => {
    fetchPartners();
    fetchPendingRequests();
    fetchUnreadCounts(); // Add this line
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/partners/requests/pending`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPendingRequests(response.data);
    } catch (error) {
      console.error("Failed to fetch pending requests:", error);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await axios.post(
        `${
          import.meta.env.VITE_API_URL
        }/api/partners/request/${requestId}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Partner request accepted!");
      fetchPartners();
      fetchPendingRequests();
    } catch (error) {
      toast.error("Failed to accept request");
    }
  };

  const handleDeclineRequest = async (requestId) => {
    try {
      await axios.post(
        `${
          import.meta.env.VITE_API_URL
        }/api/partners/request/${requestId}/decline`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Partner request declined");
      fetchPendingRequests();
    } catch (error) {
      toast.error("Failed to decline request");
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/partners`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPartners(response.data);
    } catch (error) {
      toast.error("Failed to fetch partners");
    }
  };

  const fetchUnreadCounts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/partners/unread-counts`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUnreadCounts(response.data);
    } catch (error) {
      console.error("Failed to fetch unread counts:", error);
    }
  };

  // Debounced search function
  const debouncedSearch = React.useCallback(
    debounce(async (searchTerm) => {
      if (!searchTerm) {
        setSearchResults([]);
        return;
      }
      setLoading(true);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/partners/search`,
          { query: searchTerm },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSearchResults(response.data);
      } catch (error) {
        toast.error("Search failed");
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  // Update search handler
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  };

  // Update the sendPartnerRequest function
  const sendPartnerRequest = async (userId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/partners/request`,
        { partnerId: userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Partner request sent!");
      setSearchResults([]);
      setSearchTerm("");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send partner request"
      );
      console.error("Partner request error:", error);
    }
  };

  // Add this function
  const handleStartChat = (partner) => {
    setActiveChatPartner(partner);
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="bg-[#0a0a0a] border border-[#222] rounded-xl p-4 sm:p-6">
        <h3 className="text-xl font-bold mb-4">Find Partners</h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by username or email"
            className="flex-1 px-4 py-2 bg-[#1a1a1a] border border-[#222] rounded-lg"
          />
          <motion.button
            onClick={handleSearch}
            className="bg-[#A2BFFE] text-[#080808] px-4 py-2 rounded-lg font-bold"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </motion.button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-4 space-y-2">
            {searchResults.map((user) => (
              <div
                key={user._id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-[#1a1a1a] rounded-lg gap-2"
              >
                <div>
                  <p className="font-medium">{user.username}</p>
                  <p className="text-sm text-[#f5f5f7]/60">{user.email}</p>
                </div>
                <motion.button
                  onClick={() => sendPartnerRequest(user._id)}
                  className="w-full sm:w-auto text-sm bg-[#A2BFFE]/20 text-[#A2BFFE] px-3 py-1.5 rounded-md mt-2 sm:mt-0"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Add Partner
                </motion.button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="bg-[#0a0a0a] border border-[#222] rounded-xl p-4 sm:p-6">
          <h3 className="text-xl font-bold mb-4">Pending Requests</h3>
          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <div
                key={request._id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[#1a1a1a] rounded-lg gap-2"
              >
                <div>
                  <p className="font-medium">{request.user.username}</p>
                  <p className="text-sm text-[#f5f5f7]/60">
                    {request.user.email}
                  </p>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    onClick={() => handleAcceptRequest(request._id)}
                    className="px-4 py-2 bg-[#A2BFFE] text-[#080808] rounded-md font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Accept
                  </motion.button>
                  <motion.button
                    onClick={() => handleDeclineRequest(request._id)}
                    className="px-4 py-2 bg-[#222] text-[#f5f5f7] rounded-md font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Decline
                  </motion.button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Partners List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Your Partners</h3>
        {partners.length === 0 ? (
          <p className="text-[#f5f5f7]/60">
            No partners yet. Search to add some!
          </p>
        ) : (
          partners.map((partnership) => {
            const partner =
              partnership.user._id === currentUser.id
                ? partnership.partner
                : partnership.user;
            const unreadCount = unreadCounts[partner._id] || 0;

            return (
              <div
                key={partnership._id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[#1a1a1a] rounded-lg gap-2"
              >
                <div>
                  <p className="font-medium">{partner.username}</p>
                  <p className="text-sm text-[#f5f5f7]/60">{partner.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <span className="bg-[#A2BFFE] text-[#080808] rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold">
                      {unreadCount}
                    </span>
                  )}
                  <motion.button
                    onClick={() => handleStartChat(partner)}
                    className="px-4 py-2 bg-[#222] text-[#f5f5f7] rounded-md font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Chat
                  </motion.button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add chat window */}
      {activeChatPartner && (
        <ChatWindow
          partnerId={activeChatPartner._id}
          partnerName={activeChatPartner.username}
          onClose={() => setActiveChatPartner(null)}
        />
      )}
    </div>
  );
};

const PartnerCard = ({ partner }) => {
  const [showChat, setShowChat] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("user")); // Add this line

  // Ensure we're not displaying the current user
  if (partner._id === currentUser.id) {
    return null;
  }

  // Add this function
  const handleUnfriend = async () => {
    if (window.confirm("Are you sure you want to remove this partner?")) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/partners/${partner._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        toast.success("Partner removed successfully");
        window.location.reload(); // Refresh to update the partners list
      } catch (error) {
        toast.error("Failed to remove partner");
      }
    }
  };

  return (
    <>
      <motion.div
        className="bg-[#0a0a0a] border border-[#222] rounded-xl p-4"
        whileHover={{ y: -2 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold">{partner.username}</h4>
            <p className="text-sm text-[#f5f5f7]/60">{partner.email}</p>
          </div>
          <div className="flex items-center">
            <motion.button
              className="bg-[#A2BFFE]/20 text-[#A2BFFE] px-4 py-2 rounded-md text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowChat(true)}
            >
              Message
            </motion.button>
            {/* Add this button */}
            <motion.button
              onClick={handleUnfriend}
              className="ml-2 text-red-500 hover:text-red-600"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaUserMinus />
            </motion.button>
          </div>
        </div>
      </motion.div>
      {showChat && (
        <ChatWindow
          partnerId={partner._id}
          partnerName={partner.username}
          onClose={() => setShowChat(false)}
        />
      )}
    </>
  );
};

export default PartnersSection;
