import React from 'react';
import { Card, Badge, Col, Stack, Button, Row } from 'react-bootstrap';

export const Candidates = (props) => {
return ( 
    <Row xs={1} md={3} className="g-4">
    {props.candidates.map((candidate)=> (
     <Col key={candidate.index}>
     <Card className=" h-100">
       <Card.Header>
         <Stack direction="horizontal" gap={2}>
           <Badge bg="secondary" className="ms-auto">
             {candidate.index} ID
           </Badge>

           <Badge bg="secondary" className="ms-auto">
             {candidate.voteCount} vote count
           </Badge>
         </Stack>
       </Card.Header>

       <div className=" ratio ratio-4x3">
         <img src={candidate.image} alt={candidate.description} style={{ objectFit: "cover" }} />
       </div>

       <Card.Body className="d-flex  flex-column text-center">
         <Card.Title>{candidate.name}</Card.Title>
         <Card.Title>Age: {candidate.age}</Card.Title>
         <Card.Text className="flex-grow-1">{candidate.description}</Card.Text>
         <Button variant="primary mt-2" onClick={() => props.vote(candidate.index)}>
              Vote for this candidate 1cUSD
             </Button>
       </Card.Body>
     </Card>
   </Col>

  ))}
</Row>
  
)};
