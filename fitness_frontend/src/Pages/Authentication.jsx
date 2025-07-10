import React from 'react'
import styled from 'styled-components'
import LogoImage from '../assets/logo.png'
import BackgroundImage from '../assets/gymman.png'
import { useState } from 'react'
import SignIn from '../components/SignIn'
import SignUp from '../components/SignUp'


    const Container = styled.div`
        display: flex;
        width: 100%;
        height: 100vh;
        overflow: hidden;
        background: ${({ theme }) => theme.bg};
        @media (max-width: 768px) {
            flex-direction: column;
        }
    `;

    const Left = styled.div`    
        position: relative;
        flex: 1;
        @media (max-width: 768px) {
            display: none;
        }
    `;

    const Right = styled.div`
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: relative;
        gap: 20px;
        padding: 40px;
    `;

    const Logo = styled.img`
        position: absolute;
        top: 20px;
        left: 10px;
        width: 70px;
        z-index: 10;
    `;

    const Image = styled.img`
        position: relative;
        width: 100%;
        height: 100%;
        object-fit: cover;
    `;

    const Text = styled.div`
    font-size: 16px;
    text-align: center;
    color: ${({ theme }) => theme.text_secondary};
    margin-top: 16px;
    @media (max-width: 400px) {
        font-size: 14px;    
    }
        
    `;
    const TextButton = styled.span`
    color: ${({ theme }) => theme.primary};
    cursor: pointer;
    font-weight: 600;
    transition: color 0.3s ease; 
    `;

function Authentication() {
    const [login, setLogin] = useState(false);
    return (
       <Container>
        <Left>
            <Logo src={LogoImage} />
            <Image src={BackgroundImage} />
        </Left>
        <Right>
            {login ? 
            <>
            <SignIn/>
            <Text>Don't have an account? <TextButton onClick={() => setLogin(false)}>SignUp</TextButton></Text>
            </> 
            : 
            <>
            <SignUp />
            <Text>Already have an account? <TextButton onClick={() => setLogin(true)}>SignIn</TextButton></Text>
            </>
            }

        </Right>
       </Container>
       
    )
}

export default Authentication
