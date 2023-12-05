import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Radio,
  RadioGroup,
  Show,
  Stack,
  Text,
} from "@chakra-ui/react";

import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Base from "../Base";
import FormCard from "../FormCard";
import GreenButton from "../GreenButton";
import YellowButton from "../YellowButton";
import ErrorMessage from "../ErrorMessage";

import { GiBearFace } from "react-icons/gi";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Register() {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [showPass, setShowPass] = useState(false);
  const [userExists, setUserExists] = useState("");
  const [errors, setErrors] = useState({});

  const [data, setData] = useState({
    role: "tracker",
    firstName: "",
    lastName: "",
    selectedFile: null,
    email: "",
    username: "",
    password: "",
  });

  const handleFileUpload = () => {
    inputRef.current.click();
  };

  const validateForm = () => {
    const validationRules = {
      firstName: /^[a-zA-ZčćšžĆČŠŽđĐ]+$/u,
      lastName: /^[a-zA-ZčćšžĆČŠŽđĐ]+$/u,
      email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i,
      username: /^\w+$/,
      password: /^(?=.*[0-9])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,16}$/,
    };

    const newErrors = Object.keys(validationRules).reduce((acc, key) => {
      if (!validationRules[key].test(data[key])) {
        if (key === "password") {
          acc[key] =
            "Password must be at least 8 characters long, include letters, numbers and special characters (!,@,#,$,%,^,&,*).";
        } else {
          acc[key] = `Invalid ${key} format.`;
        }
      }
      return acc;
    }, {});

    if (!data.selectedFile) {
      newErrors.picture = "Please, upload your profile picture.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    setUserExists();
    setErrors({});
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("role", data.role);
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("selectedFile", data.selectedFile);
    formData.append("email", data.email);
    formData.append("username", data.username);
    formData.append("password", data.password);

    fetch("http://localhost:8000/auth/register", {
      method: "POST",
      body: formData,
    }).then((res) => {
      if (res.ok) {
        navigate("/confirm");
      } else {
        setUserExists("User already exists.");
      }
    });
  };

  return (
    <Base>
      <FormCard>
        <Flex justifyContent="center" alignItems="center" gap="16px">
          <Show above="md">
            <GiBearFace size="30px" />
          </Show>
          <Text fontSize="lg">Create your account</Text>
          <Show above="md">
            <GiBearFace size="30px" />
          </Show>
        </Flex>

        <RadioGroup
          alignSelf="center"
          value={data.role}
          onChange={(newValue) =>
            setData({
              ...data,
              role: newValue,
            })
          }
        >
          <Stack direction={["column", "column", "column", "row"]} spacing="16px" align="center">
            <Radio colorScheme="green" value="tracker">
              Tracker
            </Radio>
            <Radio colorScheme="yellow" value="researcher">
              Researcher
            </Radio>
            <Radio colorScheme="red" value="manager">
              Station Manager
            </Radio>
          </Stack>
        </RadioGroup>

        <Input
          id="firstName"
          type="text"
          placeholder="First name"
          _hover={errors.firstName ? { borderColor: "#AA0000" } : { borderColor: "#97B3A1" }}
          focusBorderColor={errors.firstName ? "#AA0000" : "#306844"}
          borderColor={errors.firstName ? "#FF0000" : "#306844"}
          value={data.firstName}
          onChange={(e) =>
            setData({
              ...data,
              firstName: e.target.value,
            })
          }
        />

        <Input
          id="lastName"
          type="text"
          placeholder="Last name"
          _hover={errors.firstName ? { borderColor: "#AA0000" } : { borderColor: "#97B3A1" }}
          focusBorderColor={errors.lastName ? "#AA0000" : "#306844"}
          borderColor={errors.lastName ? "#FF0000" : "#306844"}
          value={data.lastName}
          onChange={(e) =>
            setData({
              ...data,
              lastName: e.target.value,
            })
          }
        />

        <Input
          id="file"
          type="file"
          ref={inputRef}
          style={{ display: "none" }}
          onChange={(e) => {
            setData({
              ...data,
              selectedFile: e.target.files[0],
            });
            e.target.value = "";
          }}
        />
        <YellowButton onClick={handleFileUpload}>Upload profile picture</YellowButton>
        <img
          src={data.selectedFile && URL.createObjectURL(data.selectedFile)}
          alt={data.selectedFile ? data.selectedFile.name : ""}
        />
        {data.selectedFile && (
          <YellowButton
            onClick={() =>
              setData({
                ...data,
                selectedFile: "",
              })
            }
          >
            Remove profile picture
          </YellowButton>
        )}
        {errors.picture && <ErrorMessage>{errors.picture}</ErrorMessage>}

        <Input
          id="email"
          type="email"
          placeholder="Email address"
          _hover={errors.firstName ? { borderColor: "#AA0000" } : { borderColor: "#97B3A1" }}
          focusBorderColor={errors.email ? "#AA0000" : "#306844"}
          borderColor={errors.email ? "#FF0000" : "#306844"}
          value={data.email}
          onChange={(e) =>
            setData({
              ...data,
              email: e.target.value,
            })
          }
        />
        {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}

        <Input
          id="username"
          type="text"
          placeholder="Username"
          _hover={errors.firstName ? { borderColor: "#AA0000" } : { borderColor: "#97B3A1" }}
          focusBorderColor={errors.username ? "#AA0000" : "#306844"}
          borderColor={errors.username ? "#FF0000" : "#306844"}
          value={data.username}
          onChange={(e) =>
            setData({
              ...data,
              username: e.target.value,
            })
          }
        />

        <InputGroup size="md">
          <Input
            id="password"
            type={showPass ? "text" : "password"}
            placeholder="Enter password"
            _hover={errors.firstName ? { borderColor: "#AA0000" } : { borderColor: "#97B3A1" }}
            focusBorderColor={errors.password ? "#AA0000" : "#306844"}
            borderColor={errors.password ? "#FF0000" : "#306844"}
            value={data.password}
            onChange={(e) =>
              setData({
                ...data,
                password: e.target.value,
              })
            }
          />
          <InputRightElement>
            {showPass ? (
              <FaEye onClick={() => setShowPass(!showPass)} style={{ cursor: "pointer" }} />
            ) : (
              <FaEyeSlash onClick={() => setShowPass(!showPass)} style={{ cursor: "pointer" }} />
            )}
          </InputRightElement>
        </InputGroup>
        {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}

        <GreenButton onClick={handleSubmit}>Submit</GreenButton>
        {userExists && <ErrorMessage>{userExists}</ErrorMessage>}

        <Box display="flex" justifyContent="center">
          <Text display="flex" gap="8px">
            Already have an account?
            <a href="/login" style={{ color: "#306844" }}>
              <b>Log in</b>
            </a>
          </Text>
        </Box>
      </FormCard>
    </Base>
  );
}
