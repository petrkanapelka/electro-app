import React from 'react';
import { questions } from './Questions';

interface Answer {
  id: number;
  answer: string;
}

interface QuestionProps {
  question: string;
  answers: Answer[];
  correctAnswer: number;
  onAnswer: (isCorrect: boolean, selectedId: number) => void;
  onNext: () => void;
  onPrev: () => void;
  isAnswered: boolean;
  selectedAnswer: number | null;
  questionIndex: number;
  totalQuestions: number;
}

const Question: React.FC<QuestionProps> = ({
  question,
  answers,
  correctAnswer,
  onAnswer,
  onNext,
  onPrev,
  isAnswered,
  selectedAnswer,
  questionIndex,
  totalQuestions,
}) => {
  const handleAnswer = (answer: Answer) => {
    if (!isAnswered) {
      onAnswer(answer.id === correctAnswer, answer.id);
    }
  };

  return (
    <div>
      <h2>
        Вопрос {questionIndex + 1} из {totalQuestions}
      </h2>
      <h3>{question}</h3>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {answers.map((answer) => (
          <button
            key={answer.id}
            onClick={() => handleAnswer(answer)}
            disabled={isAnswered}
            style={{
              backgroundColor: isAnswered
                ? answer.id === selectedAnswer
                  ? answer.id === correctAnswer
                    ? 'green'
                    : 'red'
                  : answer.id === correctAnswer
                    ? 'green'
                    : ''
                : '',
              color: isAnswered ? 'white' : 'black',
              marginBottom: '10px',
            }}
          >
            {answer.answer}
          </button>
        ))}
      </div>
      <div>
        <button onClick={onPrev} disabled={!isAnswered}>Предыдущий</button>
        <button onClick={onNext} disabled={!isAnswered}>Следующий</button>
      </div>
    </div>
  );
};

interface QuizProps {
  questions: {
    question: string;
    answers: Answer[];
    correctAnswer: number;
  }[];
}

const Quiz: React.FC<QuizProps> = ({ questions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [isAnswered, setIsAnswered] = React.useState(false);
  const [selectedAnswer, setSelectedAnswer] = React.useState<number | null>(null);

  const handleAnswer = (isCorrect: boolean, selectedId: number) => {
    setSelectedAnswer(selectedId);
    setIsAnswered(true);
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsAnswered(false);
      setSelectedAnswer(null);
    } else {
      alert(`Ваш счет: ${score} из ${questions.length}`);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setIsAnswered(false);
      setSelectedAnswer(null);
    }
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsAnswered(false);
    setSelectedAnswer(null);
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      <h2>Счет: {score} из {questions.length}</h2>
      {currentQuestion ? (
        <Question
          question={currentQuestion.question}
          answers={currentQuestion.answers}
          correctAnswer={currentQuestion.correctAnswer}
          onAnswer={handleAnswer}
          onNext={handleNext}
          onPrev={handlePrev}
          isAnswered={isAnswered}
          selectedAnswer={selectedAnswer}
          questionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
        />
      ) : (
        <h2>Ваш финальный счет: {score} из {questions.length}</h2>
      )}
      <button onClick={handleReset}>Reset</button>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <div className='Container'>
      <Quiz questions={questions} />
    </div>
  );
};

export default App;
