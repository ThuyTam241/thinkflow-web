import { useEffect, useState, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router";
import {
  deleteNotiApi,
  getListNotificationsApi,
  markAllAsReadApi,
  markAsReadApi,
} from "../../services/api.service";
import { SyncLoader } from "react-spinners";
import IconButton from "../ui/buttons/IconButton";
import { Check, CheckCheck, LogIn, X } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import notify from "./CustomToast";

dayjs.extend(relativeTime);

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { setHasNew } = useOutletContext();
  const wsRef = useRef(null);

  const [isMarkingAll, setIsMarkingAll] = useState(false);

  const [activeNotiTab, setActiveNotiTab] = useState(
    sessionStorage.getItem("activeNotiTab") || "all",
  );

  const tabs = [
    { id: "all", label: "All" },
    { id: "unread", label: "Unread" },
  ];

  const navigator = useNavigate();
  const notificationIds = useRef(new Set());
  const lastNotiTimestamp = useRef(0);
  const reconnectCount = useRef(0);

  const loadListNotifications = async () => {
    setIsLoading(true);
    const res = await getListNotificationsApi();
    const list = res.data || [];
    setNotifications(list);
    for (const noti of list) {
      if (noti.id) notificationIds.current.add(noti.id);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadListNotifications();
  }, []);

  useEffect(() => {
    let reconnectTimeout;

    const connect = () => {
      const ws = new WebSocket(
        "wss://api.carehub-us.click/notification/v1/notifications/ws",
      );
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected");
        reconnectCount.current = 0;
      };

      ws.onclose = () => {
        reconnectCount.current++;
        console.log("WebSocket disconnected. Reconnecting in 5s...");
        if (reconnectCount.current >= 3) {
          loadListNotifications();
        }
        reconnectTimeout = setTimeout(connect, 5000);
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data?.id && notificationIds.current.has(data.id)) return;
          if (data?.id) notificationIds.current.add(data.id);
          const now = Date.now();
          if (now - lastNotiTimestamp.current > 3000) {
            notify(
              "info",
              "New notification",
              data.noti_content,
              "var(--color-danube)",
            );
            lastNotiTimestamp.current = now;
          }
          setNotifications((prev) => [data, ...prev]);
          setHasNew(true);
        } catch (err) {
          console.error("Invalid message format:", event.data);
        }
      };
    };

    connect();
    setHasNew(false);

    return () => {
      if (wsRef.current) wsRef.current.close();
      clearTimeout(reconnectTimeout);
    };
  }, []);

  const handleMarkAllAsRead = async () => {
    setIsMarkingAll(true);
    const res = await markAllAsReadApi();
    if (!res.data) {
      notify(
        "error",
        "Mark notifications failed",
        "",
        "var(--color-crimson-red)",
      );
      setIsMarkingAll(false);
      return;
    }
    notify("success", "Notifications marked!", "", "var(--color-silver-tree)");
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setIsMarkingAll(false);
  };

  const handleMarkAsRead = async (notiId) => {
    const res = await markAsReadApi(notiId);
    if (!res.data) {
      notify(
        "error",
        "Mark notification failed",
        "",
        "var(--color-crimson-red)",
      );
      return;
    }
    // notify("success", "Notification marked!", "", "var(--color-silver-tree)");
    setNotifications((prev) =>
      prev.map((n) => (n.id === notiId ? { ...n, is_read: true } : n)),
    );
  };

  const handleDelete = async (notiId) => {
    const res = await deleteNotiApi(notiId);
    if (!res.data) {
      notify(
        "error",
        "Delete notification failed",
        "",
        "var(--color-crimson-red)",
      );
      return;
    }
    // notify("success", "Notification deleted!", "", "var(--color-silver-tree)");
    setNotifications((prev) => prev.filter((n) => n.id !== notiId));
  };

  return (
    <div className="flex">
      <div className="mx-auto max-w-4xl flex-1 p-8">
        <div className="flex items-center justify-between">
          <h1 className="font-body text-ebony-clay text-2xl font-semibold">
            Notifications
          </h1>
          <div>
            <IconButton
              onClick={handleMarkAllAsRead}
              size="w-5 h-5"
              icon={CheckCheck}
              disabled={isMarkingAll}
              customStyle="text-indigo group-hover:text-indigo!"
              label="Mark as read"
            />
          </div>
        </div>
        <div className="mt-4 mb-8 flex w-full border-b border-b-gray-200 dark:border-gray-100/20">
          {tabs.map((tab, index) => (
            <div
              key={index}
              onClick={() => setActiveNotiTab(tab.id)}
              className="flex h-full cursor-pointer items-center justify-center"
            >
              <h2
                className={`font-body inline-block w-full border-b-2 px-10 pt-4 pb-2 text-center text-base whitespace-nowrap transition-all duration-300 ease-in-out ${activeNotiTab === tab.id ? "text-indigo border-indigo font-semibold dark:text-white" : "text-gravel border-transparent"}`}
              >
                {tab.label}
                <span
                  className={` ${activeNotiTab === tab.id ? "text-indigo bg-cornflower-blue/10" : "text-gravel bg-gray-100"} ml-2 rounded-full px-2 py-1.5 text-xs font-semibold`}
                >
                  {tab.id === "all"
                    ? notifications.length
                    : notifications.filter((n) => !n.is_read).length}
                </span>
              </h2>
            </div>
          ))}
        </div>

        {isLoading ? (
          <div className="flex w-full justify-center">
            <SyncLoader color="var(--color-cornflower-blue)" size={8} />
          </div>
        ) : (activeNotiTab === "all"
            ? notifications.length
            : notifications.filter((n) => !n.is_read).length) > 0 ? (
          <div className="no-scrollbar h-[calc(100vh-195px)] overflow-y-auto">
            {(activeNotiTab === "all"
              ? notifications
              : notifications.filter((n) => !n.is_read)
            ).map((n) => (
              <div
                key={n.id}
                className="border-b border-gray-200 py-4 first:pt-0 last:border-none last:pb-0 dark:border-gray-100/20"
              >
                <div className="flex gap-5">
                  <div className="">
                    <p className="font-body text-ebony-clay text-base font-medium">
                      {n.noti_content}
                    </p>
                    <div className="text-silver-chalice font-body mt-1.5 space-x-3 text-xs font-medium">
                      <span>{dayjs(n.created_at).fromNow()}</span>
                      <span className="bg-silver-chalice/50 inline-block h-1.5 w-1.5 rounded-full"></span>
                      <span>{n.noti_type}</span>
                    </div>
                  </div>
                  {!n.is_read && (
                    <div className="bg-cornflower-blue/80 mt-2 ml-auto h-2 w-2 rounded-full"></div>
                  )}
                </div>
                {n.noti_options && (
                  <div className="mt-5">
                    <IconButton
                      customStyle="text-indigo stroke-[1.5]"
                      onClick={() => {
                        if (!n.is_read) {
                          handleMarkAsRead(n.id);
                        }
                        const options = JSON.parse(n.noti_options);
                        navigator(`/share/${options.tokenShareLink}`);
                      }}
                      size="w-5 h-5"
                      icon={LogIn}
                      label="Access"
                    />
                  </div>
                )}
                <div className="mt-5 flex gap-6">
                  {!n.is_read && (
                    <IconButton
                      customStyle="text-silver-tree stroke-[1.5] group-hover:text-silver-tree!"
                      onClick={() => handleMarkAsRead(n.id)}
                      size="w-5 h-5"
                      icon={Check}
                    />
                  )}
                  <IconButton
                    customStyle="text-crimson-red stroke-[1.5] group-hover:text-crimson-red!"
                    onClick={() => handleDelete(n.id)}
                    size="w-5 h-5"
                    icon={X}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="font-body text-ebony-clay w-full text-center text-sm italic">
            You don't have any notifications yet
          </p>
        )}
      </div>
    </div>
  );
};

export default Notifications;
