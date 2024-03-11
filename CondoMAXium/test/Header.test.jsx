import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "../Reusables/Header";
import "@testing-library/jest-dom";

test("renders Header component", () => {
  render(<Header />);

  // Check if the CondoMAXium text is present
  const logoText = screen.getByText(/CondoMAXium/i);
  expect(logoText).toBeInTheDocument();

  // Check if the Menu button is present
  const menuButton = screen.getByLabelText(/menu/i);
  expect(menuButton).toBeInTheDocument();

  // Check if the user avatar is present
  const userAvatar = screen.getByAltText(/X/);
  expect(userAvatar).toBeInTheDocument();
});

test("opens and closes navigation menu on menu button click", () => {
  render(<Header />);

  // Check if the navigation menu is initially closed
  const navMenu = screen.queryByRole("menu", { name: /Navigation Menu/i });
  expect(navMenu).not.toBeInTheDocument();

  // Click on the menu button to open the navigation menu
  const menuButton = screen.getByLabelText(/menu/i);
  fireEvent.click(menuButton);

  // Check if the navigation menu is now open
  const openedNavMenu = screen.getByRole("menu", { name: /Navigation Menu/i });
  expect(openedNavMenu).toBeInTheDocument();

  // Click on the menu button again to close the navigation menu
  fireEvent.click(menuButton);

  // Check if the navigation menu is closed again
  const closedNavMenu = screen.queryByRole("menu", {
    name: /Navigation Menu/i,
  });
  expect(closedNavMenu).not.toBeInTheDocument();
});

test("opens and closes user menu on user avatar click", () => {
  render(<Header />);

  // Check if the user menu is initially closed
  const userMenu = screen.queryByRole("menu", { name: /User Menu/i });
  expect(userMenu).not.toBeInTheDocument();

  // Click on the user avatar to open the user menu
  const userAvatar = screen.getByRole("img", { name: /Open settings/i });
  fireEvent.click(userAvatar);

  // Check if the user menu is now open
  const openedUserMenu = screen.getByRole("menu", { name: /User Menu/i });
  expect(openedUserMenu).toBeInTheDocument();

  // Click on the user avatar again to close the user menu
  fireEvent.click(userAvatar);

  // Check if the user menu is closed again
  const closedUserMenu = screen.queryByRole("menu", { name: /User Menu/i });
  expect(closedUserMenu).not.toBeInTheDocument();
});
