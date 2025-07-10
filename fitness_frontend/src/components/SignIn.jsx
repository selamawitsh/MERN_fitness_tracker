import React from 'react'
import styled from 'styled-components'
import TextInput from './TextInput.jsx';
import Button from './Button.jsx';


const Container = styled.div`
  max-width: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: ${({ theme }) => theme.text_primary};
  text-align: center;
  margin-bottom: 4px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
`;

const Span = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary};
  margin-top: 16px;
  @media (max-width: 400px) {
    font-size: 14px;
  }
`;


function SignIn() {
  return (
     <Container>
        <div>
            <Title>Welcome to FitLife</Title>
            <Span>Please sign in to continue</Span>
        </div>

        <div style={{
             width: '100%', 
             display: 'flex', 
             flexDirection: 'column', 
             gap: '16px', 
             marginTop: '24px' 
             }}>

            <TextInput label="Email" placeholder="Enter your email" />
            <TextInput label="Password" type="password" placeholder="Enter your password" password={<TextInput.Password />} />

            <Button text="Sign In"/>
        </div>
        
    </Container>
  )
}

export default SignIn
