import { Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Base from "../components/shared/Base";
import GreenButton from "../components/shared/GreenButton";
import YellowButton from "../components/shared/YellowButton";

export default function Start() {
  return (
    <Base>
      <Flex alignSelf="center" gap="64px" marginBottom="32px">
        <Link to="/login">
          <GreenButton width="160px" height="48px" fontSize="20px">
            Sign in
          </GreenButton>
        </Link>
        <Link to="/register">
          <YellowButton width="160px" height="48px" fontSize="20px">
            Register
          </YellowButton>
        </Link>
      </Flex>
    </Base>
  );
}
