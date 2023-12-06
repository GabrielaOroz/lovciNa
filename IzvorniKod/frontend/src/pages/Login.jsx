import { Flex, Input, InputGroup, InputRightElement, Show, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GiDeerHead } from "react-icons/gi";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Base from "../components/shared/Base";
import FormCard from "../components/shared/FormCard";
import GreenButton from "../components/shared/GreenButton";
import ErrorMessage from "../components/shared/ErrorMessage";

export default function Login() {
  const navigate = useNavigate();

  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    const data = {
      username,
      password,
    };

    setError("");
    if (!username || !password) {
      setError("Please fill out all the required fields.");
      return;
    } else {
      fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then((res) => {
        if (res.ok) {
          navigate("/start");
        } else {
          setError("Incorrect username or password.");
        }
      });
    }
  };

  return (
    <Base>
      <FormCard>
        <Flex justifyContent="center" gap="16px" alignItems="center">
          <Show above="md">
            <GiDeerHead size="30px" />
          </Show>
          <Text fontSize="lg">Start using Wild Track</Text>
          <Show above="md">
            <GiDeerHead size="30px" />
          </Show>
        </Flex>

        <Input
          id="username"
          type="text"
          placeholder="Username"
          _hover={{ borderColor: "#97B3A1" }}
          focusBorderColor="#306844"
          borderColor="#306844"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
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

        <GreenButton onClick={handleSubmit}>Log In</GreenButton>

        <Flex gap="5px" direction="column" align="center">
          <Text display="flex" gap="8px">
            Don't have an account?
            <a href="/register" style={{ color: "#306844" }}>
              <b>Register</b>
            </a>
          </Text>
          <Text display="flex" gap="8px">
            Log in as
            <a href="/admin" style={{ color: "#306844" }}>
              <b>Admin</b>
            </a>
          </Text>
        </Flex>
      </FormCard>
    </Base>
  );
}
