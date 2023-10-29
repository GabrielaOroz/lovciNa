import { Link } from 'react-router-dom';
import { Button } from "@chakra-ui/react";

export default function Login() {
  return (
    <div>
      <h1>Login Page</h1>
      <Link to="/">
        <Button>Home</Button>
      </Link>
    </div>
  )
}
