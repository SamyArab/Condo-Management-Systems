import React from "react";
import { act, create } from "react-test-renderer";
import App from "../App";
import "@testing-library/jest-dom";

test("renders App component", () => {
  let root;

  act(() => {
    root = create(<App />);
  });

  expect(root.toJSON()).toMatchSnapshot();

  // You can add more assertions or interact with the component if needed
});
