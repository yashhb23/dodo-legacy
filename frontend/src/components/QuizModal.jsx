import { useState, useEffect, useRef } from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mauritiusQuiz, calculateQuizResult } from '@/data/quiz';

export default function QuizModal({ isOpen, onClose }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [quizComplete, setQuizComplete] = useState(false);
  const stateInitialized = useRef(false);

  // Preserve state when modal reopens in same session
  useEffect(() => {
    if (isOpen && !stateInitialized.current) {
      stateInitialized.current = true;
    }
  }, [isOpen]);

  const question = mauritiusQuiz.questions[currentQuestion];
  const isLastQuestion = currentQuestion === mauritiusQuiz.questions.length - 1;

  const handleAnswerSelect = (optionId) => {
    if (showExplanation) return;
    setSelectedAnswer(optionId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;
    
    const correct = question.options.find(opt => opt.id === selectedAnswer).correct;
    setAnswers(prev => [...prev, { questionId: question.id, correct }]);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      setQuizComplete(true);
    } else {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setAnswers([]);
    setQuizComplete(false);
  };

  const handleClose = () => {
    // Don't reset state on close - preserve progress
    onClose();
  };

  const handleCloseAndReset = () => {
    handleRestart();
    onClose();
  };

  if (quizComplete) {
    const correctCount = answers.filter(a => a.correct).length;
    const result = calculateQuizResult(correctCount, mauritiusQuiz.questions.length);
    const percentage = Math.round((correctCount / mauritiusQuiz.questions.length) * 100);

    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] bg-card border-border/50 text-foreground p-0 overflow-hidden">
          <div className="max-h-[90vh] overflow-y-auto p-6 sm:p-8 text-center">
            <div className="text-5xl sm:text-6xl mb-4">{result.emoji}</div>
            <h2
              className="text-3xl sm:text-4xl uppercase tracking-wide mb-4 text-primary"
              style={{ fontFamily: 'Bebas Neue, sans-serif' }}
            >
              {result.level}
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-6">{result.message}</p>
            
            <div className="mb-8">
              <div className="text-4xl sm:text-5xl font-bold text-foreground mb-2">
                {correctCount}/{mauritiusQuiz.questions.length}
              </div>
              <p className="text-muted-foreground">Correct Answers ({percentage}%)</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={handleRestart} className="bg-gradient-to-r from-primary to-secondary">
                Try Again
              </Button>
              <Button onClick={handleCloseAndReset} variant="outline">
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl w-[95vw] sm:w-full max-h-[90vh] bg-card border-border/50 text-foreground p-0 overflow-hidden">
        <div className="max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-border/50">
            <div className="flex items-center justify-between mb-2">
              <DialogTitle
                className="text-xl sm:text-2xl uppercase tracking-wide"
                style={{ fontFamily: 'Bebas Neue, sans-serif' }}
              >
                {mauritiusQuiz.title}
              </DialogTitle>
            </div>
            
            {/* Quiz Subtitle */}
            <p className="text-sm text-muted-foreground mb-4">
              {mauritiusQuiz.subtitle}
            </p>
            
            {/* Progress */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / mauritiusQuiz.questions.length) * 100}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {currentQuestion + 1}/{mauritiusQuiz.questions.length}
              </span>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Badge className="text-xs capitalize">{question.difficulty}</Badge>
              <Badge variant="outline" className="text-xs capitalize">{question.category}</Badge>
            </div>
          </div>

          {/* Question */}
          <div className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">{question.question}</h3>

            {/* Options */}
            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
              {question.options.map((option) => {
                const isSelected = selectedAnswer === option.id;
                const isCorrect = option.correct;
                const showResult = showExplanation;

                let borderColor = 'border-border/50';
                let bgColor = 'bg-card/30';
                let icon = null;

                if (showResult) {
                  if (isCorrect) {
                    borderColor = 'border-primary';
                    bgColor = 'bg-primary/10';
                    icon = <Check className="w-5 h-5 text-primary flex-shrink-0" />;
                  } else if (isSelected && !isCorrect) {
                    borderColor = 'border-destructive';
                    bgColor = 'bg-destructive/10';
                    icon = <X className="w-5 h-5 text-destructive flex-shrink-0" />;
                  }
                } else if (isSelected) {
                  borderColor = 'border-primary';
                  bgColor = 'bg-primary/10';
                }

                return (
                  <button
                    key={option.id}
                    onClick={() => handleAnswerSelect(option.id)}
                    disabled={showExplanation}
                    className={`w-full p-3 sm:p-4 rounded-lg border-2 ${borderColor} ${bgColor} hover:border-primary/50 transition-all text-left flex items-center justify-between gap-3 disabled:cursor-not-allowed`}
                  >
                    <span className="text-sm">{option.text}</span>
                    {icon}
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div className="p-3 sm:p-4 bg-muted/30 rounded-lg border border-border/50 mb-4 sm:mb-6">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold mb-2 text-sm sm:text-base">Did You Know?</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {question.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              {!showExplanation ? (
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer}
                  className="flex-1 bg-gradient-to-r from-primary to-secondary"
                >
                  Submit Answer
                </Button>
              ) : (
                <Button
                  onClick={handleNextQuestion}
                  className="flex-1 bg-gradient-to-r from-primary to-secondary"
                >
                  {isLastQuestion ? 'See Results' : 'Next Question'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
