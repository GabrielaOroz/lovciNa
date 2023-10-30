import { Button, Flex } from '@chakra-ui/react';
import Base from '../Base';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <Base>
      <Flex alignSelf="center" gap="50px" marginBottom="30px">
        <Link to="/login">
          <Button shadow='dark-lg' size="lg" colorScheme="green">Log In</Button>
        </Link>
        <Link to="/register">
           <Button shadow='dark-lg' size="lg">Register</Button>
        </Link>
      </Flex>
    </Base>
  )
}