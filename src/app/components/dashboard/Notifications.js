import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaCheck, FaExclamationCircle } from 'react-icons/fa';

const Notifications = ({ notifications }) => {
  return (
    <div className="p-2 h-full flex flex-col items-center justify-center">
      {notifications && notifications.length > 0 ? (
        <ul className="w-full space-y-3">
          <AnimatePresence>
            {notifications.slice(0, 5).map((notification, index) => (
              <motion.li
                key={notification.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`flex gap-4 p-4 rounded-2xl border transition-colors ${notification.read
                    ? 'bg-slate-50 border-slate-100'
                    : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100 shadow-sm'
                  }`}
              >
                <div className={`mt-1 flex-shrink-0 ${notification.read ? 'text-slate-400' : 'text-blue-500'}`}>
                  {notification.read ? <FaCheck /> : <FaExclamationCircle />}
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${notification.read ? 'text-slate-600' : 'text-slate-800 font-bold'}`}>
                    {notification.message}
                  </p>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-1">
                    {new Date(notification.timestamp?.seconds * 1000).toLocaleString(undefined, {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-8 text-slate-400">
          <FaBell className="text-5xl mb-4 text-slate-300 opacity-50" />
          <p className="font-medium text-lg">All caught up!</p>
          <p className="text-sm">No new notifications right now.</p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
