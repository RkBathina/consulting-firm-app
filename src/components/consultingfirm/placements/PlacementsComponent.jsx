import { useEffect, useState } from "react";
import {
    createPlacementsApi,
    retrieveAllPlacementsApi,
    updatePlacementsApi,
    deletePlacementsApi
}
    from "../api/UserDetailsApiService";
import { Table, Form } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import { Modal, Button, Pagination, InputGroup } from 'react-bootstrap';
import { BsSearch } from 'react-icons/bs';
import 'bootstrap-icons/font/bootstrap-icons.css';

function PlacementsComponent() {
    const [placements, setPlacements] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editingPlacements, setEditingPlacements] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [placementsPerPage] = useState(10);

    // Convert all values of the profile object to a string for filtering
    const matchesSearchTerm = (placement) => {
        return Object.values(placement).some((value) =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const getPlacements = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await retrieveAllPlacementsApi();
            // Sort placements by id
            const sortedPlacements = response.data.sort((a, b) => a.id - b.id);
            setPlacements(sortedPlacements);
        } catch (error) {
            setError("Failed to placements details");
            console.error("Error fetching placements:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getPlacements();
    }, []);

    // Get current placements
    const indexOfLastPlacement = currentPage * placementsPerPage;
    const indexOfFirstPlacement = indexOfLastPlacement - placementsPerPage;
    const currentPlacements = placements.slice(indexOfFirstPlacement, indexOfLastPlacement);

    // Filter placements based on the search term across all fields
    const filteredPlacements = currentPlacements.filter((placement) => matchesSearchTerm(placement));

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleEdit = (placement) => {
        setEditingPlacements({ ...placement });
        setIsEditing(true);
    };

    const handleAddNew = () => {
        setEditingPlacements({
            id: "",
            recruiterName: "",
            consultantName: "",
            client: "",
            dateOfJoin: "",
            contractDuration: "",
            newOrExisting: "",
            rate: ""
        });
        setIsEditing(true);
    };

    const handleSaveEdit = async () => {
        // Prepare the placement data to be sent
        const placementsData = {
            recruiterName: editingPlacements.recruiterName || '',
            consultantName: editingPlacements.consultantName || '',
            client: editingPlacements.client || '',
            dateOfJoin: editingPlacements.dateOfJoin || '',
            contractDuration: editingPlacements.contractDuration || '',
            newOrExisting: editingPlacements.newOrExisting || '',
            rate: editingPlacements.rate || ''
        };

        try {
            if (editingPlacements.id) {
                // Update existing placement
                await updatePlacementsApi(editingPlacements.id, placementsData);
                const updatedPlacements = placements.map((placement) =>
                    placement.id === editingPlacements.id ? { ...placement, ...placementsData } : placement
                );
                setPlacements(updatedPlacements.sort((a, b) => a.id - b.id));
            } else {
                // Add new placement data
                const response = await createPlacementsApi(placementsData);
                setPlacements([...placements, response.data].sort((a, b) => a.id - b.id));
            }
        } catch (error) {
            console.error("Error saving placemnts:", error.response ? error.response.data : error.message);
        }
        setIsEditing(false);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete?");
        if (confirmDelete) {
            try {
                await deletePlacementsApi(id);
                const updatedPlacements = placements.filter((placement) => placement.id !== id);
                setPlacements(updatedPlacements);
            } catch (error) {
                console.error("Error deleting placement:", error);
            }
        }
    };

    if (isLoading) return <Spinner animation="border" variant="primary" />;
    if (error) return <Spinner animation="grow" variant="danger" />;

    return (
        <div>
            <h1 className="placementsh1">Placements Details</h1>
            <Form.Group className="mb-3" style={{ textAlign: 'right' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <Button
                        variant="primary"
                        onClick={handleAddNew}
                        className="mb-3"
                        style={{
                            height: '38px',
                            lineHeight: '1.5',
                            marginTop: '22px',
                        }}
                    >
                        Add New Placement
                    </Button>
                    <InputGroup style={{ width: '300px' }}>
                        <InputGroup.Text
                            style={{
                                backgroundColor: '#fff',
                                border: '1px solid black',
                                borderRadius: '8px 0 0 8px',
                                padding: '6px 10px',
                                marginLeft: '10px'
                            }}
                        >
                            <BsSearch />
                        </InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="Search Placements"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                border: '1px solid black',
                                borderRadius: '0 8px 8px 0',
                                fontWeight: 'bold',
                                height: '38px',
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
                        <th>Consultant Name</th>
                        <th>Client </th>
                        <th>DateOfJoin</th>
                        <th>ContractDuration</th>
                        <th>NewOrExisting</th>
                        <th>Rate</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPlacements.map((placements) => (
                        <tr key={placements.id}>
                            <td>{placements.id}</td>
                            <td>{placements.recruiterName}</td>
                            <td>{placements.consultantName}</td>
                            <td>{placements.client}</td>
                            <td>{placements.dateOfJoin}</td>
                            <td>{placements.contractDuration}</td>
                            <td>{placements.newOrExisting}</td>
                            <td>{placements.rate}</td>
                            <td>
                                <i
                                    className="bi bi-pencil-square me-3 text-primary"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleEdit(placements)}
                                ></i>
                                <i
                                    className="bi bi-trash text-danger"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleDelete(placements.id)}
                                ></i>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Pagination className="justify-content-center" size="sm">
                {[...Array(Math.ceil(placements.length / placementsPerPage))].map((_, index) => (
                    <Pagination.Item
                        key={index + 1}
                        active={index + 1 === currentPage}
                        onClick={() => paginate(index + 1)}
                    >
                        {index + 1}
                    </Pagination.Item>
                ))}
            </Pagination>

            {isEditing && (
                <Modal show={isEditing} onHide={() => setIsEditing(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editingPlacements && editingPlacements.id ? "Edit Placements Info" : "Add New Placements Info"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            {/* Recruiter Name */}
                            <div>
                                <label>RecruiterName</label>
                                <input
                                    type="text"
                                    value={editingPlacements ? editingPlacements.recruiterName : ""}
                                    onChange={(e) =>
                                        setEditingPlacements({ ...editingPlacements, recruiterName: e.target.value })
                                    }
                                />
                            </div>

                            {/* Consultant Name */}
                            <div>
                                <label>ConsultantName</label>
                                <input
                                    type="text"
                                    value={editingPlacements ? editingPlacements.consultantName : ""}
                                    onChange={(e) =>
                                        setEditingPlacements({ ...editingPlacements, consultantName: e.target.value })
                                    }
                                />
                            </div>

                            {/* Client*/}
                            <div>
                                <label>Client</label>
                                <input
                                    type="text"
                                    value={editingPlacements ? editingPlacements.client : ""}
                                    onChange={(e) =>
                                        setEditingPlacements({ ...editingPlacements, client: e.target.value })
                                    }
                                />
                            </div>

                            {/* Date of Join */}
                            <div>
                                <label>DateOfJoin</label>
                                <input
                                    type="date"
                                    value={editingPlacements ? editingPlacements.dateOfJoin : ""}
                                    onChange={(e) =>
                                        setEditingPlacements({ ...editingPlacements, dateOfJoin: e.target.value })
                                    }
                                />
                            </div>
                            {/* Contract Duratiion */}
                            <div>
                                <label>ContractDuration</label>
                                <input
                                    type="text"
                                    value={editingPlacements ? editingPlacements.contractDuration : ""}
                                    onChange={(e) =>
                                        setEditingPlacements({ ...editingPlacements, contarctDuration: e.target.value })
                                    }
                                />
                            </div>

                            {/* New or Existing */}
                            <div>
                                <label>NewOrExisting</label>
                                <input
                                    type="text"
                                    value={editingPlacements ? editingPlacements.newOrExisting : ""}
                                    onChange={(e) =>
                                        setEditingPlacements({ ...editingPlacements, newOrExisting: e.target.value })
                                    }
                                />
                            </div>

                            {/* Rate */}
                            <div>
                                <label>Rate</label>
                                <input
                                    type="text"
                                    value={editingPlacements ? editingPlacements.rate : ""}
                                    onChange={(e) =>
                                        setEditingPlacements({ ...editingPlacements, rate: e.target.value })
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

export default PlacementsComponent;
