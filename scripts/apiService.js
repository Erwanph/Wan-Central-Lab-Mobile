import axios from 'axios';

const BASE_URL = 'http://217.196.49.173:6560/api/v1';

const apiService = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function apiRequest(api, method, body = null, token = null) {
  try {
    let url = '';

    switch (api) {
      case 'login':
        url = '/auth/login/';
        break;
      case 'register':
        url = '/auth/register/';
        break;
      case 'getProfile':
        url = '/profile/';
        break;
      case 'updateProfile':
        url = '/profile/';
        break;
      case 'updateScore':
        url = '/profile/score';
        break;
      default:
        throw new Error('API not found');
    }

    const config = {
      method,
      url,
      data: body,
      headers: {},
    };

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await apiService(config);

    return response.data;
  } catch (error) {
    console.error('Error in API request:', error);
    throw error.response?.data || { message: 'Internal Server Error' };
  }
}
