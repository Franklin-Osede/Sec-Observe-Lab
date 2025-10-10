// Test setup file
const redis = require('redis');

// Mock Redis for testing
jest.mock('redis', () => {
  const mockRedis = {
    connect: jest.fn(),
    quit: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
    setEx: jest.fn(),
    del: jest.fn(),
    on: jest.fn()
  };
  return {
    createClient: jest.fn(() => mockRedis)
  };
});

// Mock other dependencies
jest.mock('qrcode', () => ({
  toDataURL: jest.fn().mockResolvedValue('data:image/png;base64,test')
}));

// Global test timeout
jest.setTimeout(10000);

// Cleanup after each test
afterEach(() => {
  jest.clearAllMocks();
});