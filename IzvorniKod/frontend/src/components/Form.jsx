import { Button, Card, FormControl, HStack, Input, InputGroup, InputRightElement, Radio, RadioGroup } from "@chakra-ui/react";
import { useState } from "react";

export default function Form({children}) {
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);

    return (
        <Card 
            padding="20px" 
            width="500px"
            margin="30px" 
            alignSelf="center" 
            bgGradient="linear(to-t, green.500, green.800)"
            color="white"
            boxShadow='dark-lg'
        >
            <FormControl display="flex" flexDirection="column" gap="20px">
            {children}
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
                <Button h='1.75rem' size='sm' onClick={handleClick}>
                    {show ? 'Hide' : 'Show'}
                </Button>
                </InputRightElement>
            </InputGroup>

            </FormControl>
        </Card>
    )
}
