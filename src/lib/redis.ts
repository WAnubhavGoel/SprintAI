import { Queue } from 'bullmq';
import Redis from 'ioredis';

// maxRetriesPerRequest: null is required by BullMQ ? without it, BullMQ throws an error
export const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

// This queue receives jobs whenever a user uploads a document.
// The background worker picks up each job and processes the PDF.
export const documentQueue = new Queue('document-queue', { connection: redis });
