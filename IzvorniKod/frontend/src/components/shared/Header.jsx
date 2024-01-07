import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Card, Flex, Heading } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import GreenButton from "./GreenButton";

export default function Header() {
  const navigate = useNavigate();

  const logout = () => {
    fetch("http://localhost:8000/auth/logout", {
      method: "POST",
      credentials: "include",
    }).then((res) => {
      if (res.ok) {
       navigate("/login");
      }
    });
  };

  return (
    <Card
      background="#F9F7ED"
      w={{ base: "400px", md: "800px", lg: "1200px" }}
      alignSelf="center"
      padding="16px"
      display="flex"
      align="center"
      justify="space-between"
      direction="row"
    >
      <Flex align="center" justify="center" gap="32px">
        <Heading pt="16px" color="#306844" fontFamily="Nature">
          <Link to="/home">WILD TRACK</Link>
        </Heading>
        <Breadcrumb separator=" " color="#306844">
          <BreadcrumbItem>
            <BreadcrumbLink href="/home" fontSize="xl">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink href="/profile" fontSize="xl">
              Profile
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Flex>
      <GreenButton onClick={logout}>Logout</GreenButton>
    </Card>
    
  );
}
