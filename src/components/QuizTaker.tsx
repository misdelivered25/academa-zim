import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Award, 
  ArrowRight, 
  ArrowLeft,
  AlertTriangle,
  Trophy,
  RotateCcw
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Confetti from "@/components/Confetti";

interface Question {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  points: number;
}

interface QuizTakerProps {
  quiz: any;
  attemptId: string;
  questions: Question[];
  onComplete: () => void;
  onClose: () => void;
}

const QuizTaker = ({ quiz, attemptId, questions, onComplete, onClose }: QuizTakerProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState((quiz.duration_minutes || 30) * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  // Timer countdown
  useEffect(() => {
    if (showResults || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showResults, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const formattedAnswers = questions.map((q) => ({
        question_id: q.id,
        selected_answer: answers[q.id] || null,
      }));

      const { data, error } = await supabase.functions.invoke('submit-quiz', {
        body: {
          quiz_id: quiz.id,
          answers: formattedAnswers,
          attempt_id: attemptId,
        },
      });

      if (error) throw error;

      setResults(data);
      setShowResults(true);
      
      toast({
        title: "Quiz Submitted!",
        description: `You scored ${data.percentage}%`,
      });
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "Error",
        description: "Failed to submit quiz",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [answers, attemptId, isSubmitting, questions, quiz.id, toast]);

  const getTimeColor = () => {
    if (timeLeft < 60) return "text-destructive";
    if (timeLeft < 300) return "text-yellow-500";
    return "text-foreground";
  };

  if (showResults && results) {
    const passed = results.percentage >= (quiz.passing_score || 50);
    
    return (
      <>
        {/* Confetti celebration for passing */}
        <Confetti isActive={passed} particleCount={150} duration={5000} />
        
        <Dialog open={true} onOpenChange={() => { onComplete(); onClose(); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              {passed ? (
                <Trophy className="h-6 w-6 text-yellow-500" />
              ) : (
                <AlertTriangle className="h-6 w-6 text-destructive" />
              )}
              Quiz Results
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Score Summary */}
            <Card className={`border-2 ${passed ? 'border-green-500 bg-green-500/10' : 'border-destructive bg-destructive/10'}`}>
              <CardContent className="pt-6">
                <div className="text-center space-y-3">
                  <div className="text-5xl font-bold">
                    {results.percentage}%
                  </div>
                  <p className="text-lg">
                    {results.score} / {results.total_points} points
                  </p>
                  <Badge className={passed ? 'bg-green-500' : 'bg-destructive'}>
                    {passed ? 'PASSED' : 'FAILED'}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Passing score: {quiz.passing_score || 50}%
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Question Review */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Question Review</h3>
              {results.data?.answers?.map((answer: any, index: number) => {
                const question = questions.find(q => q.id === answer.question_id);
                if (!question) return null;
                
                return (
                  <Card key={answer.question_id} className={`border ${answer.is_correct ? 'border-green-500/50' : 'border-destructive/50'}`}>
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        {answer.is_correct ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                        )}
                        <div className="space-y-2 flex-1">
                          <p className="font-medium">Q{index + 1}: {question.question_text}</p>
                          <div className="text-sm space-y-1">
                            <p>
                              <span className="text-muted-foreground">Your answer: </span>
                              <span className={answer.is_correct ? 'text-green-500' : 'text-destructive'}>
                                {answer.selected_answer || 'Not answered'}
                              </span>
                            </p>
                            {!answer.is_correct && (
                              <p>
                                <span className="text-muted-foreground">Correct answer: </span>
                                <span className="text-green-500">{answer.correct_answer}</span>
                              </p>
                            )}
                          </div>
                        </div>
                        <Badge variant="outline" className="flex-shrink-0">
                          {answer.points_earned}/{question.points} pts
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => { onComplete(); onClose(); }}
                className="flex-1"
              >
                Close
              </Button>
              <Button
                onClick={() => { onComplete(); onClose(); }}
                className="flex-1 bg-gradient-hero hover:shadow-glow transition-all"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Back to Quizzes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">{quiz.title}</DialogTitle>
            <div className={`flex items-center gap-2 font-mono text-lg ${getTimeColor()}`}>
              <Clock className="h-5 w-5" />
              {formatTime(timeLeft)}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span>{answeredCount} answered</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">
                  {currentQuestion?.question_text}
                </CardTitle>
                <Badge variant="outline">
                  {currentQuestion?.points || 1} {currentQuestion?.points === 1 ? 'point' : 'points'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(currentQuestion?.options as string[] || []).map((option, index) => {
                  const isSelected = answers[currentQuestion?.id] === option;
                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswer(currentQuestion?.id, option)}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-primary bg-primary' : 'border-muted-foreground'
                        }`}>
                          {isSelected && <CheckCircle className="h-4 w-4 text-primary-foreground" />}
                        </div>
                        <span>{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Question Navigation Dots */}
          <div className="flex flex-wrap gap-2 justify-center">
            {questions.map((q, index) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-8 h-8 rounded-full text-sm font-medium transition-all ${
                  index === currentQuestionIndex
                    ? 'bg-primary text-primary-foreground'
                    : answers[q.id]
                    ? 'bg-green-500 text-white'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
              disabled={currentQuestionIndex === 0}
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            {currentQuestionIndex < questions.length - 1 ? (
              <Button
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                className="flex-1 bg-gradient-hero hover:shadow-glow transition-all"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-gradient-hero hover:shadow-glow transition-all"
              >
                <Award className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
              </Button>
            )}
          </div>

          {/* Warning if not all answered */}
          {answeredCount < questions.length && (
            <div className="flex items-center gap-2 text-sm text-yellow-500 bg-yellow-500/10 p-3 rounded-lg">
              <AlertTriangle className="h-4 w-4" />
              <span>{questions.length - answeredCount} question(s) not answered yet</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuizTaker;
