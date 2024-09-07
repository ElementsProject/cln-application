import { act, render, screen } from '@testing-library/react';
import App, { rootRouteConfig } from './App';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { cleanup } from "@testing-library/react";

afterEach(cleanup);

describe('App component ', () => {
  beforeEach(() => render(<App />));

  it('should be in the document', () => {
    expect(screen.getByTestId('container')).not.toBeEmptyDOMElement();
  });
});

describe('Root routing', () => {
  const setUp = (async () => {
    const router = createMemoryRouter(rootRouteConfig, { initialEntries: ['/'] });
    render(<RouterProvider router={router} />);
    return router;
  });

  it('redirects from / to /home', async () => {
    let router = await setUp();
    expect(router.state?.location?.pathname).toBe("/home");
  });

  it('going to bookkeeper hides the cln view, preserves header', async () => {
    let router = await setUp();
    expect(screen.getByTestId('header')).not.toBeEmptyDOMElement();
    expect(screen.queryByTestId('cln-container')).toBeInTheDocument();
    expect(screen.queryByTestId('bookkeeper-container')).not.toBeInTheDocument();
    await act(async () => { router.navigate("/bookkeeper"); });
    expect(router.state?.location?.pathname).toBe("/bookkeeper");
    expect(screen.getByTestId('header')).not.toBeEmptyDOMElement();
    expect(screen.queryByTestId('cln-container')).not.toBeInTheDocument();
    expect(screen.queryByTestId('bookkeeper-container')).toBeInTheDocument();
  })
});
