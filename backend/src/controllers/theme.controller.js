let currentTheme = 'dark';
const clients = new Set();

export const getTheme = async (req, res) => {
  res.json({ success: true, data: { theme: currentTheme } });
};

export const updateTheme = async (req, res) => {
  const { theme } = req.body;
  if (theme !== 'light' && theme !== 'dark') {
    return res.status(400).json({ success: false, message: 'Invalid theme.' });
  }

  currentTheme = theme;

  for (const client of clients) {
    client.write(`event: themeChanged\n`);
    client.write(`data: ${JSON.stringify({ theme: currentTheme })}\n\n`);
  }

  res.json({ success: true, data: { theme: currentTheme } });
};

export const themeStream = async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  res.write(`event: themeChanged\n`);
  res.write(`data: ${JSON.stringify({ theme: currentTheme })}\n\n`);

  clients.add(res);

  req.on('close', () => {
    clients.delete(res);
  });
};
