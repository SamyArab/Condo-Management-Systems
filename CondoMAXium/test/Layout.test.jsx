import React from "react";
import { render, screen } from "@testing-library/react";
import Layout from "../Layout";
import "@testing-library/jest-dom";

// Mocking Header and Footer components for isolation
jest.mock("../Reusables/Header", () => () => (
  <div data-testid="mock-header">Header</div>
));
jest.mock("../Reusables/Footer", () => () => (
  <div data-testid="mock-footer">Footer</div>
));

test("renders Layout component with Header and Footer", () => {
  render(<Layout>Content</Layout>);

  // Check if the Header and Footer components are rendered
  const headerElement = screen.getByTestId("mock-header");
  const footerElement = screen.getByTestId("mock-footer");

  expect(headerElement).toBeInTheDocument();
  expect(footerElement).toBeInTheDocument();
});

test("renders children content inside the Layout component", () => {
  render(<Layout>Content</Layout>);

  // Check if the children content is rendered
  const contentElement = screen.getByText(/Content/i);
  expect(contentElement).toBeInTheDocument();
});
