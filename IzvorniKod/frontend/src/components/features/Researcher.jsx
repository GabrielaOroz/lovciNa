import { Text, Box, Flex, Divider, Avatar, List, AbsoluteCenter } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { LayerGroup, LayersControl, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import GreenButton from "../shared/GreenButton";
import YellowButton from "../shared/YellowButton";
import mockData from "../../mockData.jsx";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { redIcon, greenIcon, blackIcon } from "../shared/mapIcons.jsx";
import { Link } from "react-router-dom";

export default function Researcher() {
  const mapRef = useRef(null);
  const [formData, setFormData] = useState(mockData.mockActions);
  
  /* GET DATA */
  console.log(formData);
  useEffect(() => {
    fetch("http://localhost:8000/researcher/actions", {
      method: "GET",
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        //setFormData(data);
      });
  }, []);
  
  const [openActions, setOpenActions] = useState(false);
  const [showTrackers, setShowTrackers] = useState(() =>
    formData.reduce((obj, action) => {
      obj[action.id] = false;
      return obj;
    }, {})
  );
  const [showAnimals, setShowAnimals] = useState(() =>
    formData.reduce((obj, action) => {
      obj[action.id] = false;
      return obj;
    }, {})
  );

  const handleToggleTracker = (id) => {
    setShowTrackers({ ...showTrackers, [id]: !showTrackers[id] });
  };

  const handleToggleAnimals = (id) => {
    setShowAnimals({ ...showAnimals, [id]: !showAnimals[id] });
  };

  const scrollToMap = () => {
    const mapSection = document.getElementById("mapSection");
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <Text color="#306844" fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }} alignSelf="center">
        Researcher
      </Text>

      <Box h="600px" p="16px" id="mapSection">
        <MapContainer ref={mapRef} style={{ height: "100%", width: "100%" }} center={[45.8634, 15.9772]} zoom={16}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LayersControl position="topright">
            <LayersControl.Overlay checked name="Postaje">
              <LayerGroup>
                {formData.map((action, index) => (
                  <Marker
                    key={index}
                    icon={blackIcon}
                    position={[action.manager.station.latitude, action.manager.station.longitude]}
                  >
                    <Popup>{action.manager.station.name}</Popup>
                  </Marker>
                ))}
              </LayerGroup>
            </LayersControl.Overlay>
            <LayersControl.Overlay checked name="Pozicije tragača na akciji">
              <LayerGroup>
                {formData.map((action, index) =>
                  action.trackers.map((tracker, index) => (
                    <Marker key={index} icon={greenIcon} position={[tracker.latitude, tracker.longitude]}>
                      <Popup>
                        {tracker.name} {tracker.surname}
                      </Popup>
                    </Marker>
                  ))
                )}
              </LayerGroup>
            </LayersControl.Overlay>
            <LayersControl.Overlay checked name="Pozicije praćenih životinja">
              <LayerGroup>
                {formData.map((action) =>
                  action.individuals.map((animal, index) => (
                    <Marker key={index} icon={redIcon} position={[animal.latitude, animal.longitude]}>
                      <Popup>{animal.species}</Popup>
                    </Marker>
                  ))
                )}
              </LayerGroup>
            </LayersControl.Overlay>
          </LayersControl>
        </MapContainer>
      </Box>

      <Flex pl="16px" pr="16px" justify="space-between">
        <Flex gap="8px">
          <GreenButton
            onClick={() => {
              setOpenActions(true);
            }}
          >
            Actions
          </GreenButton>
          <Link to="/new-action">
            <GreenButton>Create new action</GreenButton>
          </Link>
          <Link to="/finish-new-actions">
            <YellowButton>Pending actions</YellowButton>
          </Link>
        </Flex>
        {openActions && (
          <YellowButton
            onClick={() => {
              setOpenActions(false);
            }}
          >
            Close
          </YellowButton>
        )}
      </Flex>

      {openActions && (
        <Flex p="16px" gap="16px" direction="column">
          {formData.map((action) => (
            <Flex
              border="solid 1px #306844"
              borderRadius="8px"
              p="16px"
              direction="column"
              justify="space-between"
              key={action.id}
            >
              <Text color="#306844" fontSize="3xl" align="center">
                {action.title}
              </Text>
              <Text
                fontSize="lg"
                align="center"
                _hover={{ cursor: "pointer", color: "#306844" }}
                onClick={() => {
                  if (mapRef.current)
                    mapRef.current.flyTo([action.manager.station.latitude, action.manager.station.longitude], 18);
                  scrollToMap();
                }}
              >
                {action.manager.name + " " + action.manager.surname + ", " + action.manager.station.name}
              </Text>
              <Text color="gray" fontSize="sm" align="center">
                {(action.status == 0 ? "not started" : action.status == 1 ? "in progress" : "completed") +
                  ", " +
                  action.start +
                  " - " +
                  action.end}
              </Text>
              {action.comment && (
                <Text mt="8px" align="center">
                  ○ {action.comment}
                </Text>
              )}

              <Box position="relative" padding="10">
                <Divider borderColor="#306844" />
                <AbsoluteCenter bg="#F9F7ED" px="4" color="#306844">
                  <Flex
                    _hover={{ cursor: "pointer" }}
                    align="center"
                    gap="8px"
                    onClick={() => handleToggleAnimals(action.id)}
                  >
                    {!showAnimals[action.id] && (
                      <>
                        <IoIosArrowDown /> show species, individuals and habitats
                      </>
                    )}
                    {showAnimals[action.id] && (
                      <>
                        <IoIosArrowUp />
                        hide species, individuals and habitats
                      </>
                    )}
                  </Flex>
                </AbsoluteCenter>
              </Box>

              {showAnimals[action.id] && (
                <>
                  {action.species.length > 0 && (
                    <>
                      <Text mt="16px" color="#306844" fontSize="3xl" align="center">
                        SPECIES
                      </Text>
                      <Flex p="16px" gap="16px" wrap="wrap" justify="center">
                        {action.species.map((species, index) => (
                          <Flex
                            border="solid 1px #306844"
                            borderRadius="8px"
                            p="16px"
                            direction="column"
                            justify="space-between"
                            key={index}
                          >
                            <Flex direction="column" align="center">
                              <Text color="#306844" fontSize="3xl">
                                {species.name}
                              </Text>
                              <Avatar size="2xl" src={species.photo} alt={species.name} borderRadius="8px" />
                              <Text pt="8px">{species.description}</Text>
                            </Flex>
                          </Flex>
                        ))}
                      </Flex>
                    </>
                  )}

                  {action.individuals.length > 0 && (
                    <>
                      <Text mt="16px" color="#306844" fontSize="3xl" align="center">
                        INDIVIDUALS
                      </Text>
                      <Flex p="16px" gap="16px" wrap="wrap" justify="center">
                        {action.individuals.map((individual, index) => (
                          <Flex
                            border="solid 1px #306844"
                            borderRadius="8px"
                            p="16px"
                            direction="column"
                            justify="space-between"
                            key={index}
                          >
                            <Flex direction="column" align="center">
                              <Text
                                color="#306844"
                                fontSize="3xl"
                                _hover={{ cursor: "pointer" }}
                                onClick={() => {
                                  if (mapRef.current)
                                    mapRef.current.flyTo([individual.latitude, individual.longitude], 18);
                                  scrollToMap();
                                }}
                              >
                                {individual.species}
                              </Text>
                              <Avatar
                                size="2xl"
                                src={individual.photo}
                                alt={individual.species}
                                borderRadius="8px"
                                _hover={{ cursor: "pointer" }}
                                onClick={() => {
                                  if (mapRef.current)
                                    mapRef.current.flyTo([individual.latitude, individual.longitude], 18);
                                  scrollToMap();
                                }}
                              />
                              <Text pt="8px">{individual.description}</Text>
                            </Flex>
                            {individual.comments.length == 0 ? (
                              ""
                            ) : (
                              <Flex direction="column">
                                <Divider borderColor="#306844" mt="8px" mb="8px" />
                                <List mb="8px">
                                  {individual.comments.map((comment, index) => (
                                    <Text key={index}>○ {comment}</Text>
                                  ))}
                                </List>
                              </Flex>
                            )}
                          </Flex>
                        ))}
                      </Flex>
                    </>
                  )}

                  {action.habitats.length > 0 && (
                    <>
                      <Text mt="16px" color="#306844" fontSize="3xl" align="center">
                        HABITATS
                      </Text>
                      <Flex p="16px" gap="16px" wrap="wrap" justify="center">
                        {action.habitats.map((habitat, index) => (
                          <Flex
                            border="solid 1px #306844"
                            borderRadius="8px"
                            p="16px"
                            direction="column"
                            justify="space-between"
                            key={index}
                          >
                            <Flex direction="column" align="center">
                              <Text
                                color="#306844"
                                fontSize="3xl"
                                _hover={{ cursor: "pointer" }}
                                onClick={() => {
                                  if (mapRef.current) mapRef.current.flyTo([habitat.latitude, habitat.longitude], 18);
                                  scrollToMap();
                                }}
                              >
                                {habitat.name}
                              </Text>
                              <Avatar
                                size="2xl"
                                src={habitat.photo}
                                alt={habitat.name}
                                borderRadius="8px"
                                _hover={{ cursor: "pointer" }}
                                onClick={() => {
                                  if (mapRef.current) mapRef.current.flyTo([habitat.latitude, habitat.longitude], 18);
                                  scrollToMap();
                                }}
                              />
                              <Text pt="8px">{habitat.description}</Text>
                            </Flex>
                          </Flex>
                        ))}
                      </Flex>
                    </>
                  )}
                </>
              )}

              <Box position="relative" padding="10">
                <Divider borderColor="#306844" />
                <AbsoluteCenter bg="#F9F7ED" px="4" color="#306844">
                  <Flex
                    _hover={{ cursor: "pointer" }}
                    align="center"
                    gap="8px"
                    onClick={() => handleToggleTracker(action.id)}
                  >
                    {!showTrackers[action.id] && (
                      <>
                        <IoIosArrowDown /> show trackers
                      </>
                    )}
                    {showTrackers[action.id] && (
                      <>
                        <IoIosArrowUp /> hide trackers
                      </>
                    )}
                  </Flex>
                </AbsoluteCenter>
              </Box>

              {showTrackers[action.id] && (
                <>
                  {action.trackers.map((tracker, index) => (
                    <Box align="center" key={index} mb="32px">
                      <Avatar size="xl" url="tracker.photo" />
                      <Text
                        fontSize="2xl"
                        align="center"
                        _hover={{ cursor: "pointer", color: "#306844" }}
                        onClick={() => {
                          if (mapRef.current) mapRef.current.flyTo([tracker.latitude, tracker.longitude], 18);
                          scrollToMap();
                        }}
                      >
                        {tracker.name + " " + tracker.surname}
                      </Text>
                      <Text color="gray" fontSize="sm" align="center">
                        medium - {tracker.medium}
                      </Text>
                      {tracker.tasks.map((task, index) => (
                        <Box key={index}>
                          <Text color="#306844" fontSize="2xl" align="center" mt="16px">
                            {task.title}
                          </Text>

                          <Text color="gray" fontSize="sm" align="center">
                            {(task.status == 0 ? "not started" : task.status == 1 ? "in progress" : "completed") +
                              ", " +
                              task.start +
                              " - " +
                              task.end}
                          </Text>
                          <Text mt="8px" align="center">
                            {task.content}
                          </Text>
                          {task.comments.map((comment, index) => (
                            <Box key={index}>
                              <Text mt="8px" align="center" fontSize="sm">
                                ○ {comment}
                              </Text>
                            </Box>
                          ))}
                        </Box>
                      ))}
                    </Box>
                  ))}
                </>
              )}
            </Flex>
          ))}
        </Flex>
      )}
    </>
  );
}
