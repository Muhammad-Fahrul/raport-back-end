import mongoose from 'mongoose';
import { UserCollectionHelper } from './testUtils';
import supertest from 'supertest';
import app from '../application/web';

describe('POST /api/users', function () {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST);
  });

  afterEach(async () => {
    await UserCollectionHelper.deleteUser();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should response 400 when request payload not contain needed property', async () => {
    const result = await supertest(app).post('/api/users').send({
      username: '',
    });

    expect(result.status).toBe(400);
    expect(result.body.message).toBeDefined();
  });

  it('should response 400 when username unavailable', async () => {
    await UserCollectionHelper.addUser({
      username: 'test12345',
      password: 'test12345',
    });

    const result = await supertest(app).post('/api/users').send({
      username: 'test12345',
      password: 'test12345',
    });

    expect(result.status).toBe(400);
    expect(result.body.message).toBe('User already exists');
  });

  it('should response 201 and return message', async () => {
    const result = await supertest(app).post('/api/users').send({
      username: 'test12345',
      password: 'test12345',
    });

    expect(result.status).toBe(201);
    expect(result.body.message).toBe('New user test12345 created');
  });
});

describe('GET /api/users', function () {
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

  it('should response 401 if accessToken is invalid', async () => {
    const result = await supertest(app)
      .get('/api/users/test12345')
      .set('authorization', 'salah');

    expect(result.status).toBe(401);
  });

  it('should response 400 if user is not found', async () => {
    const accessToken = await UserCollectionHelper.getAccessToken();
    const result = await supertest(app)
      .get('/api/users/wronguser')
      .set('authorization', `Bearer ${accessToken}`);

    expect(result.status).toBe(400);
  });

  it('should response 200 and return user object', async () => {
    const accessToken = await UserCollectionHelper.getAccessToken();
    const result = await supertest(app)
      .get('/api/users/test12345')
      .set('authorization', `Bearer ${accessToken}`);

    expect(result.status).toBe(200);
  });
});

describe('UPLOAD /api/users', function () {
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
    await mongoose.connection.close();
  });

  it('should response 400 when request payload not contain needed property', async () => {
    const accessToken = await UserCollectionHelper.getAccessToken();

    const result = await supertest(app)
      .put('/api/users')
      .set('authorization', `Bearer ${accessToken}`)
      .send({
        phone: 123,
      });

    expect(result.status).toBe(400);
  });

  // it('should response 400 if user is not found', async () => {
  //   const accessToken = await UserCollectionHelper.getAccessToken();
  //   const result = await supertest(app)
  //     .get('/api/users/wronguser')
  //     .set('authorization', `Bearer ${accessToken}`);

  //   expect(result.status).toBe(400);
  // });

  // it('should response 200 and return user object', async () => {
  //   const accessToken = await UserCollectionHelper.getAccessToken();
  //   const result = await supertest(app)
  //     .get('/api/users/test12345')
  //     .set('authorization', `Bearer ${accessToken}`);

  //   expect(result.status).toBe(200);
  // });
});
