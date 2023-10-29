import { Button, HStack, Input, Radio, RadioGroup, Text } from "@chakra-ui/react";
import Base from "./Base"
import Form from "./Form"
import { useRef, useState } from "react";

export default function Register() {
  const inputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleClick = () => {
    inputRef.current.click();
  }

  const handleFileChange = event => {
    const file = event.target.files && event.target.files[0];
    if (!file){
      return;
    }
    setSelectedFile(file);
  }

  return (
    <Base>
      <Form>
      <Text alignSelf="center" fontSize="lg">Register to Wild Track</Text>
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
      <Input style={{display: 'none'}} type="file" ref={inputRef} onChange={handleFileChange}/>
      <Button onClick={handleClick}>Upload profile picture</Button>
      {selectedFile && (
          <Text color="white" alignSelf="center">
            Profile picture uploaded: {selectedFile.name}
          </Text>
        )}

      </Form>
    </Base>
  )
}
