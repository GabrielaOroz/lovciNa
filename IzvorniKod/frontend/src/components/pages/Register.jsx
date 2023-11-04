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

  const [rightEmail, setRightEmail] = useState(true);
  const [rightFirstName, setRightFirstName] = useState(true);
  const [rightLastName, setRightLastName] = useState(true)
  const [rightPass, setRightPass] = useState(true)
  const [rightUsername, setRightUsername] = useState(true)

    //////////////validacije inputa. Staviti u zasebnu datoteku!
    const validateEmail = () => {
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i //sensitive case email??
     if (emailRegex.test(email))
      {
        setRightEmail(true)
        return true
      }else{
        
        setRightEmail(false)
        return false
      }
    }
    const validateFirstName = () => {
      const nameRegex = /^[a-z ,.'-]+$/i
      if (nameRegex.test(firstName))
      {
        setRightFirstName(true)
        return true
      }else{
        
        setRightFirstName(false)
        return false
      }
    }
    const validateLastName = () => {
      const nameRegex = /^[a-z ,.'-]+$/i
      if (nameRegex.test(lastName))
      {
        setRightLastName(true)
        return true
      }else{
        
        setRightLastName(false)
        return false
      }
    }
    const validatePass = () => {
      const passRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,16}$/
      if (passRegex.test(password))
      {
        setRightPass(true)
        return true
      }else{
        
        setRightPass(false)
        return false
      }
    }
    const validateUsername = () => {
      const usernameRegex = /^\w+$/
      if (usernameRegex.test(username))
      {
        setRightUsername(true)
        return true
      }else{
        
        setRightUsername(false)
        return false
      }
    }
  /////////////////////////////////////////

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
    const isFirstNameValid = validateFirstName();
    const isLastNameValid = validateLastName();
    const isEmailValid = validateEmail();
    const isUsernameValid = validateUsername();
    const isPasswordValid = validatePass();

    if(isFirstNameValid && isLastNameValid && isEmailValid && isUsernameValid && isPasswordValid) {
      const formData = {
        username: username,
        password: password,
        name: firstName,
        surname: lastName,
        email: email,
        registered: true
  
      };

      
      fetch('http://localhost:8000/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
        mode: "no-cors"
      })
      .then((res) => console.log(res))
      .then((data) => console.log(data))
      .catch((err) => console.error(err))
    }
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
          focusBorderColor={rightFirstName ? "#FFFBE0" : "#AA0000"}
          borderColor={rightFirstName ? "#FFFBE0" : "#FF0000"}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          id="firstName"
        />
        <Input 
          type="text" 
          placeholder="Last name" 
          _placeholder={{ color: '#FFFBE0' }}
          focusBorderColor={rightFirstName ? "#FFFBE0" : "#AA0000"}
          borderColor={rightLastName ? "#FFFBE0" : "#FF0000"}
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
          focusBorderColor={rightEmail ? "#FFFBE0" : "#AA0000"}
          borderColor={rightEmail ? "#FFFBE0" : "#FF0000"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="email"
        />
        <Text style={{display: rightEmail ? "none" : "block"}} fontSize="sm" fontWeight="bold" color="#CC0000">Invalid email format</Text>
        <Input 
          type="text" 
          placeholder="Username" 
          _placeholder={{ color: '#FFFBE0' }}
          focusBorderColor={rightUsername ? "#FFFBE0" : "#AA0000"}
          borderColor={rightUsername ? "#FFFBE0" : "#FF0000"}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          id="username"
        />
        <InputGroup size='md'>
          <Input 
            type={showPass ? 'text' : 'password'} 
            placeholder='Enter password' 
            _placeholder={{ color: '#FFFBE0' }}
            focusBorderColor={rightPass ? "#FFFBE0" : "#AA0000"}
            borderColor={rightPass ? "#FFFBE0" : "#FF0000"}
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

        <Text style={{display: rightPass ? "none" : "block"}} fontSize="sm" fontWeight="bold" color="#CC0000">Password must be between 8 and 16 characters and include letters, numbers and special characters</Text>

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
