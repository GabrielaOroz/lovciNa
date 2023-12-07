import { Text, Box, Flex, Divider, Avatar, List, AbsoluteCenter } from "@chakra-ui/react";
import { useRef, useState } from "react";
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

  const [openActions, setOpenActions] = useState(false);
  const [showTasks, setShowTasks] = useState(() =>
    mockData.mockActions.reduce((obj, action) => {
      obj[action.id] = false;
      return obj;
    }, {})
  );

  const handleToggleTask = (id) => {
    setShowTasks({ ...showTasks, [id]: !showTasks[id] });
  };

  const scrollToMap = () => {
    const mapSection = document.getElementById('mapSection');
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
                {mockData.mockActions.map((action, index) => (
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
                {mockData.mockActions.map((action, index) =>
                  action.tasks.map((task, index) => (
                    <Marker key={index} icon={greenIcon} position={[task.tracker.latitude, task.tracker.longitude]}>
                      <Popup>
                        {task.tracker.name} {task.tracker.surname}
                      </Popup>
                    </Marker>
                  ))
                )}
              </LayerGroup>
            </LayersControl.Overlay>
            <LayersControl.Overlay checked name="Pozicije praćenih životinja">
              <LayerGroup>
                {mockData.mockActions.map((action, index) =>
                  action.tasks.map((task, index) =>
                    task.animals.map((animal, index) => (
                      <Marker key={index} icon={redIcon} position={[animal.latitude, animal.longitude]}>
                        <Popup>{animal.species}</Popup>
                      </Marker>
                    ))
                  )
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
          <Link to="/new-action"><GreenButton>Create new action</GreenButton></Link>
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
          {/* TODO - load podatke vezano za istrazivaca umjesto mock */}
          {mockData.mockActions.map((action) => (
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
                {action.manager.name} {action.manager.surname}, {action.manager.station.name}
              </Text>
              <Text color="gray" fontSize="sm" align="center">
                {action.status}, {action.start} - {action.end}
              </Text>
              {action.comment && (
                <Text mt="8px" align="center">
                  ○ {action.comment}
                </Text>
              )}

              <Box position="relative" padding="10">
                <Divider borderColor="#306844" />
                <AbsoluteCenter bg="#F9F7ED" px="4" color="#306844">
                  {!showTasks[action.id] && (
                    <Flex
                      _hover={{ cursor: "pointer" }}
                      align="center"
                      gap="8px"
                      onClick={() => handleToggleTask(action.id)}
                    >
                      <IoIosArrowDown /> show tasks
                    </Flex>
                  )}
                  {showTasks[action.id] && (
                    <Flex
                      _hover={{ cursor: "pointer" }}
                      align="center"
                      gap="8px"
                      onClick={() => handleToggleTask(action.id)}
                    >
                      <IoIosArrowUp /> hide tasks
                    </Flex>
                  )}
                </AbsoluteCenter>
              </Box>

              {showTasks[action.id] && (
                <>
                  {action.tasks.map((task) => (
                    <>
                      <Text color="#306844" fontSize="2xl" align="center" mt="16px">
                        {task.title}
                      </Text>
                      <Text
                        align="center"
                        _hover={{ cursor: "pointer", color: "#306844" }}
                        onClick={() => {
                          if (mapRef.current) mapRef.current.flyTo([task.tracker.latitude, task.tracker.longitude], 18);
                          scrollToMap();
                        }}
                      >
                        {task.tracker.name} {task.tracker.surname}
                      </Text>
                      <Text color="gray" fontSize="sm" align="center">
                        {task.status}, {task.start} - {task.end}
                      </Text>
                      <Text mt="8px" align="center">
                        {task.content}
                      </Text>

                      {task.animals && (
                        <Flex p="16px" gap="16px" wrap="wrap" justify="center">
                          {task.animals.map((animal) => (
                            <Flex
                              border="solid 1px #306844"
                              borderRadius="8px"
                              p="16px"
                              direction="column"
                              justify="space-between"
                              key={animal.id}
                            >
                              <Flex direction="column" align="center">
                                <Text
                                  color="#306844"
                                  fontSize="3xl"
                                  _hover={{ cursor: "pointer" }}
                                  onClick={() => {
                                    if (mapRef.current)
                                      mapRef.current.flyTo([animal.latitude, animal.longitude], 18);
                                    scrollToMap();
                                  }}
                                >
                                  {animal.species}
                                </Text>
                                <Avatar
                                  size="2xl"
                                  src={animal.photo}
                                  alt={animal.species}
                                  borderRadius="8px"
                                  _hover={{ cursor: "pointer" }}
                                  onClick={() => {
                                    if (mapRef.current)
                                      mapRef.current.flyTo([animal.latitude, animal.longitude], 18);
                                    scrollToMap();
                                  }}
                                />
                                <Text pt="8px">{animal.description}</Text>
                              </Flex>
                              {animal.comments.length == 0 ? (
                                ""
                              ) : (
                                <Flex direction="column">
                                  <Divider borderColor="#306844" mt="8px" mb="8px" />
                                  <List mb="8px">
                                    {animal.comments.map((comment, index) => (
                                      <Text key={index}>○ {comment}</Text>
                                    ))}
                                  </List>
                                </Flex>
                              )}
                            </Flex>
                          ))}
                        </Flex>
                      )}
                    </>
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
