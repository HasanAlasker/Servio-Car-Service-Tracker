import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index.js';
import User from '../models/user.js';
let jwtToken;

beforeAll(async () => {
  await mongoose.disconnect();
  await mongoose.connect(process.env.DATABASE_URL);
  await mongoose.connection.db.dropDatabase();

  // Register a user to get a token for authenticated routes
  const res = await request(app).post('/api/users/register').send({
    name: 'Appt Tester',
    email: 'appt@test.com',
    password: 'Password123!',
    phone: '5559876543'
  });

  jwtToken = res.headers['x-auth-token'];
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Appointments API (/api/appointments)', () => {
  // Note: Your router uses "/all", "/upcoming", etc. 
  // Make sure your test URLs match your express routes.

  it('should fail with 401 if no token is provided', async () => {
    const res = await request(app).get('/api/appointments/upcoming');
    expect(res.statusCode).toEqual(401);
  });

  it('should return an empty list of upcoming appointments for a new user', async () => {
    const res = await request(app)
      .get('/api/appointments/upcoming')
      .set('x-auth-token', jwtToken); 
      
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([]);
  });
});