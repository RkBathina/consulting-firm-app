import { useEffect, useState } from "react";
import {
  createInterviewsApi,
  retrieveAllInterviewsApi,
  updateInterviewApi,
  deleteInterviewsApi,
} from "../api/UserDetailsApiService";
import { Table, Form } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import { Modal, Button, Pagination, InputGroup } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";
import "bootstrap-icons/font/bootstrap-icons.css";

function InterviewsComponent() {
  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingInterview, setEditingInterview] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [interviewsPerPage] = useState(10);

  const matchesSearchTerm = (interviewFilter) => {
    return Object.values(interviewFilter).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getInterviews = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await retrieveAllInterviewsApi();
      const sortedInterviews = response.data.sort((a, b) => a.id - b.id);
      setInterviews(sortedInterviews);
    } catch (error) {
      setError("Failed to fetch interviews");
      console.error("Error Fetching interviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getInterviews();
  }, []);

  // Get current interviews
  const indexOfLastInterview = currentPage * interviewsPerPage;
  const indexOfFirstInterview = indexOfLastInterview - interviewsPerPage;
  const currentInterviews = interviews.slice(
    indexOfFirstInterview,
    indexOfLastInterview
  );

  const filteredInterviews = currentInterviews.filter((interviewFilter) =>
    matchesSearchTerm(interviewFilter)
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleEdit = (interview) => {
    setEditingInterview({ ...interview });
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setEditingInterview({
      id: "",
      recruiterName: "",
      round: "",
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
      dateCreated: "",
      lastUpdated: "",
    });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    const interviewData = {
      recruiterName: editingInterview.recruiterName || "",
      round: editingInterview.round || "",
      interviewDate: editingInterview.interviewDate || "",
      interviewTime: editingInterview.interviewTime || "",
      consultantName: editingInterview.consultantName || "",
      ownSupport: editingInterview.ownSupport || "",
      technology: editingInterview.technology || "",
      clientType: editingInterview.clientType || "",
      clientName: editingInterview.clientName || "",
      location: editingInterview.location || "",
      rate: editingInterview.rate || "",
      vendor: editingInterview.vendor || "",
      feedback: editingInterview.feedback || "",
      comments: editingInterview.comments || "",
    };

    try {
      if (editingInterview.id) {
        // Update existing interview
        await updateInterviewApi(editingInterview.id, interviewData);
        const updatedInterviews = interviews.map((interview) =>
          interview.id === editingInterview.id
            ? { ...interview, ...interviewData }
            : interview
        );
        setInterviews(updatedInterviews.sort((a, b) => a.id - b.id));
      } else {
        //add new interview
        const response = await createInterviewsApi(interviewData);
        setInterviews(
          [...interviews, response.data].sort((a, b) => a.id - b.id)
        );
      }
    } catch (error) {
      console.error(
        "Error saving interview:",
        error.response ? error.response.data : error.message
      );
    }
    setIsEditing(false);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");

    if (confirmDelete) {
      try {
        await deleteInterviewsApi(id);
        const updatedInterviews = interviews.filter(
          (interview) => interview.id !== id
        );
        setInterviews(updatedInterviews);
      } catch (error) {
        console.error("Error deleting interview:", error);
      }
    }
  };

  if (isLoading) return <Spinner animation="border" variant="primary" />;
  if (error) return <Spinner animation="grow" variant="danger" />;

  return (
    <div>
      <h1 className="interviewsh1">Interviews Details</h1>

      <Form.Group className="mb-3" style={{ textAlign: "right" }}>
        <div style={{ display: "inline-flex", alignItems: "center" }}>
          <Button
            variant="primary"
            onClick={handleAddNew}
            className="mb-3"
            style={{
              height: "38px",
              lineHeight: "1.5",
              marginTop: "22px",
            }}
          >
            Add New Interview
          </Button>
          <InputGroup style={{ width: "300px" }}>
            <InputGroup.Text
              style={{
                backgroundColor: "#fff",
                border: "1px solid black",
                borderRadius: "8px 0 0 8px",
                padding: "6px 10px",
                marginLeft: "10px",
              }}
            >
              <BsSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search Interviews"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: "1px solid black",
                borderRadius: "0 8px 8px 0",
                fontWeight: "bold",
                height: "38px",
              }}
            />
          </InputGroup>
        </div>
      </Form.Group>

      <Table striped bordered responsive="sm" size="sm">
        <thead>
          <tr>
            <th>Id</th>
            <th>Recruiter Name</th>
            <th>Round</th>
            <th>Interview Date</th>
            <th>Time</th>
            <th>Consultant Name</th>
            <th>Own Support</th>
            <th>Technology</th>
            <th>Client Type</th>
            <th>Client Name</th>
            <th>Location</th>
            <th>Rate</th>
            <th>Vendor</th>
            <th>Feedback</th>
            <th>Comments</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredInterviews.map((interview) => (
            <tr key={interview.id}>
              <td>{interview.id}</td>
              <td>{interview.recruiterName}</td>
              <td>{interview.round}</td>
              <td>{interview.interviewDate}</td>
              <td>{interview.interviewTime}</td>
              <td>{interview.consultantName}</td>
              <td>{interview.ownSupport}</td>
              <td>{interview.technology}</td>
              <td>{interview.clientType}</td>
              <td>{interview.clientName}</td>
              <td>{interview.location}</td>
              <td>{interview.rate}</td>
              <td>{interview.vendor}</td>
              <td>{interview.feedback}</td>
              <td>{interview.comments}</td>
              <td>
                <i
                  className="bi bi-pencil-square me-3 text-primary"
                  style={{ cursor: "pointer" }}
                  data-testid="edit-icon"
                  onClick={() => handleEdit(interview)}
                ></i>
                <i
                  className="bi bi-trash text-danger"
                  style={{ cursor: "pointer" }}
                  data-testid="delete-icon"
                  onClick={() => handleDelete(interview.id)}
                ></i>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination className="justify-content-center" size="sm">
        {[...Array(Math.ceil(interviews.length / interviewsPerPage))].map(
          (_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          )
        )}
      </Pagination>

      {isEditing && (
        <Modal show={isEditing} onHide={() => setIsEditing(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              {editingInterview && editingInterview.id
                ? "Edit Interview"
                : "Add New Interview"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              {/* Recruiter Name */}
              <div>
                <label id="recruiterName">Recruiter Name</label>
                <input
                  type="text"
                  aria-labelledby="recruiterName"
                  value={editingInterview ? editingInterview.recruiterName : ""}
                  onChange={(e) =>
                    setEditingInterview({
                      ...editingInterview,
                      recruiterName: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                {/* Round */}
                <label id="round">Round</label>
                <input
                  type="text"
                  aria-labelledby="round"
                  value={editingInterview ? editingInterview.round : ""}
                  onChange={(e) =>
                    setEditingInterview({
                      ...editingInterview,
                      round: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                {/* Interview Date */}
                <label id="interviewDate">Interview Date</label>
                <input
                  type="date"
                  aria-labelledby="interviewDate"
                  value={editingInterview ? editingInterview.interviewDate : ""}
                  onChange={(e) =>
                    setEditingInterview({
                      ...editingInterview,
                      interviewDate: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                {/* Interview Time */}
                <label id="interviewTime">Interview Time</label>
                <input
                  type="text"
                  aria-labelledby="interviewTime"
                  value={editingInterview ? editingInterview.interviewTime : ""}
                  onChange={(e) =>
                    setEditingInterview({
                      ...editingInterview,
                      interviewTime: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                {/* Consultant Name */}
                <label id="consultantName">Consultant Name</label>
                <input
                  type="text"
                  aria-labelledby="consultantName"
                  value={
                    editingInterview ? editingInterview.consultantName : ""
                  }
                  onChange={(e) =>
                    setEditingInterview({
                      ...editingInterview,
                      consultantName: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                {/* Own Support */}
                <label id="ownSupport">Own Support</label>
                <input
                  type="text"
                  aria-labelledby="ownSupport"
                  value={editingInterview ? editingInterview.ownSupport : ""}
                  onChange={(e) =>
                    setEditingInterview({
                      ...editingInterview,
                      ownSupport: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                {/* Technology */}
                <label id="technology">Technology</label>
                <input
                  type="text"
                  aria-labelledby="technology"
                  value={editingInterview ? editingInterview.technology : ""}
                  onChange={(e) =>
                    setEditingInterview({
                      ...editingInterview,
                      technology: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                {/* Client Type */}
                <label id="clientType">Client Type</label>
                <input
                  type="text"
                  aria-labelledby="clientType"
                  value={editingInterview ? editingInterview.clientType : ""}
                  onChange={(e) =>
                    setEditingInterview({
                      ...editingInterview,
                      clientType: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                {/* Client Name */}
                <label id="clientName">Client Name</label>
                <input
                  type="text"
                  aria-labelledby="clientName"
                  value={editingInterview ? editingInterview.clientName : ""}
                  onChange={(e) =>
                    setEditingInterview({
                      ...editingInterview,
                      clientName: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                {/* Location */}
                <label id="location">Location</label>
                <input
                  type="text"
                  aria-labelledby="location"
                  value={editingInterview ? editingInterview.location : ""}
                  onChange={(e) =>
                    setEditingInterview({
                      ...editingInterview,
                      location: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                {/* Rate */}
                <label id="rate">Rate</label>
                <input
                  type="text"
                  aria-labelledby="rate"
                  value={editingInterview ? editingInterview.rate : ""}
                  onChange={(e) =>
                    setEditingInterview({
                      ...editingInterview,
                      rate: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                {/* Vendor */}
                <label id="vendor">Vendor</label>
                <input
                  type="text"
                  aria-labelledby="vendor"
                  value={editingInterview ? editingInterview.vendor : ""}
                  onChange={(e) =>
                    setEditingInterview({
                      ...editingInterview,
                      vendor: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                {/* Feedback */}
                <label id="feedback">Feedback</label>
                <input
                  type="text"
                  aria-labelledby="feedback"
                  value={editingInterview ? editingInterview.feedback : ""}
                  onChange={(e) =>
                    setEditingInterview({
                      ...editingInterview,
                      feedback: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                {/* Comments */}
                <label id="comments">Comments</label>
                <input
                  type="text"
                  aria-labelledby="comments"
                  value={editingInterview ? editingInterview.comments : ""}
                  onChange={(e) =>
                    setEditingInterview({
                      ...editingInterview,
                      comments: e.target.value,
                    })
                  }
                />
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setIsEditing(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSaveEdit}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default InterviewsComponent;
