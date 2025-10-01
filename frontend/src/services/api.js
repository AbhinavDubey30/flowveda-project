
import axios from 'axios';
const API_BASE = process.env.REACT_APP_API_BASE || 'https://flowveda-project-production.up.railway.app/api';

export function setAuthToken(token){
  if(token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete axios.defaults.headers.common['Authorization'];
}

export async function register(data){
  const res = await axios.post(API_BASE + '/auth/register', data);
  return res.data;
}
export async function login(data){
  const res = await axios.post(API_BASE + '/auth/login', data);
  return res.data;
}
export async function getReadings(){
  const res = await axios.get(API_BASE + '/devices/readings/latest');
  return res.data;
}
export async function getDevices(){
  const res = await axios.get(API_BASE + '/devices');
  return res.data;
}
export async function getForecast(){
  const res = await axios.get(API_BASE + '/forecast');
  return res.data;
}
export async function getAnomalies(){
  const res = await axios.get(API_BASE + '/anomalies');
  return res.data;
}
export async function getBills(){
  const res = await axios.get(API_BASE + '/bills');
  return res.data;
}
export async function subscribe(plan='premium'){
  const res = await axios.post(API_BASE + '/subscribe', {plan});
  return res.data;
}
export async function payBill(id){
  const res = await axios.post(API_BASE + `/bills/${id}/pay/`);
  return res.data;
}
export async function addDevice(data){
  const res = await axios.post(API_BASE + '/devices', data);
  return res.data;
}

// Telemetry API functions
export async function getSchema(){
  const res = await axios.get(API_BASE + '/telemetry/schema');
  return res.data;
}

export async function getTelemetry(parameter, options = {}){
  const { limit = 200 } = options;
  const params = new URLSearchParams({
    parameter,
    limit: limit.toString()
  });
  const res = await axios.get(API_BASE + '/telemetry/?' + params);
  return res.data;
}

export async function getLatest() {
  const res = await axios.get(API_BASE + '/telemetry/latest');
  return res.data;
}

export async function getSeries(parameter, limit = 200){
  const params = new URLSearchParams({
    parameter,
    limit: limit.toString()
  });
  const res = await axios.get(API_BASE + '/telemetry/series?' + params);
  return res.data;
}
