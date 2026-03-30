const BACKEND_URL = process.env.BACKEND_DASHBOARD_URL || 'http://core.clymind.ch:8084';
const PROXY_SECRET = process.env.PROXY_SECRET || '';

export default async function handler(req: any, res: any) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/refreshAndGetDashboard`, {
      headers: { 'x-proxy-secret': PROXY_SECRET },
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch {
    res.status(502).json({ error: 'Backend unreachable' });
  }
}
