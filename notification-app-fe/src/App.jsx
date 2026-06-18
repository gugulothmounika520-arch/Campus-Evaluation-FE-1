import { useEffect, useState } from "react";
import "./App.css";
import { fetchNotifications } from "./api/notifications";

export default function App() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    const data = await fetchNotifications();

    const items = data.notifications || data || [];

    const priorityMap = {
      Placement: 3,
      Result: 2,
      Event: 1,
    };

    const topNotifications = [...items]
      .sort((a, b) => {
        const priorityDiff =
          (priorityMap[b.Type] || 0) -
          (priorityMap[a.Type] || 0);

        if (priorityDiff !== 0) return priorityDiff;

        return (
          new Date(b.Timestamp).getTime() -
          new Date(a.Timestamp).getTime()
        );
      })
      .slice(0, 10);

    setNotifications(topNotifications);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Priority Inbox</h1>

      {notifications.map((notification, index) => (
        <div
          key={notification.ID || index}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "5px",
          }}
        >
          <h3>{notification.Type}</h3>
          <p>{notification.Message}</p>
          <small>{notification.Timestamp}</small>
        </div>
      ))}
    </div>
  );
}
