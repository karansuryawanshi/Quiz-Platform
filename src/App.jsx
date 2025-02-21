import { useState } from "react";
import "./App.css";
import Deepseek from "./components/Quiz";

function App() {
  const [count, setCount] = useState(0);

  const questions = [
    {
      question: "Which planet is closest to the Sun?",
      options: ["Venus", "Mercury", "Earth", "Mars"],
      correctAnswer: "Mercury",
    },
    {
      question:
        "Which data structure organizes items in a First-In, First-Out (FIFO) manner?",
      options: ["Stack", "Queue", "Tree", "Graph"],
      correctAnswer: "Queue",
    },
    {
      question:
        "Which of the following is primarily used for structuring web pages?",
      options: ["Python", "Java", "HTML", "C++"],
      correctAnswer: "HTML",
    },
    {
      question: "Which chemical symbol stands for Gold?",
      options: ["Au", "Gd", "Ag", "Pt"],
      correctAnswer: "Au",
    },
    {
      question:
        "Which of these processes is not typically involved in refining petroleum?",
      options: ["Fractional distillation", "Cracking", "Polymerization"],
      correctAnswer: "Polymerization",
    },
    {
      question: "What is the value of 12 + 28?",
      correctAnswer: "40",
    },
    {
      question: "How many states are there in the United States?",
      correctAnswer: "50",
    },
    {
      question: "In which year was the Declaration of Independence signed?",
      correctAnswer: "1776",
    },
    {
      question: "What is the value of pi rounded to the nearest integer?",
      correctAnswer: "3",
    },
    {
      question:
        "If a car travels at 60 mph for 2 hours, how many miles does it travel?",
      correctAnswer: "120",
    },
  ];

  return (
    <div className=" flex items-center justify-center bg-linear-to-tr from-neutral-900 via-neutral-800 to-neutral-900">
      <Deepseek questions={questions}></Deepseek>
    </div>
  );
}

export default App;
