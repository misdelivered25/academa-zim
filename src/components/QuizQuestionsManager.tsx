import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Plus, Trash2, Save, X, Sparkles, Upload, Loader2, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id?: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  points: number;
  question_type: string;
}

interface QuizQuestionsManagerProps {
  quiz: any;
  existingQuestions: Question[];
  onClose: () => void;
  onSaved: () => void;
}

const QuizQuestionsManager = ({ quiz, existingQuestions, onClose, onSaved }: QuizQuestionsManagerProps) => {
  const [questions, setQuestions] = useState<Question[]>(
    existingQuestions.length > 0 
      ? existingQuestions 
      : [{ question_text: '', options: ['', '', '', ''], correct_answer: '', points: 1, question_type: 'multiple_choice' }]
  );
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [aiTopic, setAiTopic] = useState(quiz.title || '');
  const [aiDocument, setAiDocument] = useState('');
  const [aiNumQuestions, setAiNumQuestions] = useState(5);
  const [aiDifficulty, setAiDifficulty] = useState(quiz.difficulty || 'medium');
  const { toast } = useToast();

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question_text: '', options: ['', '', '', ''], correct_answer: '', points: 1, question_type: 'multiple_choice' }
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updated = [...questions];
    const newOptions = [...updated[questionIndex].options];
    newOptions[optionIndex] = value;
    updated[questionIndex] = { ...updated[questionIndex], options: newOptions };
    setQuestions(updated);
  };

  const [pdfFile, setPdfFile] = useState<string | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string>('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
    const isText = file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md');

    if (!isPdf && !isText) {
      toast({
        title: "Unsupported File",
        description: "Please upload a .pdf, .txt, or .md file",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isPdf) {
        // Convert PDF to base64
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          setPdfFile(base64);
          setPdfFileName(file.name);
          setAiDocument(''); // Clear text when PDF is uploaded
          toast({
            title: "PDF Loaded",
            description: `Loaded ${file.name}`,
          });
        };
        reader.onerror = () => {
          toast({
            title: "Error",
            description: "Failed to read PDF file",
            variant: "destructive",
          });
        };
        reader.readAsDataURL(file);
      } else {
        const text = await file.text();
        setAiDocument(text);
        setPdfFile(null);
        setPdfFileName('');
        toast({
          title: "File Loaded",
          description: `Loaded ${file.name} (${text.length} characters)`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to read file",
        variant: "destructive",
      });
    }
  };

  const generateAIQuestions = async () => {
    if (!aiTopic.trim() && !aiDocument.trim() && !pdfFile) {
      toast({
        title: "Missing Input",
        description: "Please enter a topic or upload course materials",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-quiz-questions', {
        body: {
          topic: aiTopic.trim(),
          documentText: aiDocument.trim() || undefined,
          pdfBase64: pdfFile || undefined,
          numberOfQuestions: aiNumQuestions,
          difficulty: aiDifficulty,
        },
      });

      if (error) throw error;
      
      if (data.error) {
        toast({
          title: "Generation Failed",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      if (data.questions && data.questions.length > 0) {
        const formattedQuestions: Question[] = data.questions.map((q: any) => ({
          question_text: q.question_text,
          options: q.options.slice(0, 4),
          correct_answer: q.correct_answer,
          points: q.points || 1,
          question_type: 'multiple_choice',
        }));

        // Add to existing questions or replace empty ones
        const hasEmptyOnly = questions.length === 1 && !questions[0].question_text.trim();
        setQuestions(hasEmptyOnly ? formattedQuestions : [...questions, ...formattedQuestions]);
        
        toast({
          title: "Questions Generated!",
          description: `Added ${formattedQuestions.length} AI-generated questions`,
        });
        setShowAIDialog(false);
      }
    } catch (error) {
      console.error('AI generation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate questions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question_text.trim()) {
        toast({
          title: "Validation Error",
          description: `Question ${i + 1} is missing the question text`,
          variant: "destructive",
        });
        return;
      }
      const filledOptions = q.options.filter(o => o.trim());
      if (filledOptions.length < 2) {
        toast({
          title: "Validation Error",
          description: `Question ${i + 1} needs at least 2 options`,
          variant: "destructive",
        });
        return;
      }
      if (!q.correct_answer.trim()) {
        toast({
          title: "Validation Error",
          description: `Question ${i + 1} is missing the correct answer`,
          variant: "destructive",
        });
        return;
      }
      if (!filledOptions.includes(q.correct_answer.trim())) {
        toast({
          title: "Validation Error",
          description: `Question ${i + 1}: correct answer must match one of the options`,
          variant: "destructive",
        });
        return;
      }
    }

    setSaving(true);
    try {
      // Delete existing questions first
      if (existingQuestions.length > 0) {
        const existingIds = existingQuestions.map(q => q.id).filter(Boolean);
        if (existingIds.length > 0) {
          await (supabase as any)
            .from('quiz_questions')
            .delete()
            .in('id', existingIds);
        }
      }

      // Insert new questions
      const questionsToInsert = questions.map(q => ({
        quiz_id: quiz.id,
        question_text: q.question_text.trim(),
        options: q.options.filter(o => o.trim()),
        correct_answer: q.correct_answer.trim(),
        points: q.points || 1,
        question_type: q.question_type || 'multiple_choice',
      }));

      const { error } = await (supabase as any)
        .from('quiz_questions')
        .insert(questionsToInsert);

      if (error) throw error;

      // Update quiz total_questions
      await (supabase as any)
        .from('quizzes')
        .update({ total_questions: questions.length })
        .eq('id', quiz.id);

      toast({
        title: "Success",
        description: `${questions.length} question(s) saved successfully`,
      });

      onSaved();
      onClose();
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Error",
        description: "Failed to save questions",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Manage Questions - {quiz.title}</DialogTitle>
            <DialogDescription>Add or edit questions for this quiz</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* AI Generation Button */}
            <Button
              variant="outline"
              onClick={() => setShowAIDialog(true)}
              className="w-full bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 border-primary/30"
            >
              <Sparkles className="h-4 w-4 mr-2 text-primary" />
              Generate Questions with AI
            </Button>

            {questions.map((question, qIndex) => (
              <Card key={qIndex} className="bg-gradient-card border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Question {qIndex + 1}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{question.points} pt{question.points !== 1 ? 's' : ''}</Badge>
                      {questions.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeQuestion(qIndex)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Question Text *</label>
                    <Textarea
                      placeholder="Enter your question..."
                      value={question.question_text}
                      onChange={(e) => updateQuestion(qIndex, 'question_text', e.target.value)}
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Answer Options *</label>
                    <div className="grid grid-cols-2 gap-2">
                      {question.options.map((option, oIndex) => (
                        <Input
                          key={oIndex}
                          placeholder={`Option ${oIndex + 1}`}
                          value={option}
                          onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Correct Answer *</label>
                      <select
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                        value={question.correct_answer}
                        onChange={(e) => updateQuestion(qIndex, 'correct_answer', e.target.value)}
                      >
                        <option value="">Select correct answer</option>
                        {question.options.filter(o => o.trim()).map((option, oIndex) => (
                          <option key={oIndex} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Points</label>
                      <Input
                        type="number"
                        min={1}
                        max={10}
                        value={question.points}
                        onChange={(e) => updateQuestion(qIndex, 'points', parseInt(e.target.value) || 1)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button
              variant="outline"
              onClick={addQuestion}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-gradient-hero hover:shadow-glow transition-all"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Questions'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Generation Dialog */}
      <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Question Generator
            </DialogTitle>
            <DialogDescription>
              Generate quiz questions from a topic or course materials
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Topic / Subject</label>
              <Input
                placeholder="e.g., Photosynthesis, Zimbabwean History, Algebra..."
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Course Materials (Optional)</label>
              {pdfFile ? (
                <div className="flex items-center justify-between p-3 bg-primary/10 rounded-md border border-primary/30">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">{pdfFileName}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setPdfFile(null); setPdfFileName(''); }}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Textarea
                  placeholder="Paste your notes, textbook content, or any study material here..."
                  value={aiDocument}
                  onChange={(e) => setAiDocument(e.target.value)}
                  rows={4}
                />
              )}
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                  <Upload className="h-4 w-4" />
                  <span>Upload PDF, .txt, or .md file</span>
                  <input
                    type="file"
                    accept=".pdf,.txt,.md,application/pdf"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Number of Questions</label>
                <select
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  value={aiNumQuestions}
                  onChange={(e) => setAiNumQuestions(parseInt(e.target.value))}
                >
                  <option value={3}>3 questions</option>
                  <option value={5}>5 questions</option>
                  <option value={10}>10 questions</option>
                  <option value={15}>15 questions</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Difficulty</label>
                <select
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  value={aiDifficulty}
                  onChange={(e) => setAiDifficulty(e.target.value)}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowAIDialog(false)}
                className="flex-1"
                disabled={generating}
              >
                Cancel
              </Button>
              <Button
                onClick={generateAIQuestions}
                disabled={generating || (!aiTopic.trim() && !aiDocument.trim() && !pdfFile)}
                className="flex-1 bg-gradient-hero hover:shadow-glow transition-all"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuizQuestionsManager;
