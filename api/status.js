export default function handler(req, res) {
  const origin = req.headers.origin || '*';
  const allowed = process.env.ALLOWED_ORIGIN;
  const allowOrigin = allowed ? (origin === allowed ? origin : allowed) : origin;
  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  res.status(200).json({ ok: true });
}
