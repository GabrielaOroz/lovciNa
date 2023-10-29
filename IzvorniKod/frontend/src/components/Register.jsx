import { Link } from 'react-router-dom';
import { Button } from "@chakra-ui/react";

export default function Register() {
  return (
    <div>
      <h1>Register Page</h1>
      <Link to="/">
        <Button>Home</Button>
      </Link>
    </div>
  )
}
