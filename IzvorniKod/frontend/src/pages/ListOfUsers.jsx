import {
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import GreenButton from "../components/shared/GreenButton";
import { useNavigate } from "react-router-dom";


export default function ListOfUsers() {
  const [session, setSession] = useState(null);
  useEffect(() => {
    fetch("http://localhost:8000/auth/current-user", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setSession(data);
      });
  }, []);

  const hasAccess = session && session.admin === true;

  // USER INFO
  const [id, setId] = useState();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState("");

  // LIST AND MODAL
  const [registeredUsers, setRegisteredUsers] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  // VALIDATION
  const [rightEmail, setRightEmail] = useState(true);
  const [rightFirstName, setRightFirstName] = useState(true);
  const [rightLastName, setRightLastName] = useState(true);
  const [rightPass, setRightPass] = useState(true);
  const [rightUsername, setRightUsername] = useState(true);

  // SET USER INFO
  const changeFirstName = (e) => {
    setFirstName(e.target.value);
  };
  const changeLastName = (e) => {
    setLastName(e.target.value);
  };
  const changeUsername = (e) => {
    setUsername(e.target.value);
  };
  const changeEmail = (e) => {
    setEmail(e.target.value);
  };
  const changePassword = (e) => {
    setPassword(e.target.value);
  };
  const inputRef = useRef(null);
  const handleFileUpload = () => {
    inputRef.current.click();
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    e.target.value = "";
    setSelectedFile(file);
  };

  const convertByteArrayToUrl = (photo) => {
    const url = "data:image/jpeg;base64," + photo;
    setPhotoURL(url);
  };

  // VALIDATION FUNCTIONS
  const validateEmail = () => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i;
    if (emailRegex.test(email)) {
      setRightEmail(true);
      return true;
    } else {
      setRightEmail(false);
      return false;
    }
  };
  const validateFirstName = () => {
    const nameRegex =
      /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
    if (nameRegex.test(firstName)) {
      setRightFirstName(true);
      return true;
    } else {
      setRightFirstName(false);
      return false;
    }
  };
  const validateLastName = () => {
    const nameRegex =
      /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
    if (nameRegex.test(lastName)) {
      setRightLastName(true);
      return true;
    } else {
      setRightLastName(false);
      return false;
    }
  };
  const validatePass = () => {
    const passRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,16}$/;
    if (passRegex.test(password) || password.length < 1) {
      setRightPass(true);
      return true;
    } else {
      setRightPass(false);
      return false;
    }
  };
  const validateUsername = () => {
    const usernameRegex = /^\w+$/;
    if (usernameRegex.test(username)) {
      setRightUsername(true);
      return true;
    } else {
      setRightUsername(false);
      return false;
    }
  };
  const clearError = () => {
    setRightEmail(true);
    setRightFirstName(true);
    setRightLastName(true);
    setRightPass(true);
    setRightUsername(true);
  };

  // ONCLICK
  const handleUsers = () => {
    fetch("http://localhost:8000/admin/registeredUsers", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setRegisteredUsers(data);
      });
  };

  const handleApproval = (id, role) => {
    const data = {
      id,
      role,
      approved: true,
    };
    fetch("http://localhost:8000/admin/approved", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    }).then((res) => {
      if (res.ok) {
        handleUsers();
      }
    });
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("selectedFile", selectedFile);
    formData.append("email", email);
    formData.append("username", username);
    formData.append("password", password);

    fetch("http://localhost:8000/admin/newInfo", {
      method: "PUT",
      body: formData,
      credentials: "include",
    }).then((res) => {
      if (res.ok) {
        handleUsers();
      }
    });
  };

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
    <>
      {session && hasAccess && (
        <Box bgImage="url(/forest.jpg)" bgPosition="center" minH="100vh" display="flex" justifyContent="center">
          <Card
            w={{ base: "500px" }}
            background="#f9f7e8"
            alignSelf="center"
            padding="20px"
            display="flex"
            flexDirection="column"
            justify="center"
            align="center"
          >
            <GreenButton onClick={logout}>Logout</GreenButton>
            <Text fontSize="2xl">REGISTERED USERS:</Text>
            <Button marginTop="8px" marginBottom="8px" colorScheme="green" onClick={() => handleUsers()}>
              Load all registered users.
            </Button>
            <Divider color="green" />
            {registeredUsers && (
              <>
                {registeredUsers.map((user) => (
                  <div key={user.id}>
                    <Flex gap="5px" align="center">
                      <Button
                        variant="unstyled"
                        _hover={{ color: "green" }}
                        onClick={() => {
                          onOpen();
                          setId(user.id);
                          setFirstName(user.name);
                          setLastName(user.surname);
                          setUsername(user.username);
                          setEmail(user.email);
                          setRole(user.role);
                          convertByteArrayToUrl(user.photo);
                        }}
                        p="10px"
                      >
                        {user.name} {user.surname}
                      </Button>
                      {(user.role === "manager" || user.role === "researcher") && !user.approved && (
                        <Button onClick={() => handleApproval(user.id, user.role)} colorScheme="green" m="10px">
                          Approve role: {user.role}
                        </Button>
                      )}
                    </Flex>
                    <Modal
                      scrollBehavior="inside"
                      blockScrollOnMount={false}
                      closeOnOverlayClick={false}
                      isOpen={isOpen}
                      onClose={() => {
                        clearError();
                        setPassword("");
                        setSelectedFile("");
                        onClose();
                      }}
                    >
                      <ModalOverlay />
                      <ModalContent>
                        <ModalHeader>USER INFO</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                        <Text mb="8px">Email: {email}</Text>
                        <Text mb="8px">Role: {role}</Text>
                          <Input
                            marginBottom="10px"
                            defaultValue={firstName}
                            onChange={changeFirstName}
                            placeholder="First Name"
                          />
                          <Text
                            marginBottom="10px"
                            style={{ display: rightFirstName ? "none" : "block" }}
                            fontSize="sm"
                            fontWeight="bold"
                            color="#CC0000"
                          >
                            First name required.
                          </Text>
                          <Input
                            marginBottom="10px"
                            defaultValue={lastName}
                            onChange={changeLastName}
                            placeholder="Last Name"
                          />
                          <Text
                            marginBottom="10px"
                            style={{ display: rightLastName ? "none" : "block" }}
                            fontSize="sm"
                            fontWeight="bold"
                            color="#CC0000"
                          >
                            Last name required.
                          </Text>
                          <Input
                            marginBottom="10px"
                            defaultValue={username}
                            onChange={changeUsername}
                            placeholder="Username"
                          />
                          <Text
                            marginBottom="10px"
                            style={{ display: rightUsername ? "none" : "block" }}
                            fontSize="sm"
                            fontWeight="bold"
                            color="#CC0000"
                          >
                            Username required.
                          </Text>
                          <Text
                            marginBottom="10px"
                            style={{ display: rightEmail ? "none" : "block" }}
                            fontSize="sm"
                            fontWeight="bold"
                            color="#CC0000"
                          >
                            Invalid email format.
                          </Text>
                          <Input
                            marginBottom="10px"
                            defaultValue={password}
                            onChange={changePassword}
                            placeholder="Password"
                          />
                          <Text
                            marginBottom="10px"
                            style={{ display: rightPass ? "none" : "block" }}
                            fontSize="sm"
                            fontWeight="bold"
                            color="#CC0000"
                          >
                            Password must be between 8 and 16 characters and include letters(A-Z), numbers(0-9) and
                            special characters(!,@,#,$,%,^,&,*).
                          </Text>

                          <Input
                            style={{ display: "none" }}
                            type="file"
                            ref={inputRef}
                            onChange={handleFileChange}
                            id="file"
                          />
                          <Button marginBottom="10px" onClick={handleFileUpload} bgColor="#F1EDD4" border="0">
                            Upload new profile picture
                          </Button>

                          {!selectedFile && <Image maxHeight="300px" src={photoURL} />}

                          {selectedFile && (
                            <Image
                              maxHeight="300px"
                              src={selectedFile && URL.createObjectURL(selectedFile)}
                              alt={selectedFile ? selectedFile.name : ""}
                            />
                          )}
                        </ModalBody>
                        <ModalFooter>
                          <Button
                            variant="ghost"
                            onClick={() => {
                              clearError();
                              setPassword("");
                              setSelectedFile("");
                              onClose();
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            colorScheme="green"
                            onClick={() => {
                              validateFirstName();
                              validateLastName();
                              validateEmail();
                              validateUsername();
                              validatePass();
                              if (
                                validateFirstName() &&
                                validateLastName() &&
                                validateEmail() &&
                                validateUsername() &&
                                validatePass()
                              ) {
                                setPassword("");
                                setSelectedFile("");
                                handleSubmit();
                                onClose();
                              }
                            }}
                          >
                            Confirm
                          </Button>
                        </ModalFooter>
                      </ModalContent>
                    </Modal>
                  </div>
                ))}
              </>
            )}
          </Card>
        </Box>
      )}
      {(!session || !hasAccess) && (
        <Box bgImage="url(/forest.jpg)" bgPosition="center" minH="100vh" display="flex" justifyContent="center">
          <Text as="b" fontSize="3xl" p="32px">You don't have access to this page.</Text>
        </Box>
      )}
    </>
  );
}
