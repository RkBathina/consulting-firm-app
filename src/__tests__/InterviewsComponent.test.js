import React from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  cleanup,
} from "@testing-library/react";
import InterviewsComponent from "../components/consultingfirm/interviews/InterviewsComponent";
import {
  retrieveAllInterviewsApi,
  deleteInterviewsApi,
  createInterviewsApi,
  updateInterviewApi,
} from "../components/consultingfirm/api/UserDetailsApiService";

// Mock data for API
const mockInterviews = [
  {
    id: 1,
    recruiterName: "Kittu Bathina",
    round: "1st",
    interviewDate: "2024-10-15",
    interviewTime: "10:00 AM",
    consultantName: "Bathina Kittu",
    ownSupport: "Yes",
    technology: "React",
    clientType: "Internal",
    clientName: "Client A",
    location: "Remote",
    rate: "$100/hr",
    vendor: "Vendor X",
    feedback: "Good",
    comments: "N/A",
  },
];

// Mock API call
jest.mock("../components/consultingfirm/api/UserDetailsApiService", () => ({
  retrieveAllInterviewsApi: jest.fn(async () => ({ data: mockInterviews })),
  deleteInterviewsApi: jest.fn(async (id) => Promise.resolve()),
  createInterviewsApi: jest.fn(async (data) => ({
    data: { ...data, id: 2 }, // mock response with new interview ID
  })),
  updateInterviewApi: jest.fn(async (id, data) => Promise.resolve()),
}));

describe("InterviewsComponent Combined Tests", () => {
  // Clear mocks and render component before each test
  beforeEach(() => {
    jest.clearAllMocks();
    window.confirm = jest.fn();
  });

  afterEach(() => {
    cleanup();
  });

  test("renders table headers, data", async () => {
    render(<InterviewsComponent />);

    // Ensure API is called once
    await waitFor(() => {
      expect(retrieveAllInterviewsApi).toHaveBeenCalledTimes(1);
    });

    // Verify table headers
    const headers = [
      "Id",
      "Recruiter Name",
      "Round",
      "Interview Date",
      "Time",
      "Consultant Name",
      "Own Support",
      "Technology",
      "Client Type",
      "Client Name",
      "Location",
      "Rate",
      "Vendor",
      "Feedback",
      "Comments",
      "Actions",
    ];

    headers.forEach((header) => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });

    // Verify table data
    expect(screen.getByText("Kittu Bathina")).toBeInTheDocument();
    expect(screen.getByText("1st")).toBeInTheDocument();
    expect(screen.getByText("2024-10-15")).toBeInTheDocument();
    expect(screen.getByText("10:00 AM")).toBeInTheDocument();
    expect(screen.getByText("Bathina Kittu")).toBeInTheDocument();
    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Internal")).toBeInTheDocument();
    expect(screen.getByText("Client A")).toBeInTheDocument();
    expect(screen.getByText("Remote")).toBeInTheDocument();
    expect(screen.getByText("$100/hr")).toBeInTheDocument();
    expect(screen.getByText("Vendor X")).toBeInTheDocument();
    expect(screen.getByText("Good")).toBeInTheDocument();
    expect(screen.getByText("N/A")).toBeInTheDocument();

    // // Target update and delete icons usi
    // const editIcon = screen.getByTestId("edit-icon");
    // //const deleteIcon = screen.getByTestId("delete-icon");

    // // Simulate clicking the update icon (edit action)
    // fireEvent.click(editIcon);
  });

  test("delete functionality when user confirms", async () => {
    render(<InterviewsComponent />);

    // Ensure API is called once
    await waitFor(() => {
      expect(retrieveAllInterviewsApi).toHaveBeenCalledTimes(1);
    });

    //  delete icon click
    const deleteIcon = screen.getByTestId("delete-icon");

    // Mock confirm as true
    window.confirm.mockReturnValueOnce(true);

    fireEvent.click(deleteIcon);

    // Ensure confirmation dialog is shown
    expect(window.confirm).toHaveBeenCalledWith(
      "Are you sure you want to delete?"
    );

    // Ensure the delete API is called with the correct id
    await waitFor(() => {
      expect(deleteInterviewsApi).toHaveBeenCalledWith(1);
    });

    // Check that the interview is no longer displayed after deletion
    await waitFor(() => {
      expect(screen.queryByText("Kittu Bathina")).not.toBeInTheDocument();
    });
  });

  test("delete functionality when user cancels", async () => {
    render(<InterviewsComponent />);

    // Ensure API is called once
    await waitFor(() => {
      expect(retrieveAllInterviewsApi).toHaveBeenCalledTimes(1);
    });

    //  delete icon click
    const deleteIcon = screen.getByTestId("delete-icon");

    // Mock confirm as false
    window.confirm.mockReturnValueOnce(false);

    fireEvent.click(deleteIcon);

    // Ensure confirmation dialog is shown
    expect(window.confirm).toHaveBeenCalledWith(
      "Are you sure you want to delete?"
    );

    // Ensure the delete API is NOT called
    expect(deleteInterviewsApi).not.toHaveBeenCalled();

    // Ensure the interview is still displayed
    expect(screen.getByText("Kittu Bathina")).toBeInTheDocument();
  });

  test("Add new interview", async () => {
    render(<InterviewsComponent />);
    await waitFor(() => {
      expect(screen.getByText(/Add New Interview/i)).toBeInTheDocument();
    });

    const addButton = screen.getByText("Add New Interview");
    fireEvent.click(addButton);

    expect(screen.getByLabelText("Recruiter Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Round")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Recruiter Name"), {
      target: { value: "Krishna Kittu" },
    });
    fireEvent.change(screen.getByLabelText("Round"), {
      target: { value: "2nd" },
    });

    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(createInterviewsApi).toHaveBeenCalledWith({
        recruiterName: "Krishna Kittu",
        round: "2nd",
        interviewDate: "",
        interviewTime: "",
        consultantName: "",
        ownSupport: "",
        technology: "",
        clientType: "",
        clientName: "",
        location: "",
        rate: "",
        vendor: "",
        feedback: "",
        comments: "",
      });
    });
  });

  test("Edit interview", async () => {
    // Mock data for an existing interview
    render(<InterviewsComponent />);
    await waitFor(() =>
      expect(screen.queryByRole("status")).not.toBeInTheDocument()
    );

    const editIcon = screen.getByTestId("edit-icon");
    fireEvent.click(editIcon);

    expect(screen.getByDisplayValue("Kittu Bathina")).toBeInTheDocument();
    expect(screen.getByDisplayValue("1st")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Recruiter Name"), {
      target: { value: "Updated Recruiter" },
    });
    fireEvent.change(screen.getByLabelText("Round"), {
      target: { value: "3rd" },
    });

    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(updateInterviewApi).toHaveBeenCalledWith(1, {
        recruiterName: "Updated Recruiter",
        round: "3rd",
        interviewDate: "2024-10-15",
        interviewTime: "10:00 AM",
        consultantName: "Bathina Kittu",
        ownSupport: "Yes",
        technology: "React",
        clientType: "Internal",
        clientName: "Client A",
        location: "Remote",
        rate: "$100/hr",
        vendor: "Vendor X",
        feedback: "Good",
        comments: "N/A",
      });
    });
  });

  test("Add interview button and search interview functionality", async () => {
    render(<InterviewsComponent />);

    //Wait for the spinner to disappear
    await waitFor(() => {
      expect(screen.getByText(/Add New Interview/i)).toBeInTheDocument();
    });

    // Simulate adding a new interview
    const addButton = screen.getByText("Add New Interview");
    fireEvent.click(addButton);

    // Simulate search functionality
    const searchInput = screen.getByPlaceholderText("Search Interviews");
    fireEvent.change(searchInput, { target: { value: "Kittu Bathina" } });
    expect(searchInput.value).toBe("Kittu Bathina");

    // Check that the table now filters/interacts correctly with the search input
    await waitFor(() => {
      expect(screen.getByText("Kittu Bathina")).toBeInTheDocument();
    });
  });
});
