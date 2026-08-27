// TODO: Phase 6 - Generate on-demand quiz
export async function POST(req: Request, { params }: { params: { id: string } }) {
  return new Response(JSON.stringify({ id: params.id }));
}
