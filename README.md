# Quiz App

This is a React-based quiz application that allows users to answer multiple-choice and text-based questions. The quiz keeps track of scores, stores quiz history using IndexedDB, and provides a summary of previous attempts.

## Features

- Timed Questions: Each question has a 30-second timer.

- Multiple Choice & Text Input: Supports both question formats.

- Score Calculation: Displays final score and percentage at the end of the quiz.

- Quiz History: Saves past quiz results using IndexedDB.

- User-Friendly UI: Responsive design with a clean interface.

## Technologies Used

- React.js for UI development

- IndexedDB (idb library) for local storage

- Tailwind CSS for styling

- Lucide React Icons for UI enhancements

## Installation

```
# Clone the repository
git clone https://github.com/yourusername/quiz-app.git
cd quiz-app

# Install dependencies
npm install

# Start the development server
npm start
```

## Usage

- Click the "Start Test" button to begin the quiz.

- Answer multiple-choice or text-input questions within the time limit.

- View your score at the end and review previous quiz results.

## File Structure

```
├── src
│   ├── components
│   │   ├── Quiz.js  // Main Quiz Component
│   ├── App.js  // Main Application
│   ├── index.js  // Entry Point
├── public
├── package.json
└── README.md
```

## Future Improvements

- Add more question types (e.g., image-based, drag-and-drop)

- Implement authentication for personalized quiz history

- Enhance UI with animations
