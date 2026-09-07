import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const document = await prisma.document.findUnique({
    where: { id, userId: session.user.id },
    select: { status: true, title: true, notesContent: true },
  });

  if (!document) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json({
    status: document.status,
    title: document.title,
    notesContent: document.notesContent,
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Make sure this document belongs to the current user before deleting
  const document = await prisma.document.findUnique({
    where: { id, userId: session.user.id },
    select: { id: true },
  });

  if (!document) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  // Deleting the document cascades to DocumentChunk, Quiz, Conversation, and Message
  await prisma.document.delete({ where: { id } });

  return Response.json({ success: true });
}
