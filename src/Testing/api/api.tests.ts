import React from 'react';
jest.mock('../../api', () => ({
  register: jest.fn(),
  login: jest.fn(),
}));
  import { setupServer } from 'msw/node';
  import { rest } from 'msw';
  import '@testing-library/jest-dom';
  import { act } from '@testing-library/react';
  
  interface RegisterResponse {
  success: boolean;
  }

  interface LoginResponse {
  success: boolean;
  user: { username: string };
  }

  interface Template {
  id: string;
  name: string;
  }

  interface CreateTemplateResponse {
  success: boolean;
  template: Template;
  }

  interface AssignTemplateResponse {
  success: boolean;
  assignment: { id: string };
  }

  interface Assignment {
  id: string;
  templateId: string;
  }

  interface CheckSessionResponse {
  success: boolean;
  user: { username: string };
  }

  const server = setupServer(
  rest.post<RegisterResponse>('http://localhost:3000/api/register', (_req, res, ctx) => {
    return res(ctx.json({ success: true }));
  }),
  rest.post<LoginResponse>('http://localhost:3000/api/login', (req, res, ctx) => {
    return res(ctx.json({ success: true, user: { username: 'testuser' } }));
  }),
  rest.post<CreateTemplateResponse>('http://localhost:3000/api/templates', (req, res, ctx) => {
    return res(ctx.json({ success: true, template: { id: '1', name: 'Test Template' } }));
  }),
  rest.get<Template[]>('http://localhost:3000/api/templates', (req, res, ctx) => {
    return res(ctx.json([{ id: '1', name: 'Test Template' }]));
  }),
  rest.post<AssignTemplateResponse>('http://localhost:3000/api/assignments', (req, res, ctx) => {
    return res(ctx.json({ success: true, assignment: { id: '1' } }));
  }),
  rest.get<Assignment[]>('http://localhost:3000/api/assignments', (req, res, ctx) => {
    return res(ctx.json([{ id: '1', templateId: '1' }]));
  }),
  rest.get<CheckSessionResponse>('http://localhost:3000/api/session', (req, res, ctx) => {
    return res(ctx.json({ success: true, user: { username: 'testuser' } }));
  })
  );
  
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
  
  describe('API Functions', () => {
  test('register should make a POST request', async () => {
    await act(async () => {
    const result = await register('testuser', 'password');
    expect(result.success).toBe(true);
    });
  });
  
  test('login should make a POST request', async () => {
    await act(async () => {
    const result = await login('testuser', 'password');
    expect(result.success).toBe(true);
    expect(result.user.username).toBe('testuser');
    });
  });
  
  test('createTemplate should make a POST request', async () => {
    await act(async () => {
    const result = await createTemplate({ name: 'Test', tasks: [] });
    expect(result.success).toBe(true);
    expect(result.template.name).toBe('Test Template');
    });
  });
  
  test('getTemplates should make a GET request', async () => {
    await act(async () => {
    const result = await getTemplates();
    expect(Array.isArray(result)).toBe(true);
    expect(result[0].name).toBe('Test Template');
    });
  });
  
  test('assignTemplate should make a POST request', async () => {
    await act(async () => {
    const result = await assignTemplate({ templateId: '1', startDate: '2023-01-01', hoursPerWeek: 10 });
    expect(result.success).toBe(true);
    expect(result.assignment.id).toBe('1');
    });
  });
  
  test('getAssignments should make a GET request', async () => {
    await act(async () => {
    const result = await getAssignments();
    expect(Array.isArray(result)).toBe(true);
    expect(result[0].templateId).toBe('1');
    });
  });
  
  test('checkSession should make a GET request', async () => {
    await act(async () => {
    const result = await checkSession();
    expect(result.success).toBe(true);
    expect(result.user.username).toBe('testuser');
    });
  });
  });