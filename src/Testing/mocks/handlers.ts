---FILEPATH src/Testing/mocks/handlers.ts
---FIND
```
```
---REPLACE
```
import { rest } from 'msw';

export const handlers = [
  rest.post('/api/register', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ message: 'User registered successfully' }));
  }),
  rest.post('/api/login', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ message: 'User logged in successfully' }));
  }),
  rest.get('/api/templates', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([{ id: '1', name: 'Template 1' }]));
  }),
];
```
---COMPLETE