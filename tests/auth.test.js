import mongoose from 'mongoose';
import { UserCollectionHelper } from './testUtils';
import supertest from 'supertest';
import app from '../application/web';

describe('POST /api/auth', function () {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST);
  });

  beforeEach(async () => {
    await UserCollectionHelper.addUser({
      username: 'test12345',
      password: 'test12345',
    });
  });

  afterEach(async () => {
    await UserCollectionHelper.deleteUser();
  });

  afterAll(async () => {
    await UserCollectionHelper.deleteUser();
    await mongoose.connection.close();
  });

  it('should response 400 if username is not correct', async () => {
    const response = await supertest(app).post('/api/auth').send({
      username: 'salah',
      password: 'test12345',
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid Username');
  });

  it('should response 400 if password is not correct', async () => {
    const response = await supertest(app).post('/api/auth').send({
      username: 'test12345',
      password: 'salah',
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid Password');
  });

  it('should response 200 and return new access token', async () => {
    const response = await supertest(app).post('/api/auth').send({
      username: 'test12345',
      password: 'test12345',
    });

    expect(response.status).toBe(201);
    expect(response.body.data.accessToken).toBeDefined();
  });
});
