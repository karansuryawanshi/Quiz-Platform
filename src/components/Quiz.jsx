import React, { useState, useEffect } from "react";
import { openDB } from "idb";
import { Notebook } from "lucide-react";
import { Dot } from "lucide-react";

const Quiz = ({ questions }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizResults, setQuizResults] = useState([]);
  const [textAnswer, setTextAnswer] = useState("");
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizHistory, setQuizHistory] = useState([]);

  if (!questions || questions.length === 0) {
    return <p className="text-xl">No questions available.</p>;
  }

  const openQuizDB = async () => {
    return openDB("quizDB", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("results")) {
          db.createObjectStore("results", {
            keyPath: "id",
            autoIncrement: true,
          });
        }
      },
    });
  };

  useEffect(() => {
    if (timeLeft > 0 && !quizFinished) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleNextQuestion();
    }
  }, [timeLeft, quizFinished]);

  useEffect(() => {
    if (quizFinished) {
      saveQuizResult({
        score,
        totalQuestions: questions.length,
        userAnswers,
        date: new Date().toISOString(),
      });
    }
    fetchQuizResults();
  }, [quizFinished]);

  const percent = score / 10;
  const finalPercent = percent * 100;

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  const handleAnswer = (answer) => {
    const isCorrect = questions[currentQuestion].correctAnswer === answer;
    setUserAnswers((prev) => [
      ...prev,
      { question: questions[currentQuestion].question, answer, isCorrect },
    ]);
    if (isCorrect) setScore((prev) => prev + 1);
    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setTimeLeft(30);
      setTextAnswer("");
    } else {
      setQuizFinished(true);
    }
  };

  const handleTextAnswer = () => {
    handleAnswer(textAnswer);
  };

  const saveQuizResult = async (result) => {
    const db = await openQuizDB();
    const tx = db.transaction("results", "readwrite");
    const store = tx.objectStore("results");
    await store.add(result);
    await tx.done;
  };

  const fetchQuizResults = async () => {
    const db = await openQuizDB();
    const tx = db.transaction("results", "readonly");
    const store = tx.objectStore("results");
    const results = await store.getAll();
    setQuizResults(results);
    setQuizHistory(results);
  };

  if (!quizStarted) {
    return (
      <div className="flex overflow-hidden">
        <div className="w-96 sm:block hidden p-4 bg-gray-800 text-white scroll-auto ">
          <h2 className="text-xl font-bold mb-4">Quiz History</h2>
          {quizHistory.length === 0 ? (
            <p>No previous quiz results.</p>
          ) : (
            quizHistory.map((result, index) => (
              <details
                key={index}
                className="border border-gray-600 p-2 mb-2 bg-gray-700 rounded-lg"
              >
                <summary className="cursor-pointer font-semibold">
                  Quiz {result.id} - Score: {result.score}/
                  {result.totalQuestions}
                </summary>
                <ul className="ml-4">
                  {result.userAnswers.map((ua, idx) => (
                    <li
                      key={idx}
                      className={`my-1 p-1 text-black rounded-lg ${
                        ua.isCorrect ? "bg-green-200" : "bg-red-200"
                      }`}
                    >
                      <strong>Q:</strong> {ua.question} <br />
                      <strong>A:</strong> {ua.answer} <br />
                      <strong>{ua.isCorrect ? "✔" : "✘"}</strong>
                    </li>
                  ))}
                </ul>
              </details>
            ))
          )}
        </div>
        <div className="w-screen h-screen flex items-center justify-center">
          <div className="p-4 w-auto flex flex-col text-center border fixed border-neutral-700 text-white rounded-xl backdrop-blur-xl bg-neutral-100/10">
            <h2 className="text-3xl font-medium ">Welcome to the Quiz</h2>
            <p className="flex flex-col items-center">
              <ol className="border gap-2 py-2 my-2 px-2 bg-amber-50 rounded-lg text-amber-500">
                <li className="flex text-xl items-center">
                  <Notebook className="text-amber-500 text-lg" />
                  Note
                </li>
                <li className="flex">
                  <Dot /> you have 30 sec for each question.
                </li>
                <li className="flex">
                  <Dot /> The result will be shown at the end of test.
                </li>
                <li className="flex">
                  <Dot /> Previous tests are also shown in history.
                </li>
              </ol>
            </p>
            <button
              onClick={handleStartQuiz}
              className="bg-blue-500 text-white px-6 py-2 mt-4 rounded"
            >
              Start Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (quizFinished) {
    return (
      <div className="p-4 mt-24 w-full sm:w-1/2">
        <h2 className="text-2xl text-white font-bold">Quiz Finished!</h2>
        <div className="flex justify-between">
          <p className="text-lg text-white">
            Your score: {score} / {questions.length}
          </p>
          <p className="text-white text-lg">Percentage: {finalPercent}%</p>
        </div>
        <ul>
          {userAnswers.map((ua, index) => (
            <li
              key={index}
              className={`my-2 p-2 rounded-xl gap-4 font-normal ${
                ua.isCorrect ? "bg-green-200 " : "bg-red-200 rounded-lg"
              }`}
            >
              <strong className="text-lg ">Q:</strong> {ua.question} <br />
              <strong>Your Answer:</strong> {ua.answer} <br />
              <strong>Result:</strong> {ua.isCorrect ? "Correct" : "Incorrect"}
            </li>
          ))}
        </ul>

        <h2 className="text-2xl font-bold mt-4 text-white">
          Previous Quiz Results
        </h2>
        {quizResults.map((result, index) => (
          <details
            key={index}
            className="border border-neutral-600 p-2 mb-2 bg-neutral-700 rounded-xl text-white group"
          >
            <summary className="cursor-pointer font-semibold duration-300">
              Quiz ID: {result.id} - Score: {result.score}/
              {result.totalQuestions} - {new Date(result.date).toLocaleString()}
            </summary>
            <ul className="ml-4 duration-300">
              {result.userAnswers.map((ua, idx) => (
                <li
                  key={idx}
                  className={`my-1 p-1 text-black rounded-lg ${
                    ua.isCorrect ? "bg-green-200" : "bg-red-200"
                  }`}
                >
                  <strong>Q:</strong> {ua.question} <br />
                  <strong>A:</strong> {ua.answer} <br />
                  <strong>{ua.isCorrect ? "✔" : "✘"}</strong>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="p-4 w-3/4 sm:w-1/4 border-neutral-700 text-white rounded-xl backdrop-blur-xl bg-neutral-100/10">
        <h2 className="text-2xl font-semibold">
          Question {currentQuestion + 1}
        </h2>
        <p className="text-lg text-[#cacaca] mt-2">
          {questions[currentQuestion].question}
        </p>
        <div className="mt-4">
          {questions[currentQuestion].options ? (
            questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="bg-blue-500 text-white w-full px-4 py-2 my-2 cursor-pointer rounded mr-2"
              >
                {option}
              </button>
            ))
          ) : (
            <div>
              <input
                type="text"
                placeholder="Enter your answer"
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                className="border px-4 py-2 rounded w-3/4 my-2"
              />
              <button
                onClick={handleTextAnswer}
                className="bg-green-500 text-white px-4 py-2 rounded ml-2"
              >
                Submit
              </button>
            </div>
          )}
        </div>
        <p className="mt-4">Time left: {timeLeft} seconds</p>
      </div>
    </div>
  );
};

export default Quiz;
