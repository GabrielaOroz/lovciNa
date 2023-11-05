import FormCard from "../FormCard"
import Base from "../Base"
import { Text, Card } from "@chakra-ui/react"

export default function Confirm(){
    return(
        <Base>
            <Card w={{base: "300px", md: "600px", lg: "800px"}} background="#f9f7e8" alignSelf="center"
            padding ="1rem">
                <Text fontSize="3rem" alignSelf="center">Account verification</Text>
                <Text alignSelf="center">A confirmation link has been sent to your email. </Text>
                <Text alignSelf="center">Check your email and confirm registration.</Text>
            </Card>
        </Base>
    )
}