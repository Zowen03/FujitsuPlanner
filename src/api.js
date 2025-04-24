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
  try {
    const response = await fetch('/api/session', {
      credentials: 'include'
    });
    
    if (!response.ok) {
      return { success: false, error: 'Session check failed' };
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return { success: false, error: 'Invalid response format' };
    }
    
    return await response.json();
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
};

export const assignTemplate = async (data) => {
  try {
      const response = await fetch('http://localhost:3000/api/assignments', { // Full URL to backend
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          credentials: 'include' // Important for sessions
      });
      
      if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
      }
      
      return await response.json();
  } catch (error) {
      console.error('Failed to assign template:', error);
      return { success: false, error: error.message };
  }
};

export const getAssignments = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/assignments', { // Add full URL
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return [];
  }
};
