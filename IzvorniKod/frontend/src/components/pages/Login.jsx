import { Button, Flex, Input, InputGroup, InputRightElement, Text } from "@chakra-ui/react";
import Base from '../Base';
import Form from '../FormCard';
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(!show);
  return (
    <Base>
      <Form>
        <Text alignSelf="center" fontSize="lg">Start using Wild Track</Text>
        <Input 
          type="email" 
          placeholder="Email adress" 
          _placeholder={{ color: 'white' }}
          focusBorderColor="white"
        />
        <Input 
          type="text" 
          placeholder="Username" 
          _placeholder={{ color: 'white' }}
          focusBorderColor="white"
        />
        <InputGroup size='md'>
          <Input 
            type={show ? 'text' : 'password'} 
            placeholder='Enter password' 
            _placeholder={{ color: 'white' }}
            focusBorderColor="white"
          />
          <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='sm' onClick={handleShow}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>

        <Button 
          type="submit" 
          colorScheme="green" 
          border="solid 1px" 
          w="100px" 
          alignSelf="center"
        >
          Log In
        </Button>
        
        <Flex justifyContent="center" alignItems="center" gap="10px">
          <Text color="black">Don't have an account?</Text>
          <Link to="/register">
            <Button variant="unstyled">Register</Button>
          </Link>
        </Flex>
      </Form>
    </Base>
  )
}
