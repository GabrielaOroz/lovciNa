import React, { useEffect, useState } from "react";
import { Box, Button, Card, Flex, Input, Select, Text } from "@chakra-ui/react";
import GreenButton from "../components/shared/GreenButton";
import YellowButton from "../components/shared/YellowButton";
import mockData from "../mockData";
import { useNavigate } from "react-router-dom";
import Header from "../components/shared/Header";

export default function CreateAction() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/auth/current-user", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        //console.log(data);
        setSession(data);
      });
  }, []);

  const hasAccess = session && session.role === "researcher" && session.approved === true;

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    manager: { id: "" },
    requirements: { ON_FOOT: 0, DRON: 0, CAR: 0, MOTORCYCLE: 0, BICYCLE: 0, BOAT: 0, HELICOPTER: 0, AIRPLANE: 0 },
  });
  const [managers, setManagers] = useState(mockData.mockManagers);
  const [error, setError] = useState();

  /* GET DATA */
  //console.log(managers);
  useEffect(() => {
    fetch("http://localhost:8000/researcher/managers", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        //setManagers(data);
      });
  }, []);

  /* SUBMIT */
  const handleSubmit = () => {
    if (Object.values(formData.requirements).some((value) => value > 0) && formData.title && formData.manager.id) {
      setError(false);

      console.log(formData);
      fetch("http://localhost:8000/researcher/create-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      }).then((res) => {
        if (res.ok) {
          navigate("/home");
        }
      });
    } else {
      setError(true);
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <>
      {session && hasAccess && (
        <>
          <Flex justifyContent="center">
            <Header />
          </Flex>
          <Flex justifyContent="center" mt="32px">
            <Card background="#F9F7ED" w="800px" padding="32px" align="center">
              <Input
                id="title"
                type="text"
                placeholder="Action title"
                _hover={{ borderColor: "#97B3A1" }}
                focusBorderColor="#306844"
                borderColor="#306844"
                value={formData.title}
                onChange={handleFormChange}
              />

              <Select
                id="id"
                mt="8px"
                placeholder="Select manager"
                _hover={{ borderColor: "#97B3A1" }}
                focusBorderColor="#306844"
                borderColor="#306844"
                value={formData.manager.id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    manager: {
                      ...formData.manager,
                      id: e.target.value,
                    },
                  })
                }
              >
                {managers &&
                  managers.map((manager) => (
                    <option value={manager.id} key={manager.id}>
                      {manager.name + " " + manager.surname + ", " + manager.station.name}
                    </option>
                  ))}
              </Select>

              <Text fontSize="2xl" mt="16px">
                Requirements
              </Text>

              <Flex gap="8px">
                <Box>
                  <Text mt="16px" align="center">
                    On foot
                  </Text>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="amount of trackers"
                    _hover={{ borderColor: "#97B3A1" }}
                    focusBorderColor="#306844"
                    borderColor="#306844"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        requirements: {
                          ...formData.requirements,
                          ON_FOOT: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </Box>
                <Box>
                  <Text mt="16px" align="center">
                    Bicycle
                  </Text>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="amount of trackers"
                    _hover={{ borderColor: "#97B3A1" }}
                    focusBorderColor="#306844"
                    borderColor="#306844"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        requirements: {
                          ...formData.requirements,
                          BICYCLE: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </Box>
                <Box>
                  <Text mt="16px" align="center">
                    Motorcycle
                  </Text>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="amount of trackers"
                    _hover={{ borderColor: "#97B3A1" }}
                    focusBorderColor="#306844"
                    borderColor="#306844"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        requirements: {
                          ...formData.requirements,
                          MOTORCYCLE: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </Box>
              </Flex>

              <Flex gap="8px">
                <Box>
                  <Text mt="16px" align="center">Car</Text>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="amount of trackers"
                    _hover={{ borderColor: "#97B3A1" }}
                    focusBorderColor="#306844"
                    borderColor="#306844"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        requirements: {
                          ...formData.requirements,
                          CAR: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </Box>
                <Box>
                  <Text mt="16px" align="center">Boat</Text>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="amount of trackers"
                    _hover={{ borderColor: "#97B3A1" }}
                    focusBorderColor="#306844"
                    borderColor="#306844"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        requirements: {
                          ...formData.requirements,
                          BOAT: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </Box>
              </Flex>

              <Flex gap="8px">
                <Box>
                  <Text mt="16px" align="center">Dron</Text>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="amount of trackers"
                    _hover={{ borderColor: "#97B3A1" }}
                    focusBorderColor="#306844"
                    borderColor="#306844"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        requirements: {
                          ...formData.requirements,
                          DRON: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </Box>
                <Box>
                  <Text mt="16px" align="center">Helicopter</Text>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="amount of trackers"
                    _hover={{ borderColor: "#97B3A1" }}
                    focusBorderColor="#306844"
                    borderColor="#306844"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        requirements: {
                          ...formData.requirements,
                          HELICOPTER: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </Box>
                <Box>
                  <Text mt="16px" align="center">Airplane</Text>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="amount of trackers"
                    _hover={{ borderColor: "#97B3A1" }}
                    focusBorderColor="#306844"
                    borderColor="#306844"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        requirements: {
                          ...formData.requirements,
                          AIRPLANE: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </Box>
              </Flex>

              {error && (
                <Text mt="16px" color="red" textAlign="center">
                  Action title, manager and at least one requirement is required.
                </Text>
              )}
              <GreenButton mt="16px" onClick={handleSubmit}>
                Request
              </GreenButton>
            </Card>
          </Flex>
        </>
      )}
      {session && !hasAccess && (
        <Text as="b" color="#306844" align="center" fontSize="xl">
          You do not yet have access to this page.
        </Text>
      )}
      {!session && <Text>You don't have access to this page.</Text>}
    </>
  );
}
