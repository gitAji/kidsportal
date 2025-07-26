'use client';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserFriends,
  faChild,
  faGift,
  faCreditCard,
  faArrowLeft,
  faHome,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

const faqData = [
  {
    id: 'parents-register',
    icon: faUserFriends,
    question: 'How do parents register and add children?',
    answer: 'Parents can easily register for an account using their email or Google. Once registered, they can access a dedicated parent dashboard to add and manage multiple child profiles. Each child profile can be customized with unique login credentials or a permanent access link, making it simple for children to get started.',
  },
  {
    id: 'child-login',
    icon: faChild,
    question: 'How do children login and access tasks?',
    answer: 'Children can log in using their unique credentials provided by the parent, or by clicking a permanent link from the parent dashboard. Upon logging in, they will see a personalized dashboard displaying their assigned learning tasks and lessons. After completing a lesson, they can attempt an interactive exam. Successfully passing the exam automatically unlocks the next exciting stage or level in their learning journey!',
  },
  {
    id: 'free-accounts',
    icon: faGift,
    question: 'What features are available for free accounts?',
    answer: 'Users who register with their Gmail account or through our website are automatically granted a free account. This free tier provides access to foundational content, including levels 1 and 2 across all available grades and subjects. It\'s a great way to explore the KidsPortal and experience our interactive learning environment before committing to a premium plan.',
  },
  {
    id: 'premium-accounts',
    icon: faCreditCard,
    question: 'How do premium accounts work?',
    answer: 'For an enhanced learning experience, parents can upgrade to a premium account. This unlocks all content, advanced features, and personalized learning paths. Premium subscriptions can be activated by securely providing payment details directly on our site or by using popular payment gateways like Vipps or PayPal. Upgrading to premium ensures your child has unlimited access to all educational resources.',
  },
];

export default function InfoBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const toggleBox = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setCurrentView('home');
      setSelectedQuestion(null);
    }
  };

  const handleQuestionClick = (item) => {
    setSelectedQuestion(item);
    setCurrentView('question');
  };

  const handleGoHome = () => {
    setCurrentView('home');
    setSelectedQuestion(null);
  };

  return (
    <div>
      <a
        className="fixed top-4 right-4 z-50 cursor-pointer text-blue-600 hover:underline"
        onClick={toggleBox}
      >
        How It Works
      </a>

      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={toggleBox}
          ></div>

          <div
            className="info-box fixed top-0 right-0 w-full md:w-1/3 h-full bg-white p-6 shadow-lg transform transition-transform duration-300 ease-in-out overflow-y-auto z-50"
          >
            <div className="relative h-full flex flex-col">
              {currentView === 'home' ? (
                <div className="flex-grow pt-4 pb-2">
                  <h2 className="text-3xl font-extrabold text-center mb-8 text-gray-800">How KidsPortal Works</h2>
                  <div className="space-y-6">
                    {faqData.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                        onClick={() => handleQuestionClick(item)}
                      >
                        <FontAwesomeIcon
                          icon={item.icon}
                          className="text-blue-500 text-2xl mr-4"
                        />
                        <p className="text-lg font-semibold text-gray-700">
                          {item.question}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex-grow pt-4 pb-2">
                  <button
                    className="text-gray-600 hover:text-gray-800 text-lg mb-4 p-2 rounded-full hover:bg-gray-100"
                    onClick={handleGoHome}
                    aria-label="Back to FAQ Home"
                  >
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> Back to Home
                  </button>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedQuestion?.question}</h2>
                  <p className="text-gray-700 leading-relaxed">{selectedQuestion?.answer}</p>
                </div>
              )}

              <div className="mt-8 border-t pt-4 border-gray-200">
                <button
                  className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg shadow-md hover:bg-gray-300 transition-colors duration-200 flex items-center justify-center"
                  onClick={toggleBox}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}