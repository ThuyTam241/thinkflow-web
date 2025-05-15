import { useEffect, useState, useRef } from "react";

const NotificationSocket = () => {
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasNew, setHasNew] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket(
      "wss://api.carehub-us.click/notification/v1/notifications/ws",
    );
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      console.log("WebSocket connected");
    };

    ws.onclose = () => {
      setConnected(false);
      console.log("WebSocket disconnected. Reconnecting in 5s...");
      setTimeout(() => window.location.reload(), 5000);
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setNotifications((prev) => [data, ...prev]);
        setHasNew(true);
      } catch (err) {
        console.error("Invalid message format:", event.data);
      }
    };

    return () => {
      if (ws) ws.close();
    };
  }, []);

  const clearHasNew = () => setHasNew(false);

  return (
    <div className="flex">
      {/* Main content */}
      <div className="mx-auto max-w-4xl flex-1 px-4 py-6" onClick={clearHasNew}>
        <h1 className="mb-4 text-2xl font-bold">📢 Notification WebSocket</h1>

        <div
          className={`mb-4 rounded p-3 text-sm font-medium ${connected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
        >
          Status: {connected ? "Connected" : "Disconnected"}
        </div>

        <h2 className="mb-2 text-xl font-semibold">
          🔔 Received Notifications:
        </h2>

        <div className="max-h-[500px] space-y-4 overflow-y-auto">
          {notifications.map((n, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow"
            >
              <p>
                <strong>Type:</strong> {n.noti_type}
              </p>
              <p>
                <strong>Content:</strong> {n.noti_content}
              </p>
              <p>
                <strong>Time:</strong> {n.created_at}
              </p>

              {n.sender && (
                <div className="mt-1 rounded bg-gray-100 p-2 text-sm">
                  <strong>From:</strong>
                  <br />
                  Name: {n.sender.first_name || ""} {n.sender.last_name || ""}
                  <br />
                  Email: {n.sender.email || "N/A"}
                  <br />
                  ID: {n.sender.id || "N/A"}
                </div>
              )}

              {n.receiver && (
                <div className="mt-1 rounded bg-gray-100 p-2 text-sm">
                  <strong>To:</strong>
                  <br />
                  Name: {n.receiver.first_name || ""}{" "}
                  {n.receiver.last_name || ""}
                  <br />
                  Email: {n.receiver.email || "N/A"}
                  <br />
                  ID: {n.receiver.id || "N/A"}
                </div>
              )}

              {n.noti_options && (
                <div className="mt-2 rounded bg-gray-50 p-2">
                  <strong>Options:</strong>
                  <pre className="text-sm break-words whitespace-pre-wrap text-gray-600">
                    {JSON.stringify(JSON.parse(n.noti_options), null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationSocket;
