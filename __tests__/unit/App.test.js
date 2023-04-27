import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter, MemoryRouter } from "react-router-dom";

import App from "../../src/App";
import store from "../../src/configure/store";

describe("App component rendering", () => {
  it("App component renders normally", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );
  });
});

describe("Routing", () => {
  it("landing on a bad page", () => {
    const badRoute = "/some/bad/route";

    render(
      <MemoryRouter initialEntries={[badRoute]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/invalid url/i)).toBeInTheDocument();
  });

  it("landing on home page", () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/climick/i)).toBeInTheDocument();
  });

  it("landing on instruction page", () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/instruction"]}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/instruction/i)).toBeInTheDocument();
  });
});
