import { Card, FormControl } from "@chakra-ui/react";
export default function Form({children}) {
    return (
        <Card 
            padding="20px" 
            w={{base: "300px", md: "400px", lg: "500px"}}
            margin="30px" 
            alignSelf="center" 
            bgGradient="linear(to-t, green.500, green.800)"
            color="white"
            boxShadow='dark-lg'
        >
            <FormControl display="flex" flexDirection="column" gap="20px">
                {children}
            </FormControl>
        </Card>
    )
}
