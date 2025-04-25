interface RegisterPayload {
  username: string;
  password: string;
}

interface RegisterResponse {
  success: boolean;
  token?: string;
  error?: string;
}

export const register = async (username: string, password: string): Promise<RegisterResponse> => {
  const response = await fetch('http://localhost:3000/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password } as RegisterPayload),
    credentials: 'include'
  });
  return await response.json() as RegisterResponse;
};
  
interface LoginPayload {
  username: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  token?: string;
  error?: string;
}

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  console.log('Login payload:', { username, password }); // Debugging
  const response = await fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password } as LoginPayload),
    credentials: 'include' // Ensure credentials are included for session
  });
  return await response.json() as LoginResponse;
};

interface TemplateData {
  name: string;
  description?: string;
  [key: string]: unknown; // Allow additional properties with explicit type checking
}

interface CreateTemplateResponse {
  success: boolean;
  templateId?: string;
  error?: string;
}

export const createTemplate = async (templateData: TemplateData): Promise<CreateTemplateResponse> => {
  const response = await fetch('http://localhost:3000/api/templates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(templateData),
    credentials: 'include', // Include credentials for session
  });
  return await response.json() as CreateTemplateResponse;
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

interface TemplateDetailsResponse {
  success: boolean;
  template?: {
    id: string;
    name: string;
    description?: string;
    [key: string]: unknown; // Allow additional properties
  };
  error?: string;
}

export const getTemplateById = async (id: string): Promise<TemplateDetailsResponse> => {
  const response = await fetch(`http://localhost:3000/api/templates/${id}`);
  return await response.json() as TemplateDetailsResponse;
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
  } catch {
    return { success: false, error: 'Network error' };
  }
};

interface AssignTemplateData {
  templateId: string;
  userId: string;
  [key: string]: unknown; // Allow additional properties
}

interface AssignTemplateResponse {
  success: boolean;
  error?: string;
}

export const assignTemplate = async (data: AssignTemplateData): Promise<AssignTemplateResponse> => {
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
      
      return await response.json() as AssignTemplateResponse;
  } catch {
      console.error('Failed to assign template');
      return { success: false, error: 'An error occurred' };
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
