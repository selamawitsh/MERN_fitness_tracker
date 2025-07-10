import React from 'react'
import styled from 'styled-components'
import TextInput from './TextInput.jsx';

import Button from './Button.jsx'

const Card = styled.div`
  flex: 1;
  min-width: 280px;
  padding: 25px;
  border: 1px solid ${({theme})=> theme.text_primary};
  border-radius: 14px;
  box-shadow: 1px 2px 10px 0px ${({theme})=> theme.text_primary};
  display: flex;
  flex-direction: column;
  gap: 6px;

  @media(max-width: 600px){
    padding: 16px;
  }
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${({theme}) => theme.primary};

  @media (max-width: 600px){
    font-size: 14px;
  }
`;

function AddWorkout({workout, setworkout}) {
    // const [workout, setworkout] = useState('')
   return (
    <Card>
      <Title>Add New Workout</Title>
      <TextInput
      label='Workout'
      textArea
      rows={10}
      value={workout}
      handelChange={(e)=>setworkout(e.target.value)}
      placeholder={`Enter in this format:
        #Category
        -workout name
        -Sets
        -Reps
        -weight
        -Duration`}
      />
      <Button text='Add Workout' small/>
    </Card>
  );
}

export default AddWorkout
