const { connectTestDb, closeTestDb } = require('../src/utils/testDb');

beforeAll(async () => await connectTestDb());
afterAll(async () => await closeTestDb());
