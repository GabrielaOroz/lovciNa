import {Text, Card, CardHeader, CardBody, CardFooter, Heading, Button, Flex} from "@chakra-ui/react"
import MainBase from "../MainBase"

export default function Start(){
    return(
        <>
        <Text p="20px" textAlign="center">In building... see you soon.</Text>
        {/*<MainBase>
            <Text 
                color="green.700" 
                fontSize={{base: "2xl", md: "4xl", lg: "5xl"}} 
                fontFamily="Century Gothic" 
                alignSelf="center">Tracker</Text>
            {/* <Text 
                fontSize={{base: "1xl", md: "2xl", lg: "3xl"}}
                color="teal">
                    Action
            </Text> *}
            
            <Card w={{base: "300px", md: "450px", lg: "700px"}} alignSelf="center">
                <CardHeader>
                <Text fontSize="1.5rem">Action title</Text>
                </CardHeader>
                <CardBody>
                <Text>View a summary of all your actions over the last month.</Text>
                </CardBody>
                <CardFooter display="flex" justifyContent="space-evenly" >
                    <Button>Show map</Button>
                    <Button>Mark path</Button>
                    <Button>Leave</Button>
                </CardFooter>
            </Card>
        </MainBase>*/}
        </>
    )
}