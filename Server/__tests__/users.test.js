
import request from 'supertest';
import mongoose from 'mongoose';
import { jest } from '@jest/globals';
import app from '../index.js'; 
import User from '../models/user.js';

// 1. Give the download/startup more time (30 seconds)
jest.setTimeout(30000);

beforeAll(async () => {
  await mongoose.disconnect();
  await mongoose.connect(process.env.DATABASE_URL);
  await mongoose.connection.db.dropDatabase();
});

afterEach(async () => {
  // Only try to delete if we are connected
  if (mongoose.connection.readyState === 1) {
    await User.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('User Authentication API (/api/users)', () => {
  const validUser = {
    name: 'Test User',
    email: 'test@servio.com',
    password: 'Password123!',
    phone: '5551234567'
  };

  it('1.1 Registration Success - Returns 201 and JWT Token', async () => {
    const res = await request(app).post('/api/users/register').send(validUser);
    expect(res.statusCode).toEqual(201);
    expect(res.headers['x-auth-token']).toBeDefined();
    // Check if body.data.email or body.email depending on your controller structure
    const email = res.body.data ? res.body.data.email : res.body.email;
    expect(email).toEqual(validUser.email);
  });

  it('1.2 Registration Failure - Rejects duplicate email', async () => {
    await request(app).post('/api/users/register').send(validUser);
    const splitRes = await request(app).post('/api/users/register').send(validUser);
    expect(splitRes.statusCode).toEqual(400);
  });

  it('1.3 Login Success - Returns JWT', async () => {
    await request(app).post('/api/users/register').send(validUser);
    const res = await request(app).post('/api/users/login').send({
      email: validUser.email,
      password: validUser.password
    });
    expect(res.statusCode).toEqual(201);
    const token = res.headers['x-auth-token'];
    expect(token).toBeDefined();
  });

  it('1.4 Login Failure - Rejects bad password', async () => {
    await request(app).post('/api/users/register').send(validUser);
    const res = await request(app).post('/api/users/login').send({
        email: validUser.email,
        password: 'wrongpassword'
    });
    expect(res.statusCode).toEqual(404);
  });
});