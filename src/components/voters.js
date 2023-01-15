import React from 'react'
import { ListGroup } from 'react-bootstrap'

export const Voters = ({voters}) => {

  return (
<>
<h1> Voters </h1>
{voters.map((v) => (
    
    <ListGroup className="mb-2">
   <ListGroup.Item>{v}</ListGroup.Item>
    </ListGroup>

    ))}
   
    </>
  );
  
}
