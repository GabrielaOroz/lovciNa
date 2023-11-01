import { Button, Flex, Input, InputGroup, InputRightElement, Radio, RadioGroup, Show, Stack, Text } from "@chakra-ui/react";
import Base from "../Base"
import FormCard from "../FormCard"
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { GiBearFace } from "react-icons/gi"

export default function Register() {
  const [role, setRole] = useState('tracker');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [showPass, setShowPass] = useState(false);

  const inputRef = useRef(null);
  const handleFileUpload = () => {
    inputRef.current.click();
  }
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file){
      return;
    }
    e.target.value= '';
    setSelectedFile(file);
  }


  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
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
        <Flex justifyContent="space-around" alignItems="center">
          <Show above='md'>
            <GiBearFace size="30px" color="#FFFBE0" />
          </Show>
          <Text fontSize="lg" color="#FFFBE0">CREATE YOUR ACCOUNT</Text>
          <Show above='md'>
            <GiBearFace size="30px" color="#FFFBE0" />
          </Show>
        </Flex>
        
        <RadioGroup value={role} onChange={(newValue) => setRole(newValue)} alignSelf="center" color="#FFFBE0">
          <Stack direction={['column', 'column', 'column', 'row']} spacing="20px" align="center">
            <Radio colorScheme='green' value="tracker">Tracker</Radio>
            <Radio colorScheme='yellow' value="researcher">Researcher</Radio>
            <Radio colorScheme='red' value="stationManager">Station Manager</Radio>
          </Stack>
        </RadioGroup>

        <Input 
          type="text" 
          placeholder="First name" 
          _placeholder={{ color: '#FFFBE0' }} 
          focusBorderColor="#FFFBE0"
          borderColor="#FFFBE0"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          id="firstName"
        />
        <Input 
          type="text" 
          placeholder="Last name" 
          _placeholder={{ color: '#FFFBE0' }}
          focusBorderColor="#FFFBE0"
          borderColor="#FFFBE0"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          id="lastName"
        />

        <Input 
          style={{display: 'none'}} 
          type="file" 
          ref={inputRef} 
          onChange={handleFileChange}
          id="file"
        />
        <Button marginTop="15px" onClick={handleFileUpload} bgColor="#F1EDD4" _hover={{bg:"#FFFBE0"}} border="0">Upload profile picture</Button>
        <img src={selectedFile && URL.createObjectURL(selectedFile)} color="#FFFBE0" alt={selectedFile ? selectedFile.name : ''} />
        {selectedFile && (
          <Button w="200px" alignSelf="center" bgColor="#F1EDD4" _hover={{bg:"#FFFBE0"}} onClick={() => setSelectedFile('')}>Remove picture</Button>
        )}  

        <Input 
          type="email" 
          placeholder="Email adress" 
          _placeholder={{ color: '#FFFBE0' }}
          focusBorderColor="#FFFBE0"
          borderColor="#FFFBE0"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="email"
        />
        <Input 
          type="text" 
          placeholder="Username" 
          _placeholder={{ color: '#FFFBE0' }}
          focusBorderColor="#FFFBE0"
          borderColor="#FFFBE0"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          id="username"
        />
        <InputGroup size='md'>
          <Input 
            type={showPass ? 'text' : 'password'} 
            placeholder='Enter password' 
            _placeholder={{ color: '#FFFBE0' }}
            focusBorderColor="#FFFBE0"
            borderColor="#FFFBE0"
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
          border="solid 1px"
          color="#FFFBE0"
          w="100px" 
          alignSelf="center"
          onClick={handleSubmit}
        >
          Submit
        </Button>
        
        <Text alignSelf="center" color="black">Already have an account?
          <Link to="/login">
            <Button paddingLeft="5px" variant="unstyled" color="#FFFBE0">Log In</Button>
          </Link>
        </Text>
        
      </FormCard> 
    </Base>
  )
}