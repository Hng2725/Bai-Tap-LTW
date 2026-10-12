import '@testing-library/jest-dom';

if (typeof global.fetch === 'undefined') {
  global.fetch = jest.fn();
}
