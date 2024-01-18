import { Text, Button, Box, Flex, Checkbox, List, Avatar, Divider, Input } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { LayerGroup, LayersControl, MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import GreenButton from "../shared/GreenButton";
import YellowButton from "../shared/YellowButton";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { redIcon, greenIcon, blackIcon } from "../shared/mapIcons.jsx";
import mockData from "../../mockData.jsx";
import { color } from "framer-motion";

export default function Tracker() {
  const [openTasks, setOpenTasks] = useState(false);
  const [openAnimals, setOpenAnimals] = useState(false);
  const [tracker, setTracker] = useState({});
  const [trackers, setTrackers] = useState([]);
  const [individuals, setIndividuals] = useState([]);
  const [tasks, setTasks] = useState([]);
  const mapRef = useRef(null);
  const [comments, setComments] = useState([]);

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
        setComments(
          data.action.animals &&
            data.action.animals.reduce((obj, individual) => {
              obj[individual.id] = individual.comments;
              return obj;
            }, {})
        );
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

  /* DONE */

  const putDoneTasks = (id) => {
    fetch("http://localhost:8000/tracker/doneTasks", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ [id]: 2 }),
    }).then((res) => {
      if (res.ok) {
        window.location.reload();
      }
    });
  };

  /* NEW ANIMAL COMMENT */
  const handleComment = (e, id) => {
    setComments({ ...comments, [id]: [...comments[id], e.target.value] });
  };

  const putComments = (id) => {
    let comment = comments[id].slice(-1)[0];
    fetch("http://localhost:8000/tracker/newComments", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({[id]: [comment]}),
    }).then((res) => {
      if (res.ok) {
        window.location.reload();
      }
    });
  };

  /* NEW ACTION COMMENT */
  const [commentsAction, setCommentsAction] = useState(
    tracker && tracker.action && tracker.action.comments ? tracker.action.comments : []
  );

  const handleChange = (e) => {
    setCommentsAction((prevComments) => [...prevComments, e.target.value]);
  };

  const putActionComments = () => {
    let comment = commentsAction.slice(-1)[0];
    fetch("http://localhost:8000/tracker/actionComments", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify([comment]),
    }).then((res) => {
      if (res.ok) {
        window.location.reload();
      }
    });
  };

  /* ROUTES */
  const RoutingMachine = ({ task }) => {
    const map = useMap();

    const createRoutingMachineLayer = () => {
      const instance = L.Routing.control({
        waypoints: [L.latLng(task.latStart, task.lonStart), L.latLng(task.latFinish, task.lonFinish)],
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
        if (map && routingMachineLayer) {
          map.removeControl(routingMachineLayer);
        }
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
      {(!tracker || !tracker.station || !tracker.action) && (
        <Text align="center">
          <strong>You don't have any actions yet</strong>
        </Text>
      )}
      {tracker && tracker.station && (
        <>
          <Text color="#306844" fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }} alignSelf="center">
            Tracker
          </Text>
          <Text color="#306844" fontSize={{ base: "xl", md: "2xl", lg: "3xl" }} alignSelf="center">
            {tracker.name} {tracker.surname}
          </Text>
          {tracker.action && (
            <Text color="gray.400" fontSize={{ base: "md", md: "lg", lg: "xl" }} alignSelf="center">
              {tracker.medium.type}
            </Text>
          )}

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
              {tracker.action.tasks &&
                tracker.action.tasks.length > 0 &&
                tracker.action.tasks.map((task) => <RoutingMachine key={task.id} task={task} />)}
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
                    {tracker.action.animals.length > 0 &&
                      tracker.action.animals.map((animal, index) => (
                        <>
                          {animal.latitude && animal.longitude && (
                            <Marker key={index} icon={redIcon} position={[animal.latitude, animal.longitude]}>
                              <Popup>{animal.name}</Popup>
                            </Marker>
                          )}
                        </>
                      ))}
                  </LayerGroup>
                </LayersControl.Overlay>
                <LayersControl.Overlay checked name="Pozicije staništa">
                  <LayerGroup>
                    {tracker.action.habitats.length > 0 &&
                      tracker.action.habitats.map((habitat, index) => (
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
                {tracker.action.comments &&
                  tracker.action.comments.length > 0 &&
                  tracker.action.comments.map((comment, index) => (
                    <Text key={index}>
                      {"\t"} ○ {comment}
                    </Text>
                  ))}
              </List>
            </>
          )}

          {tracker.action && (
            <Flex gap="4px">
              <Input
                ml="16px"
                mt="8px"
                mb="16px"
                w="200px"
                type="text"
                _hover={{ borderColor: "#97B3A1" }}
                focusBorderColor="#306844"
                borderColor="#306844"
                onChange={(e) => handleChange(e)}
                placeholder="Add a comment..."
              />
              <GreenButton onClick={putActionComments} alignSelf="center" mt="8px" mb="16px" w="64px">
                Add
              </GreenButton>
            </Flex>
          )}

          {tracker.action && (
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
          )}

          {openTasks && (
            <Flex direction="column" p="16px" gap="16px">
              {tracker.action.tasks.length > 0 &&
                tracker.action.tasks.map(
                  (task) =>
                    task.status == "ACTIVE" && (
                      <Box align="center" border="solid 1px #306844" borderRadius="8px" p="8px" key={task.id}>
                        <Flex gap="4px" direction="column">
                          <Text
                            as="b"
                            color="#306844"
                            fontSize="xl"
                            onClick={() => {
                              const map = mapRef.current;
                              if (map && task.latFinish && task.lonFinish)
                                map.flyTo([task.latFinish, task.lonFinish], 15);
                              scrollToMap();
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
                        <GreenButton mt="8px" onClick={() => putDoneTasks(task.id)}>
                          Done
                        </GreenButton>
                      </Box>
                    )
                )}
            </Flex>
          )}
          {openAnimals && (
            <Flex justify="center" direction="column">
              {tracker.action.species.length > 0 && (
                <Text mt="32px" color="#306844" fontSize="3xl" align="center">
                  SPECIES
                </Text>
              )}
              <Flex wrap="wrap" gap="16px" justify="center" align="flex-start">
                {tracker.action.species.map((spec) => (
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
                      <Avatar
                        size="2xl"
                        src={`data:image/jpeg;base64,${spec.photo}`}
                        alt={spec.name}
                        borderRadius="8px"
                      />
                      <Text pt="8px">{spec.description}</Text>
                    </Flex>
                  </Flex>
                ))}
              </Flex>

              {tracker.action.animals.length > 0 && (
                <Text mt="32px" color="#306844" fontSize="3xl" align="center">
                  INDIVIDUALS
                </Text>
              )}
              <Flex wrap="wrap" gap="16px" justify="center" align="flex-start">
                {tracker.action.animals.map((individual) => (
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
                        {individual.species.name}
                      </Text>
                      <Avatar
                        size="2xl"
                        src={`data:image/jpeg;base64,${individual.photo}`}
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
                          {individual.comments &&
                            individual.comments.map((comment, index) => <Text key={index}>○ {comment}</Text>)}
                        </List>
                      </Flex>
                    )}
                    <Input
                      type="text"
                      _hover={{ borderColor: "#97B3A1" }}
                      focusBorderColor="#306844"
                      borderColor="#306844"
                      onChange={(e) => handleComment(e, individual.id)}
                      placeholder="Add a comment..."
                    />
                    <GreenButton onClick={() => putComments(individual.id)} mt="8px">
                      Add
                    </GreenButton>
                  </Flex>
                ))}
              </Flex>

              {tracker.action.habitats.length > 0 && (
                <Text mt="32px" color="#306844" fontSize="3xl" align="center">
                  HABITATS
                </Text>
              )}
              <Flex wrap="wrap" gap="16px" justify="center" align="flex-start">
                {tracker.action.habitats.map((habitat) => (
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
                        src={`data:image/jpeg;base64,${habitat.photo}`}
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
