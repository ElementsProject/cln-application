import { act, render, screen } from '@testing-library/react';
import App from './App';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { cleanup } from "@testing-library/react";

afterEach(cleanup);

describe('App component ', () => {
  beforeEach(() => render(<App />));

  it('should be in the document', () => {
    expect(screen.getByTestId('container')).not.toBeEmptyDOMElement();
  });
});
