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
        {answers.map(answer => (
          <button
            className='answerButton'
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
        <button onClick={onPrev}>Предыдущий</button>
        <button onClick={onNext}>Следующий</button>
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

interface AnswerState {
  isAnswered: boolean;
  selectedAnswer: number | null;
}

interface AnswersState {
  [key: number]: AnswerState;
}

const Quiz: React.FC<QuizProps> = ({ questions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [answersState, setAnswersState] = React.useState<AnswersState>({});

  const handleAnswer = (isCorrect: boolean, selectedId: number) => {
    setAnswersState((prevState: AnswersState) => ({
      ...prevState,
      [currentQuestionIndex]: {
        isAnswered: true,
        selectedAnswer: selectedId,
      },
    }));
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setCurrentQuestionIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      setCurrentQuestionIndex(questions.length - 1);
    }
  };

  const handleJump = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
      setAnswersState((prevState: AnswersState) => ({
        ...prevState,
        [index]: prevState[index] || {
          isAnswered: false,
          selectedAnswer: null,
        },
      }));
    }
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswersState({});
  };

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswersState = answersState[currentQuestionIndex];

  return (
    <div className='quiz'>
      <h2>
        Правильных ответов: {score} из {questions.length}
      </h2>
      <input
        type='number'
        min='1'
        max={questions.length}
        value={currentQuestionIndex + 1}
        onChange={e => handleJump(Number(e.target.value) - 1)}
      />
      {currentQuestion ? (
        <Question
          question={currentQuestion.question}
          answers={currentQuestion.answers}
          correctAnswer={currentQuestion.correctAnswer}
          onAnswer={handleAnswer}
          onNext={handleNext}
          onPrev={handlePrev}
          isAnswered={currentAnswersState?.isAnswered || false}
          selectedAnswer={currentAnswersState?.selectedAnswer || null}
          questionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
        />
      ) : (
        <h2>
          Ваш финальный счет: {score} из {questions.length}
        </h2>
      )}
      <button onClick={handleReset}>Сбросить результат</button>
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
