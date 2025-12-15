import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
    stages: [
        { duration: '30s', target: 20 }, // Rope up to 20 users
        { duration: '1m', target: 20 },  // Stay at 20 users
        { duration: '30s', target: 0 },  // Scale down
    ],
};

const BASE_URL = 'http://localhost:3000';

export default function () {
    // 1. Visit Dashboard (Simulate read)
    const res = http.get(`${BASE_URL}/dashboard`);
    check(res, { 'status was 200': (r) => r.status == 200 });

    sleep(1);
}
