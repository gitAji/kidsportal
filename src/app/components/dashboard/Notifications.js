import React from 'react';

const Notifications = ({ notifications }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
      {notifications && notifications.length > 0 ? (
        <ul>
          {notifications.map((notification) => (
            <li key={notification.id} className={`p-2 rounded-md mb-2 ${notification.read ? 'bg-gray-100' : 'bg-blue-100'}`}>
              <p className="text-gray-800">{notification.message}</p>
              <p className="text-xs text-gray-500">{new Date(notification.timestamp.seconds * 1000).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-700">No new notifications.</p>
      )}
    </div>
  );
};

export default Notifications;
