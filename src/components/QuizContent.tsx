'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { RotateCcw, ChevronRight } from 'lucide-react';

type Question = {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
};

const LETTERS = ['A', 'B', 'C', 'D'];

export default function QuizContent({
  documentId,
  questions,
  previousScore,
}: {
  documentId: string;
  questions: Question[];
  previousScore: number | null;
}) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);
  const [saving, setSaving] = useState(false);

  const q = questions[current];
  const isLast = current === questions.length - 1;
  const isCorrect = selected === q.answerIndex;

  // Returns the className for each option button based on quiz state
  function optionClass(i: number) {
    const base =
      'flex items-center gap-4 w-full text-left px-4 py-4 rounded-xl border transition-colors duration-150 cursor-pointer';

    if (!submitted) {
      return cn(
        base,
        'border-border bg-background hover:bg-muted',
        selected === i && 'bg-muted border-primary',
      );
    }

    // After submission — reveal correct / wrong
    if (i === q.answerIndex) {
      return cn(base, 'bg-success-bg text-success border-success cursor-default');
    }
    if (i === selected) {
      return cn(base, 'bg-destructive/10 text-destructive border-destructive cursor-default');
    }
    return cn(base, 'border-border bg-background opacity-40 cursor-default');
  }

  async function handleNext() {
    const newAnswers = [...answers, selected!];

    if (isLast) {
      setSaving(true);
      const res = await fetch(`/api/notes/${documentId}/quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: newAnswers }),
      });
      const data = await res.json();
      setScore(data.score);
      setDone(true);
      setSaving(false);
    } else {
      setAnswers(newAnswers);
      setCurrent(current + 1);
      setSelected(null);
      setSubmitted(false);
    }
  }

  function handleRetake() {
    setCurrent(0);
    setSelected(null);
    setSubmitted(false);
    setAnswers([]);
    setDone(false);
    setScore(0);
  }

  // --- Results screen ---
  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 flex flex-col items-center gap-6 text-center">
        <div className="flex flex-col items-center gap-2">
          <p className="text-7xl font-bold text-foreground">
            {score}
            <span className="text-4xl text-muted-foreground">/{questions.length}</span>
          </p>
          <p className="text-muted-foreground text-lg">{pct}% correct</p>
        </div>

        <Separator className="w-24" />

        <p className="text-muted-foreground text-sm">
          {pct >= 80
            ? 'Great job! You have a strong grasp of the material.'
            : pct >= 50
              ? 'Good effort. Review the notes and try again.'
              : 'Keep studying and give it another shot!'}
        </p>

        <Button onClick={handleRetake}>
          <RotateCcw data-icon="inline-start" />
          Retake Quiz
        </Button>
      </div>
    );
  }

  // --- Quiz screen ---
  return (
    <div className="max-w-2xl mx-auto px-6 py-10 flex flex-col gap-6">
      {/* Question counter */}
      <div className="flex items-center gap-3">
        <Badge variant="secondary">
          Question {current + 1} of {questions.length}
        </Badge>
        {previousScore !== null && current === 0 && (
          <span className="text-xs text-muted-foreground">
            Previous score: {previousScore}/{questions.length}
          </span>
        )}
      </div>

      {/* Question text */}
      <p className="text-xl font-medium text-foreground leading-relaxed">{q.question}</p>

      <Separator />

      {/* Options */}
      <div className="flex flex-col gap-3">
        {q.options.map((option, i) => (
          <button
            key={i}
            onClick={() => !submitted && setSelected(i)}
            className={optionClass(i)}
            disabled={submitted}
          >
            <span
              className={cn(
                'size-8 shrink-0 rounded-full border flex items-center justify-center text-sm font-semibold',
                !submitted && selected === i
                  ? 'border-primary text-primary'
                  : 'border-border text-muted-foreground',
                submitted && i === q.answerIndex && 'border-success text-success',
                submitted && i === selected && i !== q.answerIndex && 'border-destructive text-destructive',
              )}
            >
              {LETTERS[i]}
            </span>
            <span className="text-sm leading-relaxed">{option}</span>
          </button>
        ))}
      </div>

      {/* Explanation — shown after submitting */}
      {submitted && (
        <div
          className={cn(
            'p-4 rounded-xl text-sm leading-relaxed',
            isCorrect ? 'bg-success-bg text-success' : 'bg-destructive/10 text-destructive',
          )}
        >
          <p className="font-semibold mb-1">{isCorrect ? '✓ Correct!' : '✗ Incorrect'}</p>
          <p>{q.explanation}</p>
        </div>
      )}

      {/* Action buttons */}
      {!submitted ? (
        <Button disabled={selected === null} onClick={() => setSubmitted(true)}>
          Submit Answer
        </Button>
      ) : (
        <Button onClick={handleNext} disabled={saving}>
          {saving ? 'Saving…' : isLast ? 'See Results' : 'Next Question'}
          {!saving && <ChevronRight data-icon="inline-end" />}
        </Button>
      )}
    </div>
  );
}
