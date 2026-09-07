import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import QuizContent from "@/components/QuizContent";

type Question = {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
};

export default async function QuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/signin");

  const { id } = await params;

  const document = await prisma.document.findUnique({
    where: { id, userId: session.user.id },
    include: { quiz: true },
  });

  // Redirect back to notes if document isn't ready or has no quiz
  if (!document || document.status !== "READY" || !document.quiz) {
    redirect(`/notes/${id}/notes`);
  }

  const questions = document.quiz.questions as Question[];

  return (
    <QuizContent
      documentId={id}
      questions={questions}
      previousScore={document.quiz.score}
    />
  );
}
