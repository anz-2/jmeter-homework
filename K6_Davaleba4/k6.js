import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';

let responseTime = new Trend('response_time');
export const options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<400','p(99)<800',],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const randomPostId = Math.floor(Math.random() * 10) + 1;
  const res = http.get(`https://jsonplaceholder.typicode.com/posts/${randomPostId}/comments`);
  
  console.log(`Post ID: ${randomPostId} | Status: ${res.status} | Time: ${res.timings.duration.toFixed(2)} ms`);
  
  responseTime.add(res.timings.duration);

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

}
