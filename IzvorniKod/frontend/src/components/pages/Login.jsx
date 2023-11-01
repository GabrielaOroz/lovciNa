import { Button, Flex, Input, InputGroup, InputRightElement, Show, Text } from "@chakra-ui/react";
import Base from '../Base';
import FormCard from '../FormCard';
import { useState } from "react";
import { Link } from "react-router-dom";
import { GiDeerHead } from "react-icons/gi"

export default function Login() {
  const [showPass, setShowPass] = useState(false);

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('username', username);
    formData.append('password', password);

    fetch('http://localhost:5173', {
      method: 'POST',
      body: formData,
    })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.error(err))
  }

  return (
    <Base>
      <FormCard>
        <Flex justifyContent="center" gap="10px" alignItems="center">
          <Show above="md">
            <GiDeerHead size="30px" color="#FFFBE0" />
          </Show>
          <Text fontSize="lg" color="#FFFBE0">Start using Wild Track</Text>
          <Show above="md">
            <GiDeerHead size="30px" color="#FFFBE0" />
          </Show>
        </Flex>
        <Input 
          type="email" 
          placeholder="Email adress" 
          _placeholder={{ color: '#FFFBE0' }}
          borderColor="#FFFBE0"
          focusBorderColor="#FFFBE0"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="email"
        />
        <Input 
          type="text" 
          placeholder="Username" 
          _placeholder={{ color: '#FFFBE0' }}
          borderColor="#FFFBE0"
          focusBorderColor="#FFFBE0"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          id="username"
        />
        <InputGroup size='md'>
          <Input 
            type={showPass ? 'text' : 'password'} 
            placeholder='Enter password' 
            _placeholder={{ color: '#FFFBE0' }}
            borderColor="#FFFBE0"
            focusBorderColor="#FFFBE0"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="password"
          />
          <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='sm' bgColor="#F1EDD4" _hover={{bg:"#FFFBE0"}} onClick={() => setShowPass(!showPass)}>
              {showPass ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>

        <Button 
          type="submit" 
          colorScheme="green" 
          color="#FFFBE0"
          border="solid 1px" 
          w="100px" 
          alignSelf="center"
          onClick={handleSubmit}
        >
          Log In
        </Button>
        
        <Text alignSelf="center" color="black">Don't have an account?
          <Link to="/register">
            <Button paddingLeft="5px" variant="unstyled" color="#FFFBE0">Register</Button>
          </Link>
        </Text>
      </FormCard>
    </Base>
  )
}