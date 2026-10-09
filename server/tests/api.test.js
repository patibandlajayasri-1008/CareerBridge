import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Backend Server API & Middleware Tests', () => {
  it('GET /api/v1/health returns 200 and operational status', async () => {
    const res = await request(app).get('/api/v1/health');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('operational');
    expect(res.body.data.service).toContain('CareerBridge');
    expect(res.body.data.uptimeSeconds).toBeGreaterThanOrEqual(0);
  });

  it('GET / returns 200 greeting and API documentation link', async () => {
    const res = await request(app).get('/');

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('CareerBridge Placement Platform API');
    expect(res.body.documentation).toBe('/api/v1/health');
  });

  it('returns 404 JSON for undefined routes', async () => {
    const res = await request(app).get('/api/v1/unregistered-path-xyz');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Route not found');
  });

  it('configures CORS headers for client requests', async () => {
    const res = await request(app)
      .get('/api/v1/health')
      .set('Origin', 'http://localhost:5173');

    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    expect(res.headers['access-control-allow-credentials']).toBe('true');
  });
});
