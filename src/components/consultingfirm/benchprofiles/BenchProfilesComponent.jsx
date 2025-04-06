import { useEffect, useState } from "react";
import {
    createBenchProfilesApi,
    retrieveAllBenchProfilesApi,
    updateBenchProfileApi,
    deleteBenchProfileApi
}
    from "../api/UserDetailsApiService";
import {
    Table,
    Form,
    Button,
    InputGroup,
}
    from 'react-bootstrap';

import { getValidationSchema } from '../api/validation/ValidateBenchProfileSchema';
import Spinner from 'react-bootstrap/Spinner';
import { BsSearch } from 'react-icons/bs';
import PaginationComponent from "./PaginationComponent";
import ModalComponent from "./ModalComponent";
import 'bootstrap-icons/font/bootstrap-icons.css';

function BenchProfilesComponent() {
    const [benchProfiles, setBenchProfiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editingProfile, setEditingProfile] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [validationErrors, setValidationErrors] = useState({});
    const validationSchema = getValidationSchema();

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [profilesPerPage] = useState(10);

    // Convert all values of the profile object to a string for filtering
    const matchesSearchTerm = (profile) => {
        return Object.values(profile).some((value) =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const getBenchProfiles = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await retrieveAllBenchProfilesApi();
            // Sort profiles by id
            const sortedProfiles = response.data.sort((a, b) => a.id - b.id);
            setBenchProfiles(sortedProfiles);
        } catch (error) {
            setError("Failed to fetch bench profiles");
            console.error("Error fetching bench profiles:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getBenchProfiles();
    }, []);

    // Get current profiles
    const indexOfLastProfile = currentPage * profilesPerPage;
    const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
    const currentProfiles = benchProfiles.slice(indexOfFirstProfile, indexOfLastProfile);

    // Filter profiles based on the search term across all fields
    const filteredProfiles = currentProfiles.filter((profile) => matchesSearchTerm(profile));

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleEdit = (profile) => {
        setEditingProfile({ ...profile });
        setIsEditing(true);
    };

    const handleAddNew = () => {
        setEditingProfile({
            id: "",
            recruiterName: "",
            consultantName: "",
            allocatedStatus: "",
            status: "",
            turboCheck: "",
            priority: "",
            technology: "",
            organization: "",
            experience: "",
            location: "",
            relocation: "",
            modeOfStaying: "",
            newOrExisting: "",
            sourcedBy: "",
            visaStatus: "",
            marketingVisaStatus: "",
            contactNumber: "",
            emailId: "",
            originalDob: "",
            marketingDob: "",
            whatsappNumber: "",
            marketingStartDate: "",
            marketingEndDate: "",
            comments: ""
        });
        setIsEditing(true);
    };

    const handleSaveEdit = async () => {
        // // Prepare the profile data to be sent
        // const profileData = {
        //     recruiterName: editingProfile.recruiterName || '',
        //     consultantName: editingProfile.consultantName || '',
        //     allocatedStatus: editingProfile.allocatedStatus || '',
        //     status: editingProfile.status || '',
        //     turboCheck: editingProfile.turboCheck || '',
        //     priority: editingProfile.priority || '',
        //     technology: editingProfile.technology || '',
        //     organization: editingProfile.organization || '',
        //     experience: editingProfile.experience || '',
        //     location: editingProfile.location || '',
        //     relocation: editingProfile.relocation || '',
        //     modeOfStaying: editingProfile.modeOfStaying || '',
        //     newOrExisting: editingProfile.newOrExisting || '',
        //     sourcedBy: editingProfile.sourcedBy || '',
        //     visaStatus: editingProfile.visaStatus || '',
        //     marketingVisaStatus: editingProfile.marketingVisaStatus || '',
        //     contactNumber: editingProfile.contactNumber || '',
        //     emailId: editingProfile.emailId || '',
        //     originalDob: editingProfile.originalDob || '',
        //     marketingDob: editingProfile.marketingDob || '',
        //     whatsappNumber: editingProfile.whatsappNumber || '',
        //     marketingStartDate: editingProfile.marketingStartDate || '',
        //     marketingEndDate: editingProfile.marketingEndDate || '',
        //     comments: editingProfile.comments || ''
        // };


        try {
            // Validate the data
            await validationSchema.validate(editingProfile, { abortEarly: false });
            
            if (editingProfile.id) {
                // Update existing profile
                await updateBenchProfileApi(editingProfile.id, editingProfile);
                const updatedProfiles = benchProfiles.map((profile) =>
                    profile.id === editingProfile.id ? { ...profile, ...editingProfile } : profile
                );
                setBenchProfiles(updatedProfiles.sort((a, b) => a.id - b.id));
            } else {
                // Add new profile
                const response = await createBenchProfilesApi(editingProfile);
                setBenchProfiles([...benchProfiles, response.data].sort((a, b) => a.id - b.id));
            }
            setIsEditing(false);
            setValidationErrors({});
        } catch (error) {
            if (error.name === 'ValidationError') {
                // Handle Yup validation errors
                const errors = {};
                error.inner.forEach((err) => {
                    errors[err.path] = err.message;
                });
                setValidationErrors(errors);
            } else {
                // Handle API errors
                console.error("Error saving profile:", error.response ? error.response.data : error.message);
                setValidationErrors({ api: "An error occurred while saving the profile." });
            }
        }
       
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete?");
        if (confirmDelete) {
            try {
                await deleteBenchProfileApi(id);
                const updatedProfiles = benchProfiles.filter((profile) => profile.id !== id);
                setBenchProfiles(updatedProfiles);
            } catch (error) {
                console.error("Error deleting profile:", error);
            }
        }
    };

    if (isLoading) return <Spinner animation="border" variant="primary" />;
    if (error) return <Spinner animation="grow" variant="danger" />;

    return (
        <div>
            <h1 className="benchprofilesh1">Bench Profiles Details</h1>

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
                        Add New Profile
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
                            placeholder="Search Profiles"
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
                        <th>Allocated Status</th>
                        <th>Status</th>
                        <th>TurboCheck</th>
                        <th>Priority</th>
                        <th>Technology</th>
                        <th>Organization</th>
                        <th>Experience</th>
                        <th>Location</th>
                        <th>Relocation</th>
                        <th>ModeOfStaying</th>
                        <th>New or Existing</th>
                        <th>Sourced By</th>
                        <th>Visa Status</th>
                        <th>Marketing Visa Status</th>
                        <th>Contact Number</th>
                        <th>Email ID</th>
                        <th>Original DOB</th>
                        <th>Marketing DOB</th>
                        <th>WhatsApp Number</th>
                        <th>Marketing Start Date</th>
                        <th>Marketing End Date</th>
                        <th>Comments</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProfiles.map((benchprofile) => (
                        <tr key={benchprofile.id}>
                            <td>{benchprofile.id}</td>
                            <td>{benchprofile.recruiterName}</td>
                            <td>{benchprofile.consultantName}</td>
                            <td>{benchprofile.allocatedStatus}</td>
                            <td>{benchprofile.status}</td>
                            <td>{benchprofile.turboCheck}</td>
                            <td>{benchprofile.priority}</td>
                            <td>{benchprofile.technology}</td>
                            <td>{benchprofile.organization}</td>
                            <td>{benchprofile.experience}</td>
                            <td>{benchprofile.location}</td>
                            <td>{benchprofile.relocation}</td>
                            <td>{benchprofile.modeOfStaying}</td>
                            <td>{benchprofile.newOrExisting}</td>
                            <td>{benchprofile.sourcedBy}</td>
                            <td>{benchprofile.visaStatus}</td>
                            <td>{benchprofile.marketingVisaStatus}</td>
                            <td>{benchprofile.contactNumber}</td>
                            <td>{benchprofile.emailId}</td>
                            <td>{benchprofile.originalDob}</td>
                            <td>{benchprofile.marketingDob}</td>
                            <td>{benchprofile.whatsappNumber}</td>
                            <td>{benchprofile.marketingStartDate}</td>
                            <td>{benchprofile.marketingEndDate}</td>
                            <td>{benchprofile.comments}</td>
                            <td>
                                <i
                                    className="bi bi-pencil-square me-3 text-primary"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleEdit(benchprofile)}
                                ></i>
                                <i
                                    className="bi bi-trash text-danger"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleDelete(benchprofile.id)}
                                ></i>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <PaginationComponent
                currentPage={currentPage}
                totalPages={Math.ceil(benchProfiles.length / profilesPerPage)}
                paginate={paginate}
            />

            <ModalComponent
                show={isEditing}
                onHide={() => setIsEditing(false)}
                title={editingProfile && editingProfile.id ? "Edit Bench Profile" : "Add New Bench Profile"}
                onSave={handleSaveEdit}
                editingProfile={editingProfile}
                setEditingProfile={setEditingProfile}
                validationErrors={validationErrors}
            />
        </div>
    );
}

export default BenchProfilesComponent;
