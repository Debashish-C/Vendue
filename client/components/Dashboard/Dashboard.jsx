import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { RefreshCw, Clock, Users, TrendingUp, AlertCircle } from "lucide-react";

export default function Dashboard({
  productId,
  isAuctionActive = true,
  reloadCount = 0,
}) {
  const { user } = useUser();
  const [userBids, setUserBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);

  const intervalRef = useRef(null);

  // Format date properly
  const formatDateTime = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return date.toLocaleString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
    } catch (err) {
      return "Invalid date";
    }
  };

  // Format time ago
  const formatTimeAgo = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);

      if (diffInSeconds < 60) return "Just now";
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400)
        return `${Math.floor(diffInSeconds / 3600)}h ago`;
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    } catch (err) {
      return "Invalid date";
    }
  };

  const fetchUserBids = async () => {
    if (!productId) return;

    try {
      setError("");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/bids/products/${productId}`
      );

      // Validate and transform bid data
      const validatedBids = Array.isArray(res.data)
        ? res.data.map((bid) => ({
            ...bid,
            // Ensure we have proper date fields
            bid_time: bid.bid_time || bid.createdAt || bid.timestamp,
            amount: Number(bid.amount) || 0,
            bidder: bid.bidder || { name: "Unknown Bidder" },
          }))
        : [];

      setUserBids(validatedBids);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching user bids:", error);
      setError("Failed to load bids. Please try again.");
      setUserBids([]);
    } finally {
      setLoading(false);
    }
  };

  // Start auto-refresh
  const startAutoRefresh = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (autoRefreshEnabled && isAuctionActive) {
      intervalRef.current = setInterval(() => {
        fetchUserBids();
      }, 5000); // Reload every 5 seconds
    }
  };

  useEffect(() => {
    fetchUserBids();
    startAutoRefresh();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [productId]);

  // Restart auto-refresh when dependencies change
  useEffect(() => {
    startAutoRefresh();
  }, [autoRefreshEnabled, isAuctionActive]);

  // Refresh when parent triggers reload
  useEffect(() => {
    if (reloadCount > 0) {
      fetchUserBids();
    }
  }, [reloadCount]);

  const toggleAutoRefresh = () => {
    setAutoRefreshEnabled(!autoRefreshEnabled);
  };

  // Calculate bid statistics
  const bidStats = {
    totalBids: userBids.length,
    highestBid:
      userBids.length > 0 ? Math.max(...userBids.map((bid) => bid.amount)) : 0,
    yourBids: userBids.filter(
      (bid) => bid.bidder?.email === user?.primaryEmailAddress?.emailAddress
    ).length,
    lastBid: userBids.length > 0 ? userBids[userBids.length - 1] : null,
  };

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-6">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Bid History
          </h2>
          {lastUpdated && (
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Updated {formatTimeAgo(lastUpdated)}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Auto-refresh toggle */}
          <button
            onClick={toggleAutoRefresh}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              autoRefreshEnabled
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <RefreshCw
              className={`w-4 h-4 ${autoRefreshEnabled ? "animate-spin" : ""}`}
            />
            Auto-refresh: {autoRefreshEnabled ? "On" : "Off"}
          </button>

          {/* Manual refresh */}
          <button
            onClick={fetchUserBids}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Status Bar */}
      {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {bidStats.totalBids}
          </div>
          <div className="text-sm text-blue-700">Total Bids</div>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-600">
            ₹{bidStats.highestBid}
          </div>
          <div className="text-sm text-green-700">Highest Bid</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {bidStats.yourBids}
          </div>
          <div className="text-sm text-purple-700">Your Bids</div>
        </div>
        <div className="bg-orange-50 rounded-lg p-3 text-center">
          <div className="text-sm font-semibold text-orange-600">
            {autoRefreshEnabled ? "Live" : "Paused"}
          </div>
          <div className="text-xs text-orange-700">Auto-refresh</div>
        </div>
      </div> */}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Auction Status Notice */}
      {!isAuctionActive && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 text-yellow-700">
            <Clock className="w-5 h-5" />
            <span className="font-medium">
              Auction has ended. Bids are no longer accepted.
            </span>
          </div>
        </div>
      )}

      {/* Bids List */}
      {loading && userBids.length === 0 ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p className="text-gray-500">Loading bids...</p>
        </div>
      ) : userBids.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 text-lg font-medium">
            No bids placed yet
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Be the first to place a bid!
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {userBids.map((bid, index) => {
            const isYourBid =
              bid.bidder?.email === user?.primaryEmailAddress?.emailAddress;
            const isHighestBid =
              index === 0 && bid.amount === bidStats.highestBid;

            return (
              <div
                key={bid.id || index}
                className={`p-4 rounded-lg border transition-all ${
                  isYourBid
                    ? "bg-blue-50 border-blue-200 shadow-sm"
                    : "bg-gray-50 border-gray-200"
                } ${isHighestBid ? "ring-2 ring-green-200" : ""}`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                            isYourBid ? "bg-blue-500" : "bg-gray-500"
                          }`}
                        >
                          {bid.bidder?.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {bid.bidder?.name || "Unknown Bidder"}
                            {isYourBid && (
                              <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                                You
                              </span>
                            )}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {formatDateTime(bid.bid_time)}
                          </p>
                        </div>
                      </div>

                      {isHighestBid && (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                          🏆 Highest
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-semibold text-red-500 text-lg">
                        ₹{bid.amount?.toLocaleString()}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {formatTimeAgo(bid.bid_time)}
                      </span>
                    </div>
                  </div>

                  {/* Bid Status Indicator */}
                  <div className="flex-shrink-0">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        index === 0
                          ? "bg-green-500 animate-pulse"
                          : "bg-gray-400"
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live updating every 5 seconds</span>
          </div>
          <span>Total: {userBids.length} bids</span>
        </div>
      </div>
    </div>
  );
}
