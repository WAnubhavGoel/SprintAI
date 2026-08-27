export default function QuizPage({ params }: { params: { id: string } }) {
  return <div><p>Quiz for lesson: {params.id}</p></div>;
}
