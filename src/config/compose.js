import axios from 'axios';

const API_URL = 'http://192.168.1.100/ci/public/api';

export const sendRequest = async (url, method, data) => {
  let body = {};

  const token = localStorage.getItem('access_token');
  if (token) {
    if (method === 'GET') body.access_token = `Bearer ${token}`;
    else data.access_token = `Bearer ${token}`;
  }
  let request = {
    url: `${API_URL}/${url}`,
    method,
  };
  if (method === 'GET') {
    request.params = data;
    request.data = JSON.stringify(body);
  } else {
    request.data = JSON.stringify(data);
  }

  try {
    const response = await axios(request);

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      throw response.data;
    }
  } catch (error) {
    throw error?.response?.data;
  }
};
