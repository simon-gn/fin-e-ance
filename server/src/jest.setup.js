const { connectTestDb, closeTestDb } = require('./utils/testDb');

beforeAll(async () => await connectTestDb());
afterAll(async () => await closeTestDb());
