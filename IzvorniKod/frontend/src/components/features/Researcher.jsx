import {
  Text,
  Box,
  Flex,
  Divider,
  Avatar,
  List,
  AbsoluteCenter,
  RadioGroup,
  Stack,
  Radio,
  Select,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { LayerGroup, LayersControl, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import GreenButton from "../shared/GreenButton";
import YellowButton from "../shared/YellowButton";
import mockData from "../../mockData.jsx";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { redIcon, greenIcon, blackIcon } from "../shared/mapIcons.jsx";
import { Link } from "react-router-dom";
import L from "leaflet";
import "leaflet.heat";

export default function Researcher() {
  const mapRef = useRef(null);
  const [formData, setFormData] = useState(mockData.mockActions);
  const [coords, setCoords] = useState(mockData.mockCoords);

  /* GET DATA */
  console.log(formData);
  useEffect(() => {
    fetch("http://localhost:5173/researcher/actions", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        //setFormData(data);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:5173/researcher/coords", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        //setCoords(data);
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

  const [filter, setFilter] = useState("0");
  const [filterSpecificAnimals, setFilterSpecificAnimals] = useState("0");
  const [filterSpecificTrackers, setFilterSpecificTrackers] = useState("0");

  const [speciesFilter, setSpeciesFilter] = useState("");
  const [individualFilter, setIndividualFilter] = useState("");
  const [mediumFilter, setMediumFilter] = useState("");
  const [trackerFilter, setTrackerFilter] = useState("");

  const heatLayerRef = useRef(null);
  useEffect(() => {
    if (!mapRef.current) return;

    let points = [];
    if (filter == 1) {
      points = coords.animals.flatMap((animal) => animal.coords.map((p) => [p[0], p[1], p[2]]));
      if (filterSpecificAnimals == 1) {
        const species = speciesFilter;
        points = coords.animals
          .filter((animal) => animal.species == species)
          .flatMap((animal) => animal.coords.map((p) => [p[0], p[1], p[2]]));
      } else if (filterSpecificAnimals == 2) {
        const id = individualFilter;
        points = coords.animals
          .filter((animal) => animal.id == id)
          .flatMap((animal) => animal.coords.map((p) => [p[0], p[1], p[2]]));
      }
    } else if (filter == 2) {
      points = coords.trackers.flatMap((tracker) => tracker.coords.map((p) => [p[0], p[1], p[2]]));
      if (filterSpecificTrackers == 1) {
        const medium = mediumFilter;
        points = coords.trackers
          .filter((tracker) => tracker.medium == medium)
          .flatMap((tracker) => tracker.coords.map((p) => [p[0], p[1], p[2]]));
      } else if (filterSpecificTrackers == 2) {
        const id = trackerFilter;
        points = coords.trackers
          .filter((tracker) => tracker.id == id)
          .flatMap((tracker) => tracker.coords.map((p) => [p[0], p[1], p[2]]));
      }
    }

    if (heatLayerRef.current) {
      heatLayerRef.current.setLatLngs(points).redraw();
    } else {
      heatLayerRef.current = L.heatLayer(points, {
        radius: 25,
        minOpacity: 0.4,
        gradient: { 0.4: "blue", 0.65: "lime", 1: "red" },
      }).addTo(mapRef.current);
    }
  }, [
    filter,
    filterSpecificAnimals,
    filterSpecificTrackers,
    speciesFilter,
    individualFilter,
    mediumFilter,
    trackerFilter,
  ]);

  return (
    <>
      <Text color="#306844" fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }} alignSelf="center">
        Researcher
      </Text>

      <Flex direction="column" align="center">
        <RadioGroup colorScheme="yellow" onChange={setFilter} value={filter}>
          <Stack direction="row">
            <Radio value="0">Only current positions</Radio>
            <Radio value="1">History of tracked animals</Radio>
            <Radio value="2">History of trackers</Radio>
          </Stack>
        </RadioGroup>
        {filter == "1" && (
          <RadioGroup colorScheme="red" onChange={setFilterSpecificAnimals} value={filterSpecificAnimals}>
            <Stack direction="row">
              <Radio value="0">All tracked animals</Radio>
              <Radio value="1">Specific species</Radio>
              <Radio value="2">Specific animal</Radio>
            </Stack>
          </RadioGroup>
        )}
        {filter == "2" && (
          <RadioGroup colorScheme="green" onChange={setFilterSpecificTrackers} value={filterSpecificTrackers}>
            <Stack direction="row">
              <Radio value="0">All trackers</Radio>
              <Radio value="1">Specific medium</Radio>
              <Radio value="2">Specific tracker</Radio>
            </Stack>
          </RadioGroup>
        )}

        {filter == "1" && filterSpecificAnimals == "1" && (
          <Select
            value={speciesFilter}
            borderColor="#306844"
            _hover={{ borderColor: "#97B3A1" }}
            focusBorderColor="#306844"
            placeholder="Select species"
            mt="16px"
            sx={{
              "& option": {
                background: "#97B3A1",
                color: "white",
              },
            }}
            onChange={(e) => setSpeciesFilter(e.target.value)}
          >
            {formData.map((action) =>
              action.species.map((species, index) => <option value={species.name}>{species.name}</option>)
            )}
          </Select>
        )}
        {filter == "1" && filterSpecificAnimals == "2" && (
          <Select
            value={individualFilter}
            borderColor="#306844"
            _hover={{ borderColor: "#97B3A1" }}
            focusBorderColor="#306844"
            placeholder="Select individual"
            mt="16px"
            sx={{
              "& option": {
                background: "#97B3A1",
                color: "white",
              },
            }}
            onChange={(e) => {
              setIndividualFilter(e.target.value);
            }}
          >
            {formData.map((action) =>
              action.individuals.map((animal, index) => <option value={animal.id}>{animal.name}</option>)
            )}
          </Select>
        )}
        {filter == "2" && filterSpecificTrackers == "1" && (
          <Select
            value={mediumFilter}
            borderColor="#306844"
            _hover={{ borderColor: "#97B3A1" }}
            focusBorderColor="#306844"
            placeholder="Select medium"
            mt="16px"
            sx={{
              "& option": {
                background: "#97B3A1",
                color: "white",
              },
            }}
            onChange={(e) => setMediumFilter(e.target.value)}
          >
            <option value="ON_FOOT">On foot</option>
            <option value="BICYCLE">Bicycle</option>
            <option value="MOTORCYCLE">Motorcycle</option>
            <option value="CAR">Car</option>
            <option value="BOAT">Boat</option>
            <option value="DRON">Dron</option>
            <option value="HELICOPTER">Helicopter</option>
            <option value="AIRPLANE">Airplane</option>
          </Select>
        )}
        {filter == "2" && filterSpecificTrackers == "2" && (
          <Select
            value={trackerFilter}
            borderColor="#306844"
            _hover={{ borderColor: "#97B3A1" }}
            focusBorderColor="#306844"
            placeholder="Select tracker"
            mt="16px"
            sx={{
              "& option": {
                background: "#97B3A1",
                color: "white",
              },
            }}
            onChange={(e) => setTrackerFilter(e.target.value)}
          >
            {formData.map((action) =>
              action.trackers.map((tracker, index) => (
                <option value={tracker.id}>
                  {tracker.name} {tracker.surname}
                </option>
              ))
            )}
          </Select>
        )}
      </Flex>

      <Box h="600px" p="16px" id="mapSection">
        <MapContainer ref={mapRef} style={{ height: "100%", width: "100%" }} center={[45.8634, 15.9772]} zoom={14}>
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
                      <Popup>{animal.name}</Popup>
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
          <Link to="/new-requirements">
            <GreenButton>Create requirements</GreenButton>
          </Link>
          <Link to="/new-actions">
            <YellowButton>Create actions</YellowButton>
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
