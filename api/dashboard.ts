const BACKEND_URL = process.env.BACKEND_DASHBOARD_URL || 'http://core.clymind.ch:8084';

export default async function handler(req: any, res: any) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/dashboard`);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch {
    res.status(502).json({ error: 'Backend unreachable' });
  }
}
