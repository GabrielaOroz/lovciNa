import { Text, Button, Box, Flex, Checkbox, List, Avatar, Divider, Input } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { LayerGroup, LayersControl, MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import GreenButton from "../shared/GreenButton";
import YellowButton from "../shared/YellowButton";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { redIcon, greenIcon, blackIcon } from "../shared/mapIcons.jsx";

export default function Tracker() {
  const [openTasks, setOpenTasks] = useState(false);
  const [openAnimals, setOpenAnimals] = useState(false);

  const mapRef = useRef(null);

  /* TODO - pracenje tragaca */

  /* TODO - izbrisat i dohvatit stvarne podatke */
  /* MOCK DATA */
  const sljemePuntijarkaCoordinates = [45.9166667, 15.9666667];
  const mockTrackers = [
    { name: "Milka", coordinates: [45.9178, 15.9687] },
    { name: "Mirko", coordinates: [45.9202, 15.9764] },
    { name: "Marica", coordinates: [45.9123, 15.9601] },
  ];
  const mockAnimals = [
    {
      id: 1,
      species: "Bear",
      image: "https://source.unsplash.com/featured/?bear",
      description: "A large, brown bear known to roam the area.",
      hasGPS: true,

      history: [
        { coordinates: [45.9178, 15.9687], timestamp: "2023-12-01T10:00:00Z" },
        { coordinates: [45.9202, 15.9764], timestamp: "2023-12-02T12:30:00Z" },
      ],
      coordinates: [45.9187, 15.9715],
      comments: ["Pojeo je 10 riba"],
    },
    {
      id: 2,
      species: "Deer",
      image: "https://source.unsplash.com/featured/?deer",
      description: "Smeđi jelen",
      hasGPS: true,

      history: [
        { coordinates: [45.9178, 15.9687], timestamp: "2023-12-01T10:00:00Z" },
        { coordinates: [45.9202, 15.9764], timestamp: "2023-12-02T12:30:00Z" },
      ],
      coordinates: [45.9246, 15.9598],
      comments: ["Bacio se u rijeku", "Nije jeo 3 dana"],
    },
    {
      id: 3,
      species: "Hedgehog",
      image: "https://source.unsplash.com/featured/?hedgehog",
      description: "Smeđi jež",
      hasGPS: true,

      history: [
        { coordinates: [45.9178, 15.9687], timestamp: "2023-12-01T10:00:00Z" },
        { coordinates: [45.9202, 15.9764], timestamp: "2023-12-02T12:30:00Z" },
      ],
      coordinates: [45.9144, 15.9792],
      comments: ["Ima opasne bodlje"],
    },
  ];
  const mockTasks = [
    {
      id: 1,
      description: "Find clues near the river",
      content: "",
      idTracker: 1,
      idAction: 1,
      idAnimal: 1,
      idRoute: 1,
      latitude: "",
      longitude: "",
      area: 2.5,
      status: false,

      comments: ["Pazi da ne upadneš u rijeku", "Pazi da te ne udari riba dok iskače iz rijeke"],
    },
    {
      id: 2,
      description: "Track animal footprints",
      content: "",
      idTracker: 1,
      idAction: 1,
      idAnimal: 1,
      idRoute: 1,
      latitude: "",
      longitude: "",
      area: 2.5,
      start: "",
      end: "",
      status: true,

      comments: ["Pazi da te ne pojede medo"],
    },
  ];

  /* TODO - prebacit u poseban file */
  const redIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
  const greenIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
  const blackIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <>
      <Text color="#306844" fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }} alignSelf="center">
        Tracker
      </Text>

      <Box h="600px" p="16px">
        {/* TODO - generiranje mape ovisno o sposobnosti (pješke, dron, avion...) */}
        <MapContainer
          ref={mapRef}
          style={{ height: "100%", width: "100%" }}
          center={sljemePuntijarkaCoordinates}
          zoom={14}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LayersControl position="topright">
            <LayersControl.Overlay checked name="Postaja">
              {/* TODO - prikazat postaju kojoj tracker pripada */}
              <Marker icon={blackIcon} position={sljemePuntijarkaCoordinates}>
                <Popup>Puntijarka, Sljeme</Popup>
              </Marker>
            </LayersControl.Overlay>
            <LayersControl.Overlay checked name="Pozicije tragača na akciji">
              <LayerGroup>
                {mockTrackers.map((tracker, index) => (
                  <Marker key={index} icon={greenIcon} position={tracker.coordinates}>
                    <Popup>{tracker.name}</Popup>
                  </Marker>
                ))}
              </LayerGroup>
            </LayersControl.Overlay>
            <LayersControl.Overlay checked name="Pozicije praćenih životinja">
              <LayerGroup>
                {mockAnimals.map((animal, index) => (
                  <Marker key={index} icon={redIcon} position={animal.coordinates}>
                    <Popup>{animal.species}</Popup>
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
      <div style={{ position: "absolute", top: "480px", right: "45px", zIndex: "1000" }}>
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
          {/* TODO - komentari na akciji */}
          <GreenButton>Action comments</GreenButton>
        </Flex>
        {/* TODO - close i komentare na akciji */}
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

      {/* TODO - load tasks/animals vezano za akciju i tragača */}
      {openTasks && (
        <Flex direction="column" p="16px" gap="16px">
          {mockTasks.map((task) => (
            <Box border="solid 1px #306844" borderRadius="8px" p="8px" key={task.id}>
              <Flex align="center" gap="8px">
                <Text as="b" color="#306844">
                  {task.description}
                </Text>
                {/* TODO - označavanje da je zadatak gotov, ako su svi gotovi micanje s akcije */}
                <Checkbox colorScheme="green" key={task.id} /*isChecked={task.completed}*/ />
              </Flex>
              <List>
                {task.comments.map((comment) => (
                  <Text>
                    {"\t"} ○ {comment}
                  </Text>
                ))}
              </List>
            </Box>
          ))}
        </Flex>
      )}
      {/* TODO - svaka životinja ima povijest gdje je bila */}
      {openAnimals && (
        <Flex p="16px" gap="16px" wrap="wrap" justify="center">
          {mockAnimals.map((animal) => (
            <Flex
              w="280px"
              border="solid 1px #306844"
              borderRadius="8px"
              p="16px"
              direction="column"
              justify="space-between"
            >
              <Flex direction="column" align="center" key={animal.id}>
                <Text
                  color="#306844"
                  fontSize="3xl"
                  onClick={() => {
                    const map = mapRef.current;
                    if (map) map.flyTo(animal.coordinates, 18);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {animal.species}
                </Text>
                <Avatar
                  size="2xl"
                  src={animal.image}
                  alt={animal.species}
                  borderRadius="8px"
                  onClick={() => {
                    const map = mapRef.current;
                    if (map) map.flyTo(animal.coordinates, 18);
                  }}
                  style={{ cursor: "pointer" }}
                />
                <Text align="center" pt="8px">
                  {animal.description}
                </Text>
              </Flex>
              <Flex direction="column">
                <Divider borderColor="#306844" mt="8px" mb="16px" />
                <List mb="16px">
                  {animal.comments.map((comment) => (
                    <Text>
                      {"\t"} ○ {comment}
                    </Text>
                  ))}
                </List>
                {/* TODO - spremati nove komentare */}
                <Input
                  id="animalComment"
                  type="text"
                  _hover={{ borderColor: "#97B3A1" }}
                  focusBorderColor="#306844"
                  borderColor="#306844"
                  placeholder="Add a comment"
                />
              </Flex>
            </Flex>
          ))}
        </Flex>
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
