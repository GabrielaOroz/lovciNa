import React, { useState } from "react";
import { Box, Button, Card, Flex, Input, Select, Text } from "@chakra-ui/react";
import GreenButton from "../components/shared/GreenButton";
import YellowButton from "../components/shared/YellowButton";
import mockData from "../mockData";

export default function CreateAction() {
  const [formData, setformData] = useState({
    actionTitle: "",
    managerId: "",
    requirements: [],
  });
  const [requirement, setRequirement] = useState([]);

  const handleFormChange = (e) => {
    setformData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRequirementChange = (e, index, property) => {
    const updatedRequirement = [...requirement];
    if (updatedRequirement[index]) {
      updatedRequirement[index] = {
        ...updatedRequirement[index],
        [property]: property === "amount" ? parseInt(e.target.value) : e.target.value,
      };

      setRequirement(updatedRequirement);
      setformData({ ...formData, requirements: updatedRequirement });
    }
  };

  const addRequirement = () => {
    setRequirement([...requirement, {}]);
  };

  const removeRequirement = (index) => {
    const updatedRequirement = requirement.filter((item, i) => index !== i);
    setRequirement(updatedRequirement);
    setformData({ ...formData, requirements: updatedRequirement });
  };

  const handleSubmit = () => {
    console.log(formData);
  };

  return (
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
          {mockData.mockManagers.map((manager) => (
            <option value={manager.id} key={manager.id}>
              {manager.name} {manager.surname}, {manager.station.name}
            </option>
          ))}
        </Select>

        <Text fontSize="2xl" mt="16px">
          Requirements
        </Text>
        {requirement.map((input, index) => (
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
              value={input.medium}
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
              value={input.amount}
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
        <GreenButton mt="8px" onClick={handleSubmit}>
          Request
        </GreenButton>
      </Card>
    </Flex>
  );
}
