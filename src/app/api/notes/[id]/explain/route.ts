// TODO: Phase 6 - Fetch or generate RAG notes
export async function GET(req: Request, { params }: { params: { id: string } }) {
  return new Response(JSON.stringify({ id: params.id }));
}
