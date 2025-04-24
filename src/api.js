export const register = async (username, password) => {
  const response = await fetch('http://localhost:3000/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
    credentials: 'include'
  });
  return await response.json();
};
  
  export const login = async (username, password) => {
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return await response.json();
  };

export const createTemplate = async (templateData) => {
  const response = await fetch('http://localhost:3000/api/templates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(templateData)
  });
  return await response.json();
};

export const getTemplates = async () => {
  const response = await fetch('http://localhost:3000/api/templates');
  return await response.json();
};