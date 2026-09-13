import { Queue } from 'bullmq';
import Redis from 'ioredis';

export const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
  ...(process.env.REDIS_URL?.startsWith('rediss://')
    ? { tls: { rejectUnauthorized: false } }
    : {}),
});

export const documentQueue = new Queue('document-queue', { connection: redis });
