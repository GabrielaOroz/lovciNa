import React, { useEffect, useState } from "react";
import mockData from "../mockData";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Select,
  Text,
  Textarea,
  chakra,
} from "@chakra-ui/react";
import GreenButton from "../components/shared/GreenButton";
import YellowButton from "../components/shared/YellowButton";
import { MapContainer, TileLayer, useMapEvents, useMap } from "react-leaflet";
import { createControlComponent } from "@react-leaflet/core";
import L from "leaflet";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import Multiselect from "multiselect-react-dropdown";
import Header from "../components/shared/Header";

export default function NewActions() {
  const [session, setSession] = useState(null);
  useEffect(() => {
    fetch("http://localhost:8000/auth/current-user", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setSession(data);
      });
  }, []);
  const hasAccess = session && session.role === "researcher" && session.approved === true;

  /* SUBMIT */
  const handleSubmit = (actionId) => {
    setFormData((prevFormData) => {
      return prevFormData.map((action) => {
        if (action.id === actionId) {
          return {
            ...action,
            existingSpecies: selectedSpeciesMap[actionId],
            existingIndividuals: selectedIndividualsMap[actionId],
            existingHabitats: selectedHabitatsMap[actionId],
          };
        }
        return action;
      });
    });

    const action = [...formData];
    const actionToSubmit = action.find((action) => action.id === actionId);
    //console.log(actionToSubmit);

    fetch("http://localhost:8000/researcher/finished-action", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(actionToSubmit),
    }).then((res) => {
      if (res.ok) {
        window.location.reload();
      }
    });
  };

  /* DATA */
  const [formData, setFormData] = useState(mockData.mockNewActions);
  //console.log(formData);
  useEffect(() => {
    fetch("http://localhost:8000/researcher/unfinished-actions", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        //console.log(data);
        //setFormData(data);
      });
  }, []);

  const [existingSpecies, setExistingSpecies] = useState(mockData.mockSpecies);
  const [existingIndividuals, setExistingIndividuals] = useState(mockData.mockIndividuals);
  const [existingHabitats, setExistingHabitats] = useState(mockData.mockHabitats);
  useEffect(() => {
    fetch("http://localhost:8000/researcher/species", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        //setExistingSpecies(data);
      });
  }, []);
  useEffect(() => {
    fetch("http://localhost:8000/researcher/individuals", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        //setExistingIndividuals(data);
      });
  }, []);
  useEffect(() => {
    fetch("http://localhost:8000/researcher/habitats", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        //setExistingHabitats(data);
      });
  }, []);

  /* EXISTING SPECIES */
  const [selectedSpeciesMap, setSelectedSpeciesMap] = useState({});
  const handleSpecies = (actionId, selectedSpecies) => {
    setSelectedSpeciesMap((prevMap) => ({
      ...prevMap,
      [actionId]: selectedSpecies,
    }));
  };

  /* EXISTING INDIVIDUALS */
  const [selectedIndividualsMap, setSelectedIndividualsMap] = useState({});
  const handleIndividuals = (actionId, selectedIndividuals) => {
    setSelectedIndividualsMap((prevMap) => ({
      ...prevMap,
      [actionId]: selectedIndividuals,
    }));
  };

  /* EXISTING HABITATS */
  const [selectedHabitatsMap, setSelectedHabitatsMap] = useState({});
  const handleHabitats = (actionId, selectedHabitats) => {
    setSelectedHabitatsMap((prevMap) => ({
      ...prevMap,
      [actionId]: selectedHabitats,
    }));
  };

  /* CHANGING FORM DATA */
  const handleFormChange = (actionId, field, value) => {
    setFormData((prevFormData) => {
      return prevFormData.map((action) => {
        if (action.id === actionId) {
          return {
            ...action,
            [field]: value,
          };
        }
        return action;
      });
    });
  };

  /* CHOOSING SPECIES/INDIVIDUALS/HABITATS AND THEIR DATA*/
  const [itemType, setItemType] = useState(() =>
    formData.reduce((obj, action) => {
      obj[action.id] = "species"; //every action gets species as a default
      return obj;
    }, {})
  );

  const handleItemTypeChange = (actionId, value) => {
    setItemType((prevItemTypes) => ({
      ...prevItemTypes,
      [actionId]: value,
    }));
  };

  const handleChange = (event, actionId, itemIndex, field, itemType) => {
    const { value } = event.target;
    const updatedFormData = [...formData];
    const actionToUpdate = updatedFormData.find((action) => action.id === actionId); //returns reference

    if (actionToUpdate) {
      let targetItem;

      if (itemType === "species") {
        targetItem = actionToUpdate.species[itemIndex];
      } else if (itemType === "habitats") {
        targetItem = actionToUpdate.habitats[itemIndex];
      } else if (itemType === "individuals") {
        targetItem = actionToUpdate.individuals[itemIndex];
      }

      if (targetItem) {
        targetItem[field] = value;
        setFormData(updatedFormData);
      }
    }
  };

  const add = (actionId, itemType) => {
    const updatedFormData = [...formData];
    const actionToUpdate = updatedFormData.find((action) => action.id === actionId);

    if (actionToUpdate) {
      if (itemType === "species") {
        actionToUpdate.species.push({
          name: "",
          description: "",
          photo: "",
        });
      } else if (itemType === "habitats") {
        actionToUpdate.habitats.push({
          name: "",
          description: "",
          photo: "",
        });
      } else if (itemType === "individuals") {
        actionToUpdate.individuals.push({
          name: "",
          species: "",
          description: "",
          photo: "",
          comments: [],
        });
      }

      setFormData(updatedFormData);
    }
  };

  const remove = (actionId, itemIndex, itemType) => {
    const updatedFormData = [...formData];
    const actionToUpdate = updatedFormData.find((action) => action.id === actionId);

    if (actionToUpdate) {
      if (itemType === "species" && actionToUpdate.species.length >= itemIndex) {
        actionToUpdate.species.splice(itemIndex, 1);
      } else if (itemType === "habitats" && actionToUpdate.habitats.length >= itemIndex) {
        actionToUpdate.habitats.splice(itemIndex, 1);
      } else if (itemType === "individuals" && actionToUpdate.individuals.length >= itemIndex) {
        actionToUpdate.individuals.splice(itemIndex, 1);
      }

      setFormData(updatedFormData);
    }
  };

  /* COMMENTS FOR INDIVIDUALS */
  const handleCommentChange = (event, actionId, itemIndex, commentIndex) => {
    const { value } = event.target;
    const updatedFormData = [...formData];
    const actionToUpdate = updatedFormData.find((action) => action.id === actionId);

    if (actionToUpdate && actionToUpdate.individuals[itemIndex]) {
      actionToUpdate.individuals[itemIndex].comments[commentIndex] = value;
      setFormData(updatedFormData);
    }
  };

  const removeComment = (actionId, itemIndex, commentIndex) => {
    const updatedFormData = [...formData];
    const actionToUpdate = updatedFormData.find((action) => action.id === actionId);

    if (actionToUpdate && actionToUpdate.individuals[itemIndex]) {
      actionToUpdate.individuals[itemIndex].comments.splice(commentIndex, 1);
      setFormData(updatedFormData);
    }
  };

  const addComment = (actionId, itemIndex) => {
    const updatedFormData = [...formData];
    const actionToUpdate = updatedFormData.find((action) => action.id === actionId);

    if (actionToUpdate && actionToUpdate.individuals[itemIndex]) {
      actionToUpdate.individuals[itemIndex].comments.push("");
      setFormData(updatedFormData);
    }
  };

  /* PHOTOS */
  const handlePhotoChange = async (event, actionId, itemIndex, itemType) => {
    const file = event.target.files[0];
    const imageURL = URL.createObjectURL(file);

    const response = await fetch(imageURL);
    const blob = await response.blob();

    const reader = new FileReader();
    reader.readAsDataURL(blob);

    reader.onloadend = () => {
      const base64data = reader.result;

      const updatedFormData = formData.map((action) => {
        if (action.id === actionId) {
          return {
            ...action,
            [itemType]: action[itemType].map((item, index) => {
              if (index === itemIndex) {
                return {
                  ...item,
                  photo: base64data,
                };
              }
              return item;
            }),
          };
        }
        return action;
      });

      setFormData(updatedFormData);
    };
  };

  /* TRACKER TASKS */
  const handleTaskChange = (event, actionId, trackerId, taskIndex, property) => {
    const { value } = event.target;
    const updatedFormData = [...formData];
    const actionToUpdate = updatedFormData.find((action) => action.id === actionId);

    if (actionToUpdate && actionToUpdate.trackers.find((tracker) => tracker.id === trackerId)) {
      actionToUpdate.trackers.find((tracker) => tracker.id === trackerId).tasks[taskIndex][property] = value;
      setFormData(updatedFormData);
    }
  };

  const removeTask = (actionId, trackerId, taskIndex) => {
    const updatedFormData = [...formData];
    const actionToUpdate = updatedFormData.find((action) => action.id === actionId);

    if (actionToUpdate && actionToUpdate.trackers.find((tracker) => tracker.id === trackerId)) {
      actionToUpdate.trackers.find((tracker) => tracker.id === trackerId).tasks.splice(taskIndex, 1);
      setFormData(updatedFormData);
    }
  };

  const addTask = (actionId, trackerId) => {
    const updatedFormData = [...formData];
    const actionToUpdate = updatedFormData.find((action) => action.id === actionId);

    if (actionToUpdate && actionToUpdate.trackers.find((tracker) => tracker.id === trackerId)) {
      const newTask = {
        title: "",
        content: "Set up a camera",
        comments: [],
        coordinatesStart: [45, 15],
        coordinatesFinish: [45.2, 15.2],
      };
      actionToUpdate.trackers.find((tracker) => tracker.id === trackerId).tasks = [
        ...actionToUpdate.trackers.find((tracker) => tracker.id === trackerId).tasks,
        newTask,
      ];
      setFormData(updatedFormData);
    }
  };

  /* COMMENTS FOR TASKS */
  const handleTaskCommentChange = (e, actionId, trackerId, taskIndex, commentIndex) => {
    const { value } = e.target;
    const updatedFormData = [...formData];
    const actionToUpdate = updatedFormData.find((action) => action.id === actionId);
    const trackerToUpdate = actionToUpdate.trackers.find((tracker) => tracker.id === trackerId);

    if (trackerToUpdate && trackerToUpdate.tasks[taskIndex]) {
      actionToUpdate.trackers.find((tracker) => tracker.id === trackerId).tasks[taskIndex].comments[commentIndex] =
        value;
      setFormData(updatedFormData);
    }
  };

  const removeTaskComment = (actionId, taskIndex, trackerId, commentIndex) => {
    const updatedFormData = [...formData];
    const actionToUpdate = updatedFormData.find((action) => action.id === actionId);
    const trackerToUpdate = actionToUpdate.trackers.find((tracker) => tracker.id === trackerId);

    if (trackerToUpdate && trackerToUpdate.tasks[taskIndex]) {
      actionToUpdate.trackers
        .find((tracker) => tracker.id === trackerId)
        .tasks[taskIndex].comments.splice(commentIndex, 1);
      setFormData(updatedFormData);
    }
  };

  const addTaskComment = (actionId, trackerId, taskIndex) => {
    const updatedFormData = [...formData];
    const actionToUpdate = updatedFormData.find((action) => action.id === actionId);
    const trackerToUpdate = actionToUpdate.trackers.find((tracker) => tracker.id === trackerId);

    if (trackerToUpdate && trackerToUpdate.tasks[taskIndex]) {
      actionToUpdate.trackers.find((tracker) => tracker.id === trackerId).tasks[taskIndex].comments.push("");
      setFormData(updatedFormData);
    }
  };

  /* MAPS FOR TASKS */
  const updateTaskCoordinates = (actionId, trackerId, taskIndex, startCoords, finishCoords) => {
    const updatedActions = [...formData];
    const actionToUpdate = updatedActions.find((action) => action.id === actionId);
    if (actionToUpdate && actionToUpdate.trackers.find((tracker) => tracker.id === trackerId)) {
      updatedActions
        .find((action) => action.id === actionId)
        .trackers.find((tracker) => tracker.id === trackerId).tasks[taskIndex].coordinatesStart = startCoords;
      updatedActions
        .find((action) => action.id === actionId)
        .trackers.find((tracker) => tracker.id === trackerId).tasks[taskIndex].coordinatesFinish = finishCoords;
      setFormData(updatedActions);
    }
  };

  const createRoutingMachineLayer = (props) => {
    const { actionId, trackerId, taskIndex, profile } = props;

    const medium = profile == "CAR" || "MOTORCYCLE" ? "car" : profile == "BIKE" ? "bike" : "foot";

    const instance = L.Routing.control({
      waypoints: [
        L.latLng(
          [...formData].find((action) => action.id === actionId).trackers.find((tracker) => tracker.id === trackerId)
            .tasks[taskIndex].coordinatesStart[0],
          [...formData].find((action) => action.id === actionId).trackers.find((tracker) => tracker.id === trackerId)
            .tasks[taskIndex].coordinatesStart[1]
        ),
        L.latLng(
          [...formData].find((action) => action.id === actionId).trackers.find((tracker) => tracker.id === trackerId)
            .tasks[taskIndex].coordinatesFinish[0],
          [...formData].find((action) => action.id === actionId).trackers.find((tracker) => tracker.id === trackerId)
            .tasks[taskIndex].coordinatesFinish[1]
        ),
      ],
      router: new L.Routing.osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
        profile: medium,
      }),
      show: false,
    });

    instance.on("waypointschanged", function (e) {
      const waypoints = e.waypoints;
      const start = [waypoints[0].latLng.lat, waypoints[0].latLng.lng];
      const end = [waypoints[1].latLng.lat, waypoints[1].latLng.lng];

      updateTaskCoordinates(actionId, trackerId, taskIndex, start, end);
    });

    return instance;
  };

  const RoutingMachine = createControlComponent(createRoutingMachineLayer);

  return (
    <>
      {session && hasAccess && (
        <>
          <Flex justify="center">
            <Header />
          </Flex>
          <Flex align="center" mt="64px" mb="64px" gap="32px" direction="column">
            {formData &&
              formData.map((action) => (
                <Flex
                  w="800px"
                  bg="#F9F7ED"
                  border="solid 1px #306844"
                  borderRadius="8px"
                  p="32px"
                  direction="column"
                  key={action.id}
                >
                  <Text fontSize="lg" color="#306844" as="b" mt="16px">
                    TITLE
                  </Text>
                  <Input
                    id="title"
                    value={action.title}
                    onChange={(e) => handleFormChange(action.id, e.target.id, e.target.value)}
                  />
                  <Text fontSize="lg" color="#306844" as="b" mt="16px">
                    {"MANAGER - " +
                      action.manager.name +
                      " " +
                      action.manager.surname +
                      ", " +
                      action.manager.station.name}
                  </Text>
                  <Text fontSize="lg" color="#306844" as="b" mt="16px">
                    COMMENT
                  </Text>
                  <Input
                    id="comment"
                    value={action.comment}
                    onChange={(e) => handleFormChange(action.id, e.target.id, e.target.value)}
                  />

                  <Flex align="center" mt="16px">
                    <Text fontSize="lg" color="#306844" as="b">
                      Add
                    </Text>
                    <RadioGroup
                      value={itemType[action.id] || "species"}
                      onChange={(value) => handleItemTypeChange(action.id, value)}
                      ml="8px"
                    >
                      <HStack spacing="16px">
                        <Radio colorScheme="green" value="species">
                          Species
                        </Radio>
                        <Radio colorScheme="green" value="individuals">
                          Individuals
                        </Radio>
                        <Radio colorScheme="green" value="habitats">
                          Habitats
                        </Radio>
                      </HStack>
                    </RadioGroup>
                  </Flex>

                  {itemType[action.id] === "species" && (
                    <>
                      <Text fontSize="lg" color="#306844" as="b" mt="16px">
                        SPECIES
                      </Text>
                      {action.species.map((spec, index) => (
                        <Box
                          key={index}
                          position="relative"
                          border="solid 1px #306844"
                          borderRadius="8px"
                          p="16px"
                          mt="8px"
                        >
                          <Button
                            position="absolute"
                            top="0px"
                            right="0px"
                            variant="unstyled"
                            onClick={() => remove(action.id, index, "species")}
                          >
                            ✖
                          </Button>

                          <Text fontSize="lg" textAlign="center">
                            Name
                          </Text>
                          <Input
                            id="name"
                            value={spec.name}
                            _hover={{ borderColor: "#97B3A1" }}
                            focusBorderColor="#306844"
                            borderColor="#306844"
                            onChange={(e) => handleChange(e, action.id, index, "name", "species")}
                          />

                          <Text fontSize="lg" mt="16px" textAlign="center">
                            Description
                          </Text>
                          <Input
                            id="description"
                            value={spec.description}
                            _hover={{ borderColor: "#97B3A1" }}
                            focusBorderColor="#306844"
                            borderColor="#306844"
                            onChange={(e) => handleChange(e, action.id, index, "description", "species")}
                          />

                          <Flex direction="column" align="center">
                            <Text fontSize="lg" mt="16px">
                              Photo
                            </Text>
                            <Flex mt="8px" direction="column" align="center">
                              <label htmlFor={`file-upload-${action.id}-${index}`}>
                                <GreenButton size="sm" as="span" mb="8px" variant="outline">
                                  Upload photo
                                </GreenButton>
                              </label>
                              {spec.photo && <img style={{ width: "264px" }} src={spec.photo} alt={spec.name} />}
                              <Input
                                id={`file-upload-${action.id}-${index}`}
                                display="none"
                                type="file"
                                onChange={(e) => handlePhotoChange(e, action.id, index, "species")}
                              />
                            </Flex>
                          </Flex>
                        </Box>
                      ))}
                      <Text fontSize="lg" color="#306844" align="center" mt="16px">
                        <strong>Add existing species</strong>
                      </Text>
                      <Multiselect
                        options={existingSpecies}
                        displayValue="name"
                        selectedValues={selectedSpeciesMap[action.id]}
                        onSelect={(selectedOptions) => handleSpecies(action.id, selectedOptions)}
                        onRemove={(selectedOptions) => handleSpecies(action.id, selectedOptions)}
                      />
                      <Flex justify="center">
                        <YellowButton w="200px" mt="16px" onClick={() => add(action.id, "species")}>
                          Create new species
                        </YellowButton>
                      </Flex>
                    </>
                  )}

                  {itemType[action.id] === "individuals" && (
                    <>
                      <Text fontSize="lg" color="#306844" as="b" mt="16px">
                        INDIVIDUALS
                      </Text>
                      {action.individuals.map((indi, index) => (
                        <Box
                          key={index}
                          position="relative"
                          border="solid 1px #306844"
                          borderRadius="8px"
                          p="16px"
                          mt="8px"
                        >
                          <Button
                            position="absolute"
                            top="0px"
                            right="0px"
                            variant="unstyled"
                            onClick={() => remove(action.id, index, "individuals")}
                          >
                            ✖
                          </Button>

                          <Text fontSize="lg" textAlign="center">
                            Name
                          </Text>
                          <Input
                            id="name"
                            value={indi.name}
                            _hover={{ borderColor: "#97B3A1" }}
                            focusBorderColor="#306844"
                            borderColor="#306844"
                            onChange={(e) => handleChange(e, action.id, index, "name", "individuals")}
                          />
                          <Text fontSize="lg" mt="16px" textAlign="center">
                            Species
                          </Text>
                          <Input
                            id="species"
                            value={indi.species}
                            _hover={{ borderColor: "#97B3A1" }}
                            focusBorderColor="#306844"
                            borderColor="#306844"
                            onChange={(e) => handleChange(e, action.id, index, "species", "individuals")}
                          />
                          <Text fontSize="lg" mt="16px" textAlign="center">
                            Description
                          </Text>
                          <Input
                            id="description"
                            value={indi.description}
                            _hover={{ borderColor: "#97B3A1" }}
                            focusBorderColor="#306844"
                            borderColor="#306844"
                            onChange={(e) => handleChange(e, action.id, index, "description", "individuals")}
                          />

                          <Flex direction="column" align="center">
                            <Text fontSize="lg" mt="16px">
                              Comments
                            </Text>
                            {indi.comments.map((comment, commentIndex) => (
                              <Flex direction="column" key={commentIndex}>
                                <Textarea
                                  _hover={{ borderColor: "#97B3A1" }}
                                  focusBorderColor="#306844"
                                  borderColor="#306844"
                                  value={comment}
                                  onChange={(e) => handleCommentChange(e, action.id, index, commentIndex)}
                                />
                                <YellowButton
                                  size="sm"
                                  onClick={() => removeComment(action.id, index, commentIndex)}
                                  mt="8px"
                                  mb="16px"
                                >
                                  Remove
                                </YellowButton>
                              </Flex>
                            ))}
                            <GreenButton size="sm" w="200px" mt="16px" onClick={() => addComment(action.id, index)}>
                              Add Comment
                            </GreenButton>
                          </Flex>

                          <Flex direction="column" align="center">
                            <Text fontSize="lg" mt="16px">
                              Photo
                            </Text>
                            <Flex mt="8px" direction="column" align="center">
                              <label htmlFor={`file-upload-individual-${action.id}-${index}`}>
                                <GreenButton size="sm" as="span" mb="8px" variant="outline">
                                  Upload photo
                                </GreenButton>
                              </label>
                              {indi.photo && <img style={{ width: "264px" }} src={indi.photo} alt={indi.name} />}
                              <Input
                                id={`file-upload-individual-${action.id}-${index}`}
                                display="none"
                                type="file"
                                onChange={(e) => handlePhotoChange(e, action.id, index, "individuals")}
                              />
                            </Flex>
                          </Flex>
                        </Box>
                      ))}
                      <Text fontSize="lg" color="#306844" align="center" mt="16px">
                        <strong>Add existing individual</strong>
                      </Text>
                      <Multiselect
                        options={existingIndividuals}
                        displayValue="name"
                        selectedValues={selectedIndividualsMap[action.id]}
                        onSelect={(selectedOptions) => handleIndividuals(action.id, selectedOptions)}
                        onRemove={(selectedOptions) => handleIndividuals(action.id, selectedOptions)}
                      />
                      <Flex justify="center">
                        <YellowButton mt="16px" onClick={() => add(action.id, "individuals")}>
                          Create new individual
                        </YellowButton>
                      </Flex>
                    </>
                  )}

                  {itemType[action.id] === "habitats" && (
                    <>
                      <Text fontSize="lg" color="#306844" as="b" mt="16px">
                        HABITATS
                      </Text>
                      {action.habitats.map((habitat, index) => (
                        <Box
                          key={index}
                          position="relative"
                          border="solid 1px #306844"
                          borderRadius="8px"
                          p="16px"
                          mt="8px"
                        >
                          <Button
                            position="absolute"
                            top="0px"
                            right="0px"
                            variant="unstyled"
                            onClick={() => remove(action.id, index, "habitats")}
                          >
                            ✖
                          </Button>

                          <Text fontSize="lg" textAlign="center">
                            Name
                          </Text>
                          <Input
                            id="name"
                            value={habitat.name}
                            _hover={{ borderColor: "#97B3A1" }}
                            focusBorderColor="#306844"
                            borderColor="#306844"
                            onChange={(e) => handleChange(e, action.id, index, "name", "habitats")}
                          />

                          <Text fontSize="lg" mt="16px" textAlign="center">
                            Description
                          </Text>
                          <Input
                            id="description"
                            value={habitat.description}
                            _hover={{ borderColor: "#97B3A1" }}
                            focusBorderColor="#306844"
                            borderColor="#306844"
                            onChange={(e) => handleChange(e, action.id, index, "description", "habitats")}
                          />

                          <Flex direction="column" align="center">
                            <Text fontSize="lg" mt="16px">
                              Photo
                            </Text>
                            <Flex mt="8px" direction="column" align="center">
                              <label htmlFor={`file-upload-habitat-${action.id}-${index}`}>
                                <GreenButton size="sm" as="span" mb="8px" variant="outline">
                                  Upload photo
                                </GreenButton>
                              </label>
                              {habitat.photo && (
                                <img style={{ width: "264px" }} src={habitat.photo} alt={habitat.name} />
                              )}
                              <Input
                                id={`file-upload-habitat-${action.id}-${index}`}
                                display="none"
                                type="file"
                                onChange={(e) => handlePhotoChange(e, action.id, index, "habitats")}
                              />
                            </Flex>
                          </Flex>
                        </Box>
                      ))}
                      <Text fontSize="lg" color="#306844" align="center" mt="16px">
                        <strong>Add existing habitat</strong>
                      </Text>
                      <Multiselect
                        options={existingHabitats}
                        displayValue="species"
                        selectedValues={selectedHabitatsMap[action.id]}
                        onSelect={(selectedOptions) => handleHabitats(action.id, selectedOptions)}
                        onRemove={(selectedOptions) => handleHabitats(action.id, selectedOptions)}
                      />
                      <Flex justify="center">
                        <YellowButton mt="16px" onClick={() => add(action.id, "habitats")}>
                          Create new habitat
                        </YellowButton>
                      </Flex>
                    </>
                  )}

                  <Divider mt="16px" mb="16px" />

                  <Text fontSize="lg" color="#306844" as="b">
                    TRACKERS
                  </Text>
                  {action.trackers.map((tracker) => (
                    <Box align="center" key={tracker.id}>
                      <Avatar size="xl" url="tracker.photo" />
                      <Text fontSize="2xl" align="center">
                        {tracker.name + " " + tracker.surname}
                      </Text>
                      <Text color="gray" fontSize="sm" align="center">
                        medium - {tracker.medium}
                      </Text>
                      {tracker.tasks.map((task, taskIndex) => (
                        <Box
                          key={taskIndex}
                          position="relative"
                          border="solid 1px #306844"
                          borderRadius="8px"
                          p="16px"
                          mt="16px"
                        >
                          <Button
                            position="absolute"
                            top="0px"
                            right="0px"
                            variant="unstyled"
                            onClick={() => removeTask(action.id, tracker.id, taskIndex)}
                          >
                            ✖
                          </Button>

                          <Text fontSize="lg" textAlign="center">
                            Title
                          </Text>
                          <Input
                            id="title"
                            value={task.title}
                            _hover={{ borderColor: "#97B3A1" }}
                            focusBorderColor="#306844"
                            onChange={(e) => handleTaskChange(e, action.id, tracker.id, taskIndex, "title")}
                          />

                          <Text mt="16px" fontSize="lg" textAlign="center">
                            Content
                          </Text>
                          <Select
                            id="content"
                            mb="16px"
                            value={task.content}
                            borderColor="#306844"
                            _hover={{ borderColor: "#97B3A1" }}
                            focusBorderColor="#306844"
                            sx={{
                              "& option": {
                                background: "#97B3A1",
                                color: "white",
                              },
                            }}
                            onChange={(e) => handleTaskChange(e, action.id, tracker.id, taskIndex, "content")}
                          >
                            <chakra.option value="Set up a camera">Set up a camera</chakra.option>
                            <chakra.option value="Set up a gps tracker">Set up a gps tracker</chakra.option>
                          </Select>
                          <Text align="center" w="500px" fontSize="lg" color="#306844">
                            Designate the starting and finishing points of the route for the task by dragging waypoints
                            on the map.
                          </Text>
                          <Flex justify="center" color="gray.400" fontSize="sm">
                            {task.coordinatesStart && (
                              <Text>{"Start: " + task.coordinatesStart[0] + ", " + task.coordinatesStart[1]}</Text>
                            )}
                            <Text>|</Text>
                            {task.coordinatesFinish && (
                              <Text>{"End: " + task.coordinatesFinish[0] + ", " + task.coordinatesFinish[1]}</Text>
                            )}
                          </Flex>
                          <Box h="400px" p="16px" id="map">
                            <MapContainer style={{ height: "100%", width: "100%" }} center={[45, 15]} zoom={10}>
                              <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                              />
                              <RoutingMachine
                                profile={tracker.medium}
                                actionId={action.id}
                                trackerId={tracker.id}
                                taskIndex={taskIndex}
                              />
                            </MapContainer>
                          </Box>

                          <Flex direction="column" align="center">
                            <Text fontSize="lg" mt="16px">
                              Comments
                            </Text>
                            {task.comments.map((comment, commentIndex) => (
                              <Flex direction="column" align="center" key={commentIndex}>
                                <Textarea
                                  w="500px"
                                  value={comment}
                                  onChange={(e) =>
                                    handleTaskCommentChange(e, action.id, tracker.id, taskIndex, commentIndex)
                                  }
                                />
                                <YellowButton
                                  size="sm"
                                  w="200px"
                                  onClick={() => removeTaskComment(action.id, taskIndex, tracker.id, commentIndex)}
                                  mt="8px"
                                  mb="16px"
                                >
                                  Remove
                                </YellowButton>
                              </Flex>
                            ))}
                            <GreenButton
                              size="sm"
                              w="200px"
                              mt="16px"
                              onClick={() => addTaskComment(action.id, tracker.id, taskIndex)}
                            >
                              Add Comment
                            </GreenButton>
                          </Flex>
                        </Box>
                      ))}
                      <YellowButton mt="16px" onClick={() => addTask(action.id, tracker.id)}>
                        Add task
                      </YellowButton>

                      <Divider borderColor="#306844" w="600px" mt="16px" mb="16px" />
                    </Box>
                  ))}

                  <Flex justify="center">
                    <GreenButton w="200px" mt="16px" onClick={() => handleSubmit(action.id)}>
                      Submit
                    </GreenButton>
                  </Flex>
                </Flex>
              ))}
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