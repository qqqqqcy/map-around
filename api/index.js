module.exports = function(req, res) {
  const origin = req.headers.origin || '*';
  const allowed = process.env.ALLOWED_ORIGIN;
  const allowOrigin = allowed ? (origin === allowed ? origin : allowed) : origin;
  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  res.status(200).json({
    ok: true,
    endpoints: [
      '/api/status',
      '/api/env-check',
      '/api/amap-place-text?keywords=北京',
      '/api/amap-place-around?location=116.4074,39.9042&radius=1000&types=餐饮服务|购物服务|生活服务|金融保险服务'
    ]
  });
}

