import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";

import "./App.css";

function UpdateModal(props) {
  const [show, setShow] = useState(false);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleClose = () => {
    setShow(false);    
  };
  const handleShow = () => setShow(true);

  const handleUpdateData = () => {

    const updatedData = {
      id: props.id,
      question: question,
      answer: answer,
    };

    //passing a function as a object in props to uplift the component data to parent
    props.onSaveUpdateData(updatedData);
    setShow(false)
  }


  return (
    <>
      <Button
        className="friend-card-btn" variant="primary" size="md" onClick={handleShow}>
        Update
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Update Friend</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Control onChange={(e) => {setQuestion(e.target.value)}} type="text" placeholder="New Question" className="modal-input" />
            <Form.Control onChange={(e) => {setAnswer(e.target.value)}} type="text" placeholder="New Answer" className="modal-input" />
          </Form>
        </Modal.Body>
        <Modal.Footer className="modal-buttons">
          <Button className="modal-button" size="lg" variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button 
            className="modal-button"
            disabled={!question || !answer}
            size="lg" 
            variant="primary" 
            onClick={handleUpdateData}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UpdateModal;
