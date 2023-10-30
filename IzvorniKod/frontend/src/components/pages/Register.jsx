import { Button, Flex, HStack, Input, InputGroup, InputRightElement, Radio, RadioGroup, Text } from "@chakra-ui/react";
import Base from "../Base"
import Form from "../FormCard"
import { useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const inputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileUpload = () => {
    inputRef.current.click();
  }

  const handleFileChange = event => {
    const file = event.target.files && event.target.files[0];
    if (!file){
      return;
    }
    setSelectedFile(file);
  }

  const [show, setShow] = useState(false);
  const handleShow = () => setShow(!show);

  return (
    <Base>
      <Form>
        <Text alignSelf="center" fontSize="lg">CREATE YOUR ACCOUNT</Text>
        <RadioGroup defaultValue='Tracker' alignSelf="center">
          <HStack spacing="20px">
            <Radio colorScheme='green' value="Tracker">Tracker</Radio>
            <Radio colorScheme='yellow' value="Researcher">Researcher</Radio>
            <Radio colorScheme='red' value="StationManager">Station Manager</Radio>
          </HStack>
        </RadioGroup>

        <Input 
          type="text" 
          placeholder="First name" 
          _placeholder={{ color: 'white' }} 
          focusBorderColor="white"
        />
        <Input 
          type="text" 
          placeholder="Last name" 
          _placeholder={{ color: 'white' }}
          focusBorderColor="white"
        />

        <Input 
          style={{display: 'none'}} 
          type="file" 
          ref={inputRef} 
          onChange={handleFileChange}
        />
        <Button onClick={handleFileUpload}>Upload profile picture</Button>
        {selectedFile && (
          <Text color="white" alignSelf="center">
            Profile picture uploaded: {selectedFile.name}
          </Text>
        )}  

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
          Submit
        </Button>
        
        <Flex justifyContent="center" alignItems="center" gap="10px">
          <Text color="black">Already have an account?</Text>
          <Link to="/login">
            <Button variant="unstyled">Log In</Button>
          </Link>
        </Flex>
        
      </Form> 
    </Base>
  )
}
