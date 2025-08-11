import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE = __ENV.BASE || 'http://service1:8000';

export const options = {
  vus: 10,
  duration: '45s',
  thresholds: {
    http_req_failed: ['rate<0.03'],    // <3% errors
    http_req_duration: ['p(95)<1200'], // p95 < 1.2s
  },
};

export default function () {
  const r = http.get(`${BASE}/chain`);
  check(r, { 'chain 200': (res) => res.status === 200 });
  sleep(0.2);
}

