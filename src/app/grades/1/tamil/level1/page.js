"use client"; // Ensure this component is treated as a client component





import ProgressBar from "../../../../components/ui/ProgressBar";
import useSound from "use-sound";
import correctSound from "../../../../../../public/sounds/correct.mp3";
import incorrectSound from "../../../../../../public/sounds/incorrect.mp3";
import "animate.css";

// Sample questions array in Tamil with 12 main letters
const questions = [
  {
    questionTamil: "இந்த எழுத்தை கண்டுபிடிக்கவும்",
    questionEnglish: "Find this letter",
    answer: "அ",
    image: "/images/அ.png",
    width: 100,
    height: 100,
    options: ["அ", "ஆ", "இ", "ஈ"],
  },
  {
    questionTamil: "இந்த எழுத்தை கண்டுபிடிக்கவும்",
    questionEnglish: "Find this letter",
    answer: "ஆ",
    image: "/images/ஆ.png",
    width: 100,
    height: 100,
    options: ["அ", "ஆ", "இ", "ஈ"],
  },
  {
    questionTamil: "இந்த எழுத்தை கண்டுபிடிக்கவும்",
    questionEnglish: "Find this letter",
    answer: "இ",
    image: "/images/இ.png",
    width: 100,
    height: 100,
    options: ["இ", "ஈ", "உ", "எ"],
  },
  {
    questionTamil: "இந்த எழுத்தை கண்டுபிடிக்கவும்",
    questionEnglish: "Find this letter",
    answer: "ஈ",
    image: "/images/ஈ.png",
    width: 100,
    height: 100,
    options: ["இ", "ஈ", "உ", "எ"],
  },
  {
    questionTamil: "இந்த எழுத்தை கண்டுபிடிக்கவும்",
    questionEnglish: "Find this letter",
    answer: "உ",
    image: "/images/உ.png",
    width: 100,
    height: 100,
    options: ["உ", "எ", "ஏ", "ஒ"],
  },
  {
    questionTamil: "இந்த எழுத்தை கண்டுபிடிக்கவும்",
    questionEnglish: "Find this letter",
    answer: "எ",
    image: "/images/எ.png",
    width: 100,
    height: 100,
    options: ["உ", "எ", "ஏ", "ஒ"],
  },
  {
    questionTamil: "இந்த எழுத்தை கண்டுபிடிக்கவும்",
    questionEnglish: "Find this letter",
    answer: "ஏ",
    image: "/images/ஏ.png",
    width: 100,
    height: 100,
    options: ["ஏ", "ஒ", "ஃ", "க"],
  },
  {
    questionTamil: "இந்த எழுத்தை கண்டுபிடிக்கவும்",
    questionEnglish: "Find this letter",
    answer: "ஒ",
    image: "/images/ஒ.png",
    width: 100,
    height: 100,
    options: ["ஏ", "ஒ", "ஃ", "க"],
  },
];


  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const [playCorrect] = useSound(correctSound);
  const [playIncorrect] = useSound(incorrectSound);

  useEffect(() => {
    const savedProgress = localStorage.getItem("tamilL1Progress");
    if (savedProgress) {
      const { completed, currentQuestionIndex } = JSON.parse(savedProgress);
      setCompleted(completed);
      setCurrentQuestionIndex(currentQuestionIndex);
      setProgress((currentQuestionIndex / questions.length) * 100);
    }
  }, []);

  const validateAnswer = (selectedOption) => {
    if (selectedOption === questions[currentQuestionIndex].answer) {
      setFeedback("மிக நன்று! ✨");
      setIsCorrect(true);
      playCorrect();
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          const nextIndex = currentQuestionIndex + 1;
          setCurrentQuestionIndex(nextIndex);
          setProgress((nextIndex / questions.length) * 100);
          setFeedback("");
          setIsCorrect(null);
          localStorage.setItem(
            "tamilL1Progress",
            JSON.stringify({ completed: false, currentQuestionIndex: nextIndex })
          );
        } else {
          setCompleted(true);
          setProgress(100);
          localStorage.setItem(
            "tamilL1Progress",
            JSON.stringify({ completed: true, currentQuestionIndex: 0 })
          );
        }
      }, 1500);
    } else {
      setFeedback("மீண்டும் முயற்சிக்கவும்!");
      setIsCorrect(false);
      playIncorrect();
    }
  };

  const handleReattempt = () => {
    setCompleted(false);
    setCurrentQuestionIndex(0);
    setProgress(0);
    setFeedback("");
    setIsCorrect(null);
    localStorage.removeItem("tamilL1Progress");
  };

  const goToTamilPage = () => {
    window.location.href = "/grades/1/tamil";
  };

  return (
    <div
      className="flex flex-col min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/background.jpg')" }}
    >
      <Header setIsModalOpen={setIsModalOpen} setIsRegister={setIsRegister} />
      <main className="flex-grow p-4 flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl font-extrabold mb-4 drop-shadow-lg">
          நிலை 1: தமிழ் எழுத்துக்கள்
        </h1>
        <div className="w-full max-w-2xl mx-auto">
          <ProgressBar percentage={progress} />
        </div>

        <div className="mt-8 bg-white bg-opacity-20 p-8 rounded-2xl shadow-lg w-full max-w-2xl text-center backdrop-blur-sm">
          {completed ? (
            <div className="flex flex-col items-center">
              <Image
                src="/images/completed.avif"
                alt="Completed"
                width={200}
                height={200}
                className="rounded-full shadow-lg"
              />
              <h2 className="text-3xl font-bold mt-4 text-yellow-300">
                வெற்றி! நீங்கள் முடித்துவிட்டீர்கள்!
              </h2>
              <div className="mt-6">
                <button
                  onClick={handleReattempt}
                  className="bg-yellow-400 text-white py-3 px-6 rounded-full shadow-lg hover:bg-yellow-500 transform hover:scale-105 transition-transform duration-300 mr-4"
                >
                  மீண்டும் விளையாடு
                </button>
                <button
                  onClick={goToTamilPage}
                  className="bg-green-500 text-white py-3 px-6 rounded-full shadow-lg hover:bg-green-600 transform hover:scale-105 transition-transform duration-300"
                >
                  தமிழ்ப் பக்கத்திற்குச் செல்
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-center items-center mb-6">
                <Image
                  src={questions[currentQuestionIndex].image}
                  alt={questions[currentQuestionIndex].questionTamil}
                  width={questions[currentQuestionIndex].width}
                  height={questions[currentQuestionIndex].height}
                  className="transform hover:scale-110 transition-transform duration-300 bg-white rounded-lg"
                />
              </div>
              <h2 className="text-2xl font-semibold mt-2 text-white flex items-center justify-center">
                {questions[currentQuestionIndex].questionTamil}
                <VoiceButton
                  questionText={questions[currentQuestionIndex].questionEnglish}
                />
              </h2>
              <div className="grid grid-cols-2 gap-4 mt-6">
                {questions[currentQuestionIndex].options.map((option) => (
                  <button
                    key={option}
                    onClick={() => validateAnswer(option)}
                    className="bg-blue-500 text-white font-bold py-4 px-6 rounded-lg shadow-lg transform hover:scale-105 hover:bg-blue-600 transition-transform duration-300"
                  >
                    {option}
                  </button>
                ))}
              </div>
              {feedback && (
                <FeedbackMessage message={feedback} isCorrect={isCorrect} />
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
      <BackToTop />
      {isModalOpen && (
        <ToggleModal
          setIsModalOpen={setIsModalOpen}
          isRegister={isRegister}
          setIsRegister={setIsRegister}
        />
      )}
    </div>
  );
};


