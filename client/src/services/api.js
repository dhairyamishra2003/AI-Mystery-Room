import axios from 'axios';

const envApiUrl = import.meta.env.VITE_API_URL;
const defaultBase = import.meta.env.PROD
  ? 'https://ai-mystery-room-xgb8.onrender.com'
  : 'http://localhost:5001';

const rawBase = (envApiUrl && envApiUrl.trim()) || defaultBase;
const cleanBase = rawBase.replace(/\/+$/, '');
const baseURL = cleanBase.endsWith('/api') ? cleanBase : `${cleanBase}/api`;

const api = axios.create({
  baseURL,
  timeout: 60000
});

const tokenKey = id => `mystery-token:${id}`;
function auth(id) {
  const token = sessionStorage.getItem(tokenKey(id));
  return { headers: { Authorization: `Bearer ${token}` } };
}

export const cases = {
  create: async body => {
    const { data } = await api.post('/cases', body);
    sessionStorage.setItem(tokenKey(data.data.caseId), data.data.accessToken);
    return data.data;
  },
  get: id => api.get(`/cases/${id}`, auth(id)).then(r => r.data.data),
  discover: (id, clueId) => api.post(`/cases/${id}/clues/${clueId}/discover`, {}, auth(id)).then(r => r.data.data),
  hint: id => api.post(`/cases/${id}/hints`, {}, auth(id)).then(r => r.data.data),
  accuse: (id, suspectId) => api.post(`/cases/${id}/accuse`, { suspectId }, auth(id)).then(r => r.data.data),
  result: id => api.get(`/cases/${id}/result`, auth(id)).then(r => r.data.data)
};

export function errorText(error) {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.response?.status) {
    const status = error.response.status;
    if (status === 429) {
      return 'Investigation rate limit exceeded. Please wait a moment before trying again.';
    }
    if (status === 504 || error.code === 'ECONNABORTED') {
      return 'The mystery generation service took too long to respond. Please try again.';
    }
    if (status === 503) {
      return 'The mystery investigation service is currently unavailable. Please try again shortly.';
    }
    return `Server error (${status}): ${error.response.statusText || 'Investigation service failure'}. Please try again.`;
  }
  if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
    return `Unable to reach the investigation service at ${api.defaults.baseURL}. Please verify connection and CORS settings.`;
  }
  if (error.message) {
    return error.message;
  }
  return 'We could not reach the investigation service. Please try again.';
}
