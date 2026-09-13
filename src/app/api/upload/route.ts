import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { prisma } from '@/lib/prisma';
import { documentQueue } from '@/lib/redis';

export async function POST(request: Request) {
  // 1. Verify user session
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: 'You must be logged in to upload.' }, { status: 401 });
  }

  // 2. Parse multipart form data
  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const question = formData.get('question') as string | null;

  if (!file || file.size === 0) {
    return Response.json({ error: 'A PDF file is required.' }, { status: 400 });
  }
  if (!question || question.trim() === '') {
    return Response.json({ error: 'A question is required.' }, { status: 400 });
  }

  // 3. Convert file to buffer and upload to Cloudinary
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const fileUrl = await uploadToCloudinary(buffer, file.name);

  // 4. Create Document record in PROCESSING state
  const document = await prisma.document.create({
    data: {
      title: file.name.replace('.pdf', ''),
      fileUrl,
      status: 'PROCESSING',
      userId: session.user.id,
    },
  });

  // 5. Create Conversation tied to this document
  const conversation = await prisma.conversation.create({
    data: {
      userId: session.user.id,
      documentId: document.id,
    },
  });

  // 6. Save the user's question as the first message
  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      isUser: true,
      content: question.trim(),
    },
  });

  // 7. Enqueue background processing job to BullMQ
  await documentQueue.add('process-document', {
    documentId: document.id,
    fileUrl,
  });

  // 8. Return immediately with documentId so the client redirects to the notes page
  return Response.json({ documentId: document.id }, { status: 201 });
}
