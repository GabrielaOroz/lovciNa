import { Flex, Input, InputGroup, InputRightElement, Show, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GiHummingbird } from "react-icons/gi";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Base from "../components/shared/Base";
import FormCard from "../components/shared/FormCard";
import GreenButton from "../components/shared/GreenButton";
import ErrorMessage from "../components/shared/ErrorMessage";

export default function Admin() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");

    const data = {
      password,
    };

    fetch("http://localhost:8000/admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify(data),
    }).then((res) => {
      if (res.ok) {
        navigate("/admin/list-of-users");
      } else {
        setError("Password incorrect.");
      }
    });
  };

  return (
    <Base>
      <FormCard>
        <Flex justifyContent="center" gap="16px" alignItems="center">
          <Show above="md">
            <GiHummingbird size="30px" />
          </Show>
          <Text fontSize="lg">Log in as administator</Text>
          <Show above="md">
            <GiHummingbird style={{ transform: "scaleX(-1)" }} size="30px" />
          </Show>
        </Flex>

        <InputGroup size="md">
          <Input
            id="password"
            type={showPass ? "text" : "password"}
            placeholder="Enter password"
            _hover={{ borderColor: "#97B3A1" }}
            focusBorderColor="#306844"
            borderColor="#306844"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement>
            {showPass ? (
              <FaEye onClick={() => setShowPass(!showPass)} style={{ cursor: "pointer" }} />
            ) : (
              <FaEyeSlash onClick={() => setShowPass(!showPass)} style={{ cursor: "pointer" }} />
            )}
          </InputRightElement>
        </InputGroup>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <GreenButton width="200px" alignSelf="center" onClick={handleSubmit}>
          Log In
        </GreenButton>
      </FormCard>
    </Base>
  );
}
