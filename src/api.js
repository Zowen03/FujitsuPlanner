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
  console.log('Login payload:', { username, password }); // Debugging
  const response = await fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
    credentials: 'include' // Ensure credentials are included for session
  });
  return await response.json();
};

  export const createTemplate = async (templateData) => {
    const response = await fetch('http://localhost:3000/api/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(templateData),
      credentials: 'include', // Include credentials for session
    });
    return await response.json();
  };


  export const getTemplates = async (search = '') => {
    try {
        const response = await fetch(`http://localhost:3000/api/templates?search=${encodeURIComponent(search)}`, {
            method: 'GET',
            credentials: 'include', // Include credentials for session
        });

        if (!response.ok) {
            throw new Error(`Error fetching templates: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error in getTemplates:', error);
        throw error;
    }
};

export const getTemplateById = async (id) => {
  const response = await fetch(`http://localhost:3000/api/templates/${id}`);
  return await response.json();
};

export const checkSession = async () => {
  const response = await fetch('http://localhost:3000/api/session', {
      method: 'GET',
      credentials: 'include', // Include credentials for session
  });

  if (response.ok) {
      const data = await response.json();
      return data.user;
  } else {
      return null;
  }
};

