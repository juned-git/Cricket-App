import { NavLink } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
const Header = () => {
  return (
    <Navbar bg="dark" data-bs-theme="dark">
    <Container>
      <Navbar.Brand ><NavLink to='/' className='text-white text-decoration-none'>Cricko</NavLink></Navbar.Brand>
      <Nav className="me-auto">
        <NavLink t0="/" className='text-white text-decoration-none mx-3'>Home</NavLink>
        <NavLink to="/about" className='text-white text-decoration-none'>About</NavLink>
        <NavLink to="/more" className='text-white text-decoration-none mx-3'>More</NavLink>
      </Nav>
    </Container>
  </Navbar>
  );
};
export default Header;
