import React from "react";
import { render } from "@testing-library/react";
import App from "../App";
import ConsultingFirmApp from "../components/consultingfirm/ConsultingFirmApp";

jest.mock("../components/consultingfirm/ConsultingFirmApp"); // Mock the ConsultingFirmApp component

test("renders ConsultingFirmApp", () => {
  render(<App />); // Render the App component

  expect(ConsultingFirmApp).toHaveBeenCalled(); // Assert that the ConsultingFirmApp component was called/rendered
});

// test("renders manage interviews link", async () => {
//   render(<App />);
//   //const linkElement = screen.getByText(/learn react/i);
//   //const linkElement = screen.getByText(/Manage Interviews - Go here/i);
//   const linkElement = await screen.findByText(/Manage Interviews - Go here/i);
//   expect(linkElement).toBeInTheDocument();
// });
