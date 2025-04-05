'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function Quiz({ quiz, sessionId, onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[questionIndex] = answerIndex;
      return newAnswers;
    });
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    return Math.round((correctAnswers / quiz.questions.length) * 100);
  };

  const handleSubmit = async () => {
    const finalScore = calculateScore();
    setScore(finalScore);

    try {
      const response = await fetch('/api/expert-sessions/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quizId: quiz._id,
          sessionId,
          answers: answers.map((answer, index) => ({
            questionIndex: index,
            selectedAnswer: answer
          })),
          score: finalScore,
          passed: finalScore >= quiz.passingScore
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit quiz');
      }

      const data = await response.json();
      onComplete(data.data);
    } catch (error) {
      toast.error('Failed to submit quiz');
    }
  };

  if (score !== null) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Quiz Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="text-4xl font-bold">
              {score}%
            </div>
            <div className={`text-xl ${score >= quiz.passingScore ? 'text-green-600' : 'text-red-600'}`}>
              {score >= quiz.passingScore ? 'Congratulations! You passed!' : 'Sorry, you did not pass.'}
            </div>
            {score >= quiz.passingScore && (
              <div className="text-lg">
                You earned {quiz.rewardPoints} reward points!
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Session Quiz</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-sm text-gray-500">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              {quiz.questions[currentQuestion].question}
            </h3>
            <RadioGroup
              value={answers[currentQuestion]?.toString()}
              onValueChange={(value) => handleAnswerSelect(currentQuestion, parseInt(value))}
            >
              {quiz.questions[currentQuestion].options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        {currentQuestion < quiz.questions.length - 1 ? (
          <Button
            onClick={() => setCurrentQuestion(prev => prev + 1)}
            disabled={answers[currentQuestion] === undefined}
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={answers[currentQuestion] === undefined}
          >
            Submit Quiz
          </Button>
        )}
      </CardFooter>
    </Card>
  );
} 