import React, { useState } from "react";

import { Button, Modal, Form, FloatingLabel, Nav, Badge, Container, Navbar } from "react-bootstrap";

const Home = (props) => {

  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");


  const [voterAddress, setVoterAddress] = useState("");




  const isFormFilled = () => address && name && age && image && description;
  const isVFormFilled = () => voterAddress;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [vshow, setVShow] = useState(false);

  const handleVClose = () => setVShow(false);
  const handleVShow = () => setVShow(true);



  return (
<>
    <Navbar bg="light" >
      <Container>
        <Navbar.Brand href="#home">Devote</Navbar.Brand>
        <Navbar.Toggle />
        <Nav className="me-auto">
        
        <Badge bg="secondary" className="ms-auto">
             Balance {props.cUSDBalance}cUSD
           </Badge>
       
          </Nav>
        <Navbar.Collapse className="justify-content-end">
        
        <Button
        onClick={handleShow}
        variant="dark"
        
      >
        <h5> Add Candidate </h5>
      </Button>

      <Button
        onClick={handleVShow}
        variant="dark"
        
      >
        <h5> Give Voting Right </h5>
      </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>

    
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>New Candidate</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
          <FloatingLabel
              controlId="inputAddress"
              label="CandidateAddress"
              className="mb-3"
            >
              <Form.Control
                type="text"
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
                placeholder="Candidate Address"
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputName"
              label="Name of Candidate"
              className="mb-3"
            >
              <Form.Control
                type="text"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                placeholder="name of candidate"
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputAge"
              label="Age"
              className="mb-3"
            >
              <Form.Control
                type="number"
                onChange={(e) => {
                  setAge(e.target.value);
                }}
                placeholder="Age"
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputImage"
              label="Image"
              className="mb-3"
            >
              <Form.Control
                type="text"
                onChange={(e) => {
                  setImage(e.target.value);
                }}
                placeholder="Image"
              />
            </FloatingLabel>
            
            <FloatingLabel
              controlId="inputDescription"
              label="Description"
              className="mb-3"
            >
              <Form.Control
                as="textarea"
                placeholder="description"
                style={{ height: "80px" }}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </FloatingLabel>
            
           
          </Modal.Body>
        </Form>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="dark"
            disabled={!isFormFilled()}
            onClick={() => {
              props.addCandidate( 
                address,
                name,
                age,
                image,
                description,
              );
              handleClose();
            }}
          >
            Add Candidate
          </Button>
        </Modal.Footer>
      </Modal>




      <Modal show={vshow} onHide={handleVClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>New Voter</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
          <FloatingLabel
              controlId="inputAddress"
              label="VoterAddress"
              className="mb-3"
            >
              <Form.Control
                type="text"
                onChange={(e) => {
                  setVoterAddress(e.target.value);
                }}
                placeholder="Voter Address"
              />
            </FloatingLabel>
           
           
           
            
            
           
          </Modal.Body>
        </Form>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleVClose}>
            Close
          </Button>
          <Button
            variant="dark"
            disabled={!isVFormFilled()}
            onClick={() => {
              props.giveVotingRight( 
                voterAddress,
              );
              handleVClose();
            }}
          >
           Give voting right
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Home;
