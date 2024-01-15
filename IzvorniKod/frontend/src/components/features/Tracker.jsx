import { Text, Button, Box, Flex, Checkbox, List, Avatar, Divider, Input } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { LayerGroup, LayersControl, MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import GreenButton from "../shared/GreenButton";
import YellowButton from "../shared/YellowButton";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { redIcon, greenIcon, blackIcon } from "../shared/mapIcons.jsx";
import mockData from "../../mockData.jsx";

export default function Tracker() {
  const [openTasks, setOpenTasks] = useState(false);
  const [openAnimals, setOpenAnimals] = useState(false);
  const [tracker, setTracker] = useState(mockData.tracker);
  const [trackers, setTrackers] = useState(mockData.trackers);
  const [species, setSpecies] = useState(mockData.species);
  const [individuals, setIndividuals] = useState(mockData.individuals);
  const [habitats, setHabitats] = useState(mockData.habitats);
  const [tasks, setTasks] = useState(mockData.tasks);
  const mapRef = useRef(null);

  /* TRACKER INFO */
  useEffect(() => {
    fetch("http://localhost:8000/tracker/myInfo", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("currentTrackerInfo: ", data);
        setTracker(data);
      });
  }, []);

  /* TRACKERS ON ACTION */
  useEffect(() => {
    fetch("http://localhost:8000/tracker/trackers", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("TrackersOnAction: ", data);
        setTrackers(data);
      });
  }, []);

  /* ANIMALS */
  useEffect(() => {
    fetch("http://localhost:8000/tracker/individuals", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("IndividualsOnAction: ", data);
        setIndividuals(data);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:8000/tracker/species", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("SpeciesOnAction: ", data);
        setSpecies(data);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:8000/tracker/habitats", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("HabitatsOnAction: ", data);
        setHabitats(data);
      });
  }, []);

  /* TASKS */
  useEffect(() => {
    fetch("http://localhost:8000/tracker/tasks", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Tasks: ", data);
        setTasks(data);
      });
  }, []);

  /* DONE */
  const [doneTasks, setDoneTasks] = useState(() =>
    tasks.reduce((obj, task) => {
      obj[task.id] = 0;
      return obj;
    }, {})
  );
  //console.log(doneTasks);
  const handleDoneTasks = (id) => {
    setDoneTasks({ ...doneTasks, [id]: 2 });
  };
  useEffect(() => {
    fetch("http://localhost:8000/tracker/doneTasks", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(doneTasks),
    }).then((res) => {
      if (res.ok) {
        window.location.reload();
      }
    });
  }, [doneTasks]);

  /* NEW ANIMAL COMMENT */
  const [comments, setComments] = useState(() =>
    individuals.reduce((obj, individual) => {
      obj[individual.id] = individual.comments;
      return obj;
    }, {})
  );
  //console.log(comments);
  const handleKeyDown = (e, id) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setComments({ ...comments, [id]: [...comments[id], e.target.value] });
    }
  };
  useEffect(() => {
    fetch("http://localhost:8000/tracker/newComments", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(comments),
    }).then((res) => {
      if (res.ok) {
        window.location.reload();
      }
    });
  }, [comments]);

  /* NEW ACTION COMMENT */
  const [commentsAction, setCommentsAction] = useState(
    tracker && tracker.action && tracker.action.comments ? tracker.action.comments : []
  );
  const handleKeyDownAction = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setCommentsAction([...commentsAction, e.target.value]);
    }
  };
  //console.log(commentsAction);
  useEffect(() => {
    fetch("http://localhost:8000/tracker/actionComments", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(commentsAction),
    }).then((res) => {
      if (res.ok) {
        window.location.reload();
      }
    });
  }, [commentsAction]);

  /* ROUTES */
  const RoutingMachine = ({ task }) => {
    const map = useMap();

    const createRoutingMachineLayer = () => {
      const instance = L.Routing.control({
        waypoints: [
          L.latLng(task.coordinatesStart[0], task.coordinatesStart[1]),
          L.latLng(task.coordinatesFinish[0], task.coordinatesFinish[1]),
        ],
        router: new L.Routing.osrmv1({
          serviceUrl: "https://router.project-osrm.org/route/v1",
        }),
        show: false,
      });
      return instance;
    };

    useEffect(() => {
      const routingMachineLayer = createRoutingMachineLayer();
      routingMachineLayer.addTo(map);

      return () => {
        map.removeControl(routingMachineLayer);
      };
    });

    return null;
  };

  /* SCROLL */
  const scrollToMap = () => {
    const mapSection = document.getElementById("mapSection");
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  let zoom;
  if (
    tracker.medium == "ON_FOOT" ||
    tracker.medium == "BICYCLE" ||
    tracker.medium == "MOTORCYCLE" ||
    tracker.medium == "CAR"
  ) {
    zoom = 17;
  } else if (tracker.medium == "BOAT") {
    zoom = 18;
  } else {
    zoom = 14;
  }

  return (
    <>
    {(!tracker || !tracker.station || !tracker.action) && <Text>You don't have any actions yet</Text>}
      {tracker && tracker.station && (
        <>
          <Text color="#306844" fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }} alignSelf="center">
            Tracker
          </Text>
          <Text color="#306844" fontSize={{ base: "xl", md: "2xl", lg: "3xl" }} alignSelf="center">
            {tracker.name} {tracker.surname}
          </Text>
          <Text color="gray.400" fontSize={{ base: "md", md: "lg", lg: "xl" }} alignSelf="center">
            {tracker.medium}
          </Text>

          <Box h="600px" p="16px" id="mapSection">
            <MapContainer
              ref={mapRef}
              style={{ height: "100%", width: "100%" }}
              center={[tracker.station.latitude || 45, tracker.station.longitude || 15]}
              zoom={zoom}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {tasks.length > 0 && tasks.map((task) => <RoutingMachine key={task.id} task={task} />)}
              <LayersControl position="topright">
                <LayersControl.Overlay checked name="Postaja">
                  <Marker icon={blackIcon} position={[tracker.station.latitude, tracker.station.longitude]}>
                    <Popup>{tracker.station.name}</Popup>
                  </Marker>
                </LayersControl.Overlay>
                <LayersControl.Overlay checked name="Pozicije tragača na akciji">
                  <LayerGroup>
                    {trackers.length > 0 &&
                      trackers.map((tracker, index) => (
                        <Marker key={index} icon={greenIcon} position={tracker.coordinates}>
                          <Popup>
                            {tracker.name} {tracker.surname}
                          </Popup>
                        </Marker>
                      ))}
                  </LayerGroup>
                </LayersControl.Overlay>
                <LayersControl.Overlay checked name="Pozicije praćenih životinja">
                  <LayerGroup>
                    {individuals.length > 0 &&
                      individuals.map((animal, index) => (
                        <Marker key={index} icon={redIcon} position={[animal.latitude, animal.longitude]}>
                          <Popup>{animal.name}</Popup>
                        </Marker>
                      ))}
                  </LayerGroup>
                </LayersControl.Overlay>
                <LayersControl.Overlay checked name="Pozicije staništa">
                  <LayerGroup>
                    {habitats.length > 0 &&
                      habitats.map((habitat, index) => (
                        <Marker key={index} icon={redIcon} position={[habitat.latitude, habitat.longitude]}>
                          <Popup>{habitat.name}</Popup>
                        </Marker>
                      ))}
                  </LayerGroup>
                </LayersControl.Overlay>
                <LayersControl.Overlay checked name="Moja lokacija">
                  <LayerGroup>
                    <CurrentLocation />
                  </LayerGroup>
                </LayersControl.Overlay>
              </LayersControl>
            </MapContainer>
          </Box>
          <div style={{ position: "absolute", top: "650px", right: "45px", zIndex: "1000" }}>
            <Button
              bg="white"
              border="1px solid #7e7e7e"
              _hover={{ bg: "gray.100" }}
              borderRadius="4px"
              boxShadow="0 1px 1px rgba(0,0,0,0.3)"
              padding="2px"
              onClick={() => {
                const map = mapRef.current;
                if (map) {
                  map.locate();
                }
              }}
            >
              <FaLocationCrosshairs />
            </Button>
          </div>

          {tracker.action && (
            <>
              <Text pl="16px" mb="4px" as="b" color="#306844" fontSize="xl">
                Action: {tracker.action.title}
              </Text>

              <List pl="16px">
                {tracker.action.comments.length > 0 &&
                  tracker.action.comments.map((comment, index) => (
                    <Text key={index}>
                      {"\t"} ○ {comment}
                    </Text>
                  ))}
              </List>
            </>
          )}

          <Input
            ml="16px"
            mt="8px"
            mb="16px"
            w="200px"
            type="text"
            _hover={{ borderColor: "#97B3A1" }}
            focusBorderColor="#306844"
            borderColor="#306844"
            onKeyDown={(e) => {
              handleKeyDownAction(e);
            }}
            placeholder="Add a comment..."
          />

          <Flex pl="16px" pr="16px" justify="space-between">
            <Flex gap="8px">
              <GreenButton
                onClick={() => {
                  setOpenTasks(true);
                  setOpenAnimals(false);
                }}
              >
                Tasks
              </GreenButton>
              <GreenButton
                onClick={() => {
                  setOpenTasks(false);
                  setOpenAnimals(true);
                }}
              >
                Animals
              </GreenButton>
            </Flex>
            {(openTasks || openAnimals) && (
              <YellowButton
                onClick={() => {
                  setOpenTasks(false);
                  setOpenAnimals(false);
                }}
              >
                Close
              </YellowButton>
            )}
          </Flex>

          {openTasks && (
            <Flex direction="column" p="16px" gap="16px">
              {tasks.length > 0 &&
                tasks.map(
                  (task) =>
                    task.status == 0 && (
                      <Box align="center" border="solid 1px #306844" borderRadius="8px" p="8px" key={task.id}>
                        <Flex gap="4px" direction="column">
                          <Text
                            as="b"
                            color="#306844"
                            fontSize="xl"
                            onClick={() => {
                              const map = mapRef.current;
                              if (map && task.coordinatesFinish) map.flyTo(task.coordinatesFinish, 15);
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            {task.title}
                          </Text>
                          <Text as="b" color="#306844" fontSize="md">
                            {task.content}
                          </Text>
                        </Flex>
                        <List>
                          {task.comments.length > 0 &&
                            task.comments.map((comment) => (
                              <Text>
                                {"\t"} ○ {comment}
                              </Text>
                            ))}
                        </List>
                        <GreenButton mt="8px" onClick={() => handleDoneTasks(task.id)}>
                          Done
                        </GreenButton>
                      </Box>
                    )
                )}
            </Flex>
          )}
          {openAnimals && (
            <Flex justify="center" direction="column">
              {species.length > 0 && (
                <Text mt="32px" color="#306844" fontSize="3xl" align="center">
                  SPECIES
                </Text>
              )}
              <Flex wrap="wrap" gap="16px" justify="center" align="flex-start">
                {species.map((spec) => (
                  <Flex
                    border="solid 1px #306844"
                    borderRadius="8px"
                    p="16px"
                    direction="column"
                    justify="space-between"
                    key={spec.id}
                  >
                    <Flex direction="column" align="center">
                      <Text color="#306844" fontSize="3xl">
                        {spec.name}
                      </Text>
                      <Avatar size="2xl" src={spec.photo} alt={spec.name} borderRadius="8px" />
                      <Text pt="8px">{spec.description}</Text>
                    </Flex>
                  </Flex>
                ))}
              </Flex>

              {individuals.length > 0 && (
                <Text mt="32px" color="#306844" fontSize="3xl" align="center">
                  INDIVIDUALS
                </Text>
              )}
              <Flex wrap="wrap" gap="16px" justify="center" align="flex-start">
                {individuals.map((individual) => (
                  <Flex border="solid 1px #306844" borderRadius="8px" p="16px" direction="column" key={individual.id}>
                    <Flex direction="column" align="center">
                      <Text
                        color="#306844"
                        fontSize="3xl"
                        _hover={{ cursor: "pointer" }}
                        onClick={() => {
                          if (mapRef.current) mapRef.current.flyTo([individual.latitude, individual.longitude], 18);
                          scrollToMap();
                        }}
                      >
                        {individual.name}
                      </Text>
                      <Text color="#306844" fontSize="xl">
                        {individual.species}
                      </Text>
                      <Avatar
                        size="2xl"
                        src={individual.photo}
                        alt={individual.name}
                        borderRadius="8px"
                        _hover={{ cursor: "pointer" }}
                        onClick={() => {
                          if (mapRef.current) mapRef.current.flyTo([individual.latitude, individual.longitude], 18);
                          scrollToMap();
                        }}
                      />
                      <Text pt="8px">{individual.description}</Text>
                    </Flex>
                    {individual.comments.length > 0 && (
                      <Flex direction="column" align="center">
                        <Divider borderColor="#306844" mt="8px" mb="8px" />
                        <List mb="8px">
                          {individual.comments.map((comment, index) => (
                            <Text key={index}>○ {comment}</Text>
                          ))}
                        </List>
                      </Flex>
                    )}
                    <Input
                      type="text"
                      _hover={{ borderColor: "#97B3A1" }}
                      focusBorderColor="#306844"
                      borderColor="#306844"
                      onKeyDown={(e) => {
                        handleKeyDown(e, individual.id);
                      }}
                      placeholder="Add a comment..."
                    />
                  </Flex>
                ))}
              </Flex>

              {habitats.length > 0 && (
                <Text mt="32px" color="#306844" fontSize="3xl" align="center">
                  HABITATS
                </Text>
              )}
              <Flex wrap="wrap" gap="16px" justify="center" align="flex-start">
                {habitats.map((habitat) => (
                  <Flex
                    border="solid 1px #306844"
                    borderRadius="8px"
                    p="16px"
                    direction="column"
                    justify="space-between"
                    key={habitat.id}
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
            </Flex>
          )}
        </>
      )}
    </>
  );
}

function CurrentLocation() {
  const [position, setPosition] = useState(null);
  const map = useMapEvents({
    click() {
      map.locate();
    },
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, 14);
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Moja lokacija</Popup>
    </Marker>
  );
}
