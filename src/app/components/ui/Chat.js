import React, { useState, useRef, useEffect } from "react";
import { FaComments, FaTimes, FaPaperPlane } from "react-icons/fa"; // FaComments for toggle, FaPaperPlane for sending

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false); // State to open/close the chat
  const messagesEndRef = useRef(null);

  // Scroll to the bottom when a new message is added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to open/close the chat window
  const toggleChat = () => setIsOpen((prev) => !prev);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      const newMessages = [...messages, { text: input, sender: "user" }];
      setMessages(newMessages);
      setInput("");

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: input }),
        });

        if (!res.ok) {
          console.error("Failed to send message. Status:", res.status);
          throw new Error(`Failed to send message. Status: ${res.status}`);
        }

        const data = await res.json();
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: data.response, sender: "bot" },
        ]);
      } catch (error) {
        console.error("Error sending message:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: "Error sending message, please try again later.",
            sender: "bot",
          },
        ]);
      }
    }
  };

  return (
    <>
      {/* Only this chat icon will be displayed initially to toggle chat */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full z-50 shadow-lg"
        aria-label="Open chat"
      >
        <FaComments /> {/* Chat icon for opening chat */}
      </button>

      {/* The chat box itself will appear when isOpen is true */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col z-50">
          <div className="flex justify-between items-center p-4 bg-blue-600 text-white rounded-t-lg">
            <h2 className="text-lg font-semibold">Chat Support</h2>
            <button
              onClick={toggleChat} // Close chat on click
              className="text-white hover:text-gray-200"
              aria-label="Close chat"
            >
              <FaTimes /> {/* Close icon */}
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 ${
                  msg.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                <span
                  className={`inline-block p-2 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-gray-200 flex"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white p-2 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              aria-label="Send message"
            >
              <FaPaperPlane /> {/* Send message icon */}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chat;
