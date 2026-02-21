import React, { useRef, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "../../api/notificationApi";
import {
  Bell,
  Check,
  CheckCircle,
  Info,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import toast from "react-hot-toast";

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: notificationsData, isError } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotifications({ limit: 10 }),
    refetchInterval: 60000, // Background poll every minute
  });

  const notifications = notificationsData?.data?.items || [];
  const unreadCount = notificationsData?.data?.unreadCount || 0;

  const markReadMutation = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
    onError: () => toast.error("Failed to mark as read"),
  });

  const markAllReadMutation = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      toast.success("All notifications marked as read");
    },
    onError: () => toast.error("Failed to mark all as read"),
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = (notification) => {
    if (!notification.is_read) {
      markReadMutation.mutate(notification.id);
    }
    setIsOpen(false); // Close dropdown
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="size-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 relative hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-800 animate-pulse"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-[70] origin-top-right transition-all animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
            <h3 className="font-bold text-slate-800 dark:text-white">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllReadMutation.mutate()}
                disabled={markAllReadMutation.isPending}
                className="text-xs font-medium text-slate-500 hover:text-primary transition-colors flex items-center gap-1"
              >
                <Check className="w-3 h-3" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-50 dark:divide-slate-800">
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className={clsx(
                      "p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group flex gap-3",
                      !notification.is_read &&
                        "bg-blue-50/30 dark:bg-blue-900/10",
                    )}
                  >
                    <div className="mt-1 shrink-0">
                      {getIcon(notification.type)}
                    </div>
                    <div
                      className="flex-1"
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <p
                        className={clsx(
                          "text-sm font-medium mb-0.5",
                          notification.is_read
                            ? "text-slate-700 dark:text-slate-300"
                            : "text-slate-900 dark:text-white",
                        )}
                      >
                        {notification.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {notification.message}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-2">
                        {new Date(notification.createdAt).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </p>
                    </div>
                    {!notification.is_read && (
                      <button
                        title="Mark as read"
                        onClick={(e) => {
                          e.stopPropagation();
                          markReadMutation.mutate(notification.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 self-center p-1.5 hover:bg-primary/10 text-primary rounded-full transition-all"
                      >
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-center">
            <button className="text-xs font-medium text-primary hover:text-primary-dark transition-colors">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
