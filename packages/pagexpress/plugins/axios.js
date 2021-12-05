import axios from 'axios';

const { SERVER_APP_URL, API_BASE_PATH } = process.env;

export default axios.create({
  baseURL: `${SERVER_APP_URL}${API_BASE_PATH}`,
  timeout: 1000,
  headers: { 'Content-Type': 'application/json' },
});
