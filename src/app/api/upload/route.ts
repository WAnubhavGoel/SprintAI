import { auth } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { documentQueue } from '@/lib/redis';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  // 1. Verify the user is logged in
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return Response.json({ error: 'You must be logged in to upload.' }, { status: 401 });
  }

  // 2. Parse the multipart form data
  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const question = formData.get('question') as string | null;

  // 3. Both the PDF and the question are required — no upload without a question
  if (!file || file.size === 0) {
    return Response.json({ error: 'A PDF file is required.' }, { status: 400 });
  }
  if (!question || question.trim() === '') {
    return Response.json({ error: 'A question is required.' }, { status: 400 });
  }

  // 4. Stream the PDF buffer directly to Cloudinary — no local disk write
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const fileUrl = await uploadToCloudinary(buffer, file.name);

  // 5. Create the Document record in PROCESSING state
  const document = await prisma.document.create({
    data: {
      title: file.name.replace('.pdf', ''),
      fileUrl,
      status: 'PROCESSING',
      userId: session.user.id,
    },
  });

  // 6. Create the Conversation tied to this document (1-to-1 relation)
  const conversation = await prisma.conversation.create({
    data: {
      userId: session.user.id,
      documentId: document.id,
    },
  });

  // 7. Save the user's question as the first Message so it persists in chat history
  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      isUser: true,
      content: question.trim(),
    },
  });

  // 8. Add a job to BullMQ — the worker picks this up and handles all the heavy work:
  //    PDF parsing → chunking → embedding → study notes → quiz generation → mark READY.
  //    This returns in ~300ms so the user is immediately redirected to the notes page.
  await documentQueue.add('process-document', {
    documentId: document.id,
    fileUrl,
  });

  return Response.json({ documentId: document.id }, { status: 201 });
}
