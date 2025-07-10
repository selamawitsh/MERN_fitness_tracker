import React from "react";
import styled from "styled-components";
import Logoimg from "../assets/logo.png";
import { Link, useLocation } from "react-router-dom";
import { MenuRounded } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import { useState } from "react";

const Nav = styled.nav`
  background: ${({ theme }) => theme.nav_background};
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
`;

const NavContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  justify-content: space-between;
`;
const NavLogo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 6px;
  font-weight: 700;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.primary};
  text-decoration: none;
  letter-spacing: 2px;
  transition: color 0.2s;
`;

const Logo = styled.img`
  height: 44px;
  width: 44px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  background: #fff;
`;

const Mobileicon = styled.div`
  display: none;
  color: ${({ theme }) => theme.text_primary};
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
`;

const NavItems = styled.ul`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  list-style: none;
  gap: 28px;
  margin: 0;
  padding: 0;
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
  text-decoration: none;
  font-size: 1.08rem;
  padding: 8px 18px;
  border-radius: 8px;
  transition: background 0.18s, color 0.18s;
  position: relative;
  &:hover,
  &.active {
    color: ${({ theme }) => theme.primary};
  }
  &.active::after {
    content: "";
    display: block;
    margin: 0 auto;
    width: 60%;
    height: 3px;
    border-radius: 2px;
    background: ${({ theme }) => theme.primary};
    margin-top: 4px;
  }
`;

const UserContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    align-items: center;
    padding: 0 6px;
    color: ${({ theme }) => theme.text_primary};
`;

const TextButton = styled.div`
  text-align: end;
  color: ${({ theme }) => theme.text_secondary};
  font-weight: 500;
  cursor: pointer;
  font-size: 1.08rem;
  transition:  all 0.3s ease ;
    &:hover {
      color: ${({ theme }) => theme.primary};
  `
const MobileMenu = styled.ul`
    display: flex;
    align-items: start;
    flex-direction: column;
    gap:16px;
    list-style: none;
    padding: 0 6px;
    list-style: none;
    background: ${({ theme }) => theme.bg};
    position: absolute;
    width: 90%;
    top: 80px;
    right: 0;
    transition: all 0.6s ease-in-out;
    transform: ${({ isOpen }) => (isOpen ? "translateY(0)" : "translateY(-150%)")};
    border-radius: 0 0 20px 20px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
    cursor: pointer;
`;



function NavBar() {
    const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  return (
    <Nav>
      <NavContainer>
        <Mobileicon onClick={() => setIsOpen(!isOpen)}>
          <MenuRounded sx={{ color: "black", fontSize: "2rem" }} />
        </Mobileicon>

        <NavLogo to="/">
          <Logo src={Logoimg} alt="FitLife Logo" />
          <span>FitLife</span>
        </NavLogo>

        <MobileMenu isOpen={isOpen}>
            <NavLink to="/" className={location.pathname === "/" ? "active" : ""}>
            Dashboard
          </NavLink>
          <NavLink
            to="/workouts"
            className={location.pathname === "/workouts" ? "active" : ""}
          >
            Workouts
          </NavLink>
          <NavLink
            to="/tutorials"
            className={location.pathname === "/tutorials" ? "active" : ""}
          >
            Tutorials
          </NavLink>
          <NavLink
            to="/blogs"
            className={location.pathname === "/blogs" ? "active" : ""}
          >
            Blogs
          </NavLink>
          <NavLink
            to="/contact"
            className={location.pathname === "/contact" ? "active" : ""}
          >
            Contact
          </NavLink>
        </MobileMenu>

        <NavItems>
          <NavLink to="/" className={location.pathname === "/" ? "active" : ""}>
            Dashboard
          </NavLink>
          <NavLink
            to="/workouts"
            className={location.pathname === "/workouts" ? "active" : ""}
          >
            Workouts
          </NavLink>
          <NavLink
            to="/tutorials"
            className={location.pathname === "/tutorials" ? "active" : ""}
          >
            Tutorials
          </NavLink>
          <NavLink
            to="/blogs"
            className={location.pathname === "/blogs" ? "active" : ""}
          >
            Blogs
          </NavLink>
          <NavLink
            to="/contact"
            className={location.pathname === "/contact" ? "active" : ""}
          >
            Contact
          </NavLink>
        </NavItems>


        <UserContainer>
            <Avatar/>
            <TextButton>Log out</TextButton>
        </UserContainer>
      </NavContainer>
    </Nav>
  );
}


export default NavBar;
