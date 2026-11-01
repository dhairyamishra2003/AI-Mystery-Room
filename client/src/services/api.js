import axios from 'axios';
const api = axios.create({ baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api` });
const tokenKey = id => `mystery-token:${id}`;
function auth(id) { const token = sessionStorage.getItem(tokenKey(id)); return { headers: { Authorization: `Bearer ${token}` } }; }
export const cases = { create: async body => { const { data } = await api.post('/cases', body); sessionStorage.setItem(tokenKey(data.data.caseId), data.data.accessToken); return data.data; }, get: id => api.get(`/cases/${id}`, auth(id)).then(r => r.data.data), discover: (id, clueId) => api.post(`/cases/${id}/clues/${clueId}/discover`, {}, auth(id)).then(r => r.data.data), hint: id => api.post(`/cases/${id}/hints`, {}, auth(id)).then(r => r.data.data), accuse: (id, suspectId) => api.post(`/cases/${id}/accuse`, { suspectId }, auth(id)).then(r => r.data.data), result: id => api.get(`/cases/${id}/result`, auth(id)).then(r => r.data.data) };
export function errorText(error) { return error.response?.data?.message || 'We could not reach the investigation service. Please try again.'; }
