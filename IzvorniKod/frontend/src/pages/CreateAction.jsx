import React, { useEffect, useState } from "react";
import { Box, Button, Card, Flex, Input, Select, Text } from "@chakra-ui/react";
import GreenButton from "../components/shared/GreenButton";
import YellowButton from "../components/shared/YellowButton";
import mockData from "../mockData";
import { useNavigate } from "react-router-dom";

export default function CreateAction() {
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

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    actionTitle: "",
    managerId: "",
    requirements: [],
  });
  const [requirement, setRequirement] = useState([]);
  const [managers, setManagers] = useState(mockData.mockManagers);
  const [error, setError] = useState();

  /* GET DATA */
  console.log(managers);
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
    if (
      formData.requirements.every((req) => req.medium && req.amount > 0) &&
      formData.actionTitle &&
      formData.managerId &&
      formData.requirements.length > 0
    ) {
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

  const handleRequirementChange = (e, index, property) => {
    const updatedRequirement = [...requirement];
    if (updatedRequirement[index]) {
      updatedRequirement[index] = {
        ...updatedRequirement[index],
        [property]: property === "amount" ? parseInt(e.target.value) : e.target.value,
      };

      setRequirement(updatedRequirement);
      setFormData({ ...formData, requirements: updatedRequirement });
    }
  };

  const addRequirement = () => {
    setRequirement([...requirement, { medium: "", amount: "" }]);
  };

  const removeRequirement = (index) => {
    const updatedRequirement = requirement.filter((item, i) => index !== i);
    setRequirement(updatedRequirement);
    setFormData({ ...formData, requirements: updatedRequirement });
  };

  return (
    <>
      {session && session.role == "researcher" && session.approved && (
        <Flex justifyContent="center" alignItems="center" minHeight="100vh">
          <Card background="#F9F7ED" w="500px" padding="32px" align="center">
            <Input
              id="actionTitle"
              type="text"
              placeholder="Action title"
              _hover={{ borderColor: "#97B3A1" }}
              focusBorderColor="#306844"
              borderColor="#306844"
              value={formData.actionTitle}
              onChange={handleFormChange}
            />

            <Select
              id="managerId"
              mt="8px"
              placeholder="Select manager"
              _hover={{ borderColor: "#97B3A1" }}
              focusBorderColor="#306844"
              borderColor="#306844"
              value={formData.managerId}
              onChange={handleFormChange}
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
            {requirement.map((req, index) => (
              <Box
                key={index}
                position="relative"
                border="solid 1px #306844"
                borderRadius="8px"
                p="16px"
                w="300px"
                mt="8px"
              >
                <Button
                  position="absolute"
                  top="0px"
                  right="0px"
                  variant="unstyled"
                  onClick={() => removeRequirement(index)}
                >
                  ✖
                </Button>

                <Text fontSize="lg" textAlign="center">
                  Medium
                </Text>

                <Select
                  id="medium"
                  value={req.medium}
                  placeholder="Select"
                  _hover={{ borderColor: "#97B3A1" }}
                  focusBorderColor="#306844"
                  borderColor="#306844"
                  onChange={(e) => handleRequirementChange(e, index, "medium")}
                >
                  <option>by foot</option>
                  <option>dron</option>
                  <option>car</option>
                  <option>cross motor</option>
                  <option>boat</option>
                  <option>helicopter</option>
                </Select>
                <Text fontSize="lg" mt="16px" textAlign="center">
                  Amount
                </Text>
                <Input
                  id="amount"
                  type="number"
                  value={req.amount}
                  _hover={{ borderColor: "#97B3A1" }}
                  focusBorderColor="#306844"
                  borderColor="#306844"
                  onChange={(e) => handleRequirementChange(e, index, "amount")}
                />
              </Box>
            ))}

            <YellowButton mt="16px" onClick={addRequirement}>
              Add requirement
            </YellowButton>
            {error && (
              <Text mt="16px" color="red">
                All fields are required
              </Text>
            )}
            <GreenButton mt="16px" onClick={handleSubmit}>
              Request
            </GreenButton>
          </Card>
        </Flex>
      )}
      {!session ||
        !session.role == "researcher" ||
        !session.approved(
          <Box>
            <Text>You don't have access to this page.</Text>
          </Box>
        )}
    </>
  );
}
