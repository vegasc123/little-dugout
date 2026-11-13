// POST /api/upload
// Hands the browser a short-lived token so it can send a customer's PNG straight to Vercel Blob.
// The storage key (BLOB_READ_WRITE_TOKEN) stays on the server; Vercel adds it to the project.
import { handleUpload } from '@vercel/blob/client';

const MAX_BYTES = 10 * 1024 * 1024;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
  if (!process.env.BLOB_READ_WRITE_TOKEN) return res.status(503).json({ error: 'storage-not-configured' });
  try {
    const out = await handleUpload({
      request: req,
      body: req.body,
      onBeforeGenerateToken: async (pathname) => {
        if (!/^uploads\/[a-z0-9-]{1,40}\.png$/.test(pathname)) throw new Error('bad pathname');
        return { allowedContentTypes: ['image/png'], maximumSizeInBytes: MAX_BYTES, addRandomSuffix: true };
      },
    });
    return res.status(200).json(out);
  } catch (err) {
    return res.status(400).json({ error: String(err && err.message || err) });
  }
}
