import '@testing-library/jest-dom';
import '@testing-library/jest-dom';
jest.mock('./hooks/use-http.ts', () => require('./utilities/test-use-http.tsx'));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));
