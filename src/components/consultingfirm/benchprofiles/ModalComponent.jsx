import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import BenchProfileFormFields from './BenchProfileFormFields';

const ModalComponent = ({ show, onHide, title, onSave, editingProfile, setEditingProfile, validationErrors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingProfile({ ...editingProfile, [name]: value });
  };

  const renderFormGroup = (field) => {
    const { label, name, type } = field;
    
    if (type === 'textarea') {
      return (
        <Form.Group className="mb-3" key={name}>
          <Form.Label>{label}</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name={name}
            value={editingProfile ? editingProfile[name] : ""}
            onChange={handleChange}
            isInvalid={!!validationErrors[name]}
          />
          <Form.Control.Feedback type="invalid">
            {validationErrors[name]}
          </Form.Control.Feedback>
        </Form.Group>
      );
    }

    return (
      <Form.Group className="mb-3" key={name}>
        <Form.Label>{label}</Form.Label>
        <Form.Control
          type={type}
          name={name}
          value={editingProfile ? editingProfile[name] : ""}
          onChange={handleChange}
          isInvalid={!!validationErrors[name]}
        />
        <Form.Control.Feedback type="invalid">
          {validationErrors[name]}
        </Form.Control.Feedback>
      </Form.Group>
    );
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {BenchProfileFormFields.map(renderFormGroup)}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={onSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalComponent;