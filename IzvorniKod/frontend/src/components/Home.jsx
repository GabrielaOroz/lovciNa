import { Link } from 'react-router-dom';
import { Button } from "@chakra-ui/react";

export default function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <Link to="/login">
        <Button>Login</Button>
      </Link>
      <Link to="/register">
        <Button>Register</Button>
      </Link>
    </div>
  )
}
