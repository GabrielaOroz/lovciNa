const mockData = {
  mockManagers: [
    {
      id: 1,
      name: "John",
      surname: "Doe",
      station: { name: "Puntijarka", latitude: 45.8659, longitude: 15.9722 },
    },
    {
      id: 2,
      name: "Emily",
      surname: "Johnson",
      station: { name: "Sljeme", latitude: 45.8634, longitude: 15.9772 },
    },
  ],

  mockActions: [
    {
      id: 1,
      title: "Study on Lion Movement",
      manager: {
        id: 1,
        name: "John",
        surname: "Doe",
        station: { name: "Puntijarka", latitude: 45.8659, longitude: 15.9722 },
      },
      start: "15.1.2023.", // biljezi se automatski kreiranjem akcije
      end: "15.2.2023", // biljezi se automatski kad se registrira da su svi tragaci zavrsili svoje zadatke
      status: 2, // 0: Not started, 1: In Progress, 2: Completed
      comments: ["Be careful."],
      species: [
        {
          id: 1,
          name: "African Lion",
          photo: "lion_photo_url",
          description: "They like to eat",
        },
      ],
      individuals: [
        {
          id: 1,
          name: "Lion",
          species: "African Lion",
          photo: "lion_photo_url",
          description: "Adult male lion",
          latitude: 45.8678,
          longitude: 15.9715,
          comments: ["Don't let him eat you."],
        },
        {
          id: 2,
          name: "Lion 2",
          species: "African Lion",
          photo: "lion_photo_url",
          description: "Adult female lion",
          latitude: 45.8668,
          longitude: 15.9732,
          comments: [],
        },
      ],
      habitats: [
        {
          id: 1,
          name: "Habitat of Lions",
          photo: "photo_url",
          description: "Some amazing stuff",
          latitude: 45.8668,
          longitude: 15.9732,
        },
      ],
      trackers: [
        {
          id: 1,
          name: "Alice",
          surname: "Smith",
          photo: "url_to_photo",
          medium: "by foot",
          latitude: 45.8685,
          longitude: 15.9725,
          tasks: [
            {
              id: 1,
              title: "Camera Trap Setup",
              start: "15.1.2023.", //automatski se postavi kad se kreira zadatak
              end: "15.2.2023",
              status: 2, // 0: Not started, 1: In Progress, 2: Completed
              coordinatesStart: [45, 15],
              coordinatesFinish: [45.2, 15.2],
              content: "Setting up cameras in designated areas.",
              comments: ["Weather conditions may affect camera placements."],
            },
            {
              id: 5,
              title: "Camera Trap Setup 2",
              start: "15.1.2023.",
              end: "15.2.2023",
              status: 2,
              coordinatesStart: [45, 15],
              coordinatesFinish: [45.1, 15.1],
              content: "Setting up cameras in designated areas.",
              comments: ["Weather conditions may affect camera placements."],
            },
          ],
        },
      ],
    },
    {
      id: 2,
      title: "Avian Migration Study",
      manager: {
        id: 2,
        name: "Emily",
        surname: "Johnson",
        station: { name: "Sljeme", latitude: 45.8634, longitude: 15.9772 },
      },
      start: "20.2.2023.",
      end: "",
      status: 1,
      comments: [""],
      species: [],
      individuals: [
        {
          id: 3,
          name: "Magpie",
          species: "Eurasian Magpie",
          photo: "magpie_photo_url",
          description: "Adult male magpie",
          latitude: 45.8639,
          longitude: 15.9778,
          comments: [],
        },
        {
          id: 4,
          name: "Magpie 2",
          species: "Eurasian Magpie",
          photo: "magpie_photo_url",
          description: "Adult female magpie",
          latitude: 45.8631,
          longitude: 15.9785,
          comments: [],
        },
      ],
      habitats: [],
      trackers: [
        {
          id: 2,
          name: "David",
          surname: "Brown",
          photo: "url_to_photo",
          medium: "dron",
          latitude: 45.8641,
          longitude: 15.9743,
          tasks: [
            {
              id: 2,
              title: "Deploy GPS Tags",
              start: "20.2.2023.",
              end: "",
              status: 1,
              coordinatesStart: [45, 15],
              coordinatesFinish: [45, 15],
              content: "Attaching GPS tags to selected bird species.",
              comments: ["Birds seem disturbed."],
            },
          ],
        },
        {
          id: 3,
          name: "Emily",
          surname: "Johnson",
          photo: "url_to_photo",
          medium: "car",
          latitude: 45.8637,
          longitude: 15.9769,
          tasks: [
            {
              id: 3,
              title: "Observation Period",
              start: "20.2.2023.",
              end: "",
              status: 0,
              coordinatesStart: [45, 15],
              coordinatesFinish: [45, 15],
              content: "Observe bird migration patterns during early morning hours.",
              comments: ["Weather conditions will affect visibility."],
            },
          ],
        },
      ],
    },
  ],

  mockNewActions: [
    {
      action: {
        id: 1,
        title: "Study on Lion Movement",
        manager: {
          id: 1,
          name: "John",
          surname: "Doe",
          station: { name: "Puntijarka", latitude: 45.8659, longitude: 15.9722 },
        },
        comments: [""],
        species: [],
        individuals: [],
        habitats: [],
        trackers: [
          {
            id: 1,
            name: "Alice",
            surname: "Smith",
            photo: "url_to_photo",
            medium: "by foot",
            latitude: 45.8685,
            longitude: 15.9725,
            tasks: [],
          },
        ],
      },
      existingSpecies: [],
      existingIndividuals: [],
      existingHabitats: [],
    },
    {
      action: {
        id: 2,
        title: "Avian Migration Study",
        manager: {
          id: 2,
          name: "Emily",
          surname: "Johnson",
          station: { name: "Sljeme", latitude: 45.8634, longitude: 15.9772 },
        },
        comments: [""],
        species: [],
        individuals: [],
        habitats: [],
        trackers: [
          {
            id: 2,
            name: "David",
            surname: "Brown",
            photo: "url_to_photo",
            medium: "dron",
            latitude: 45.8641,
            longitude: 15.9743,
            tasks: [],
          },
          {
            id: 3,
            name: "Emily",
            surname: "Johnson",
            photo: "url_to_photo",
            medium: "car",
            latitude: 45.8637,
            longitude: 15.9769,
            tasks: [],
          },
        ],
      },
      existingSpecies: [],
      existingIndividuals: [],
      existingHabitats: [],
    },
  ],
  mockSpecies: [
    { id: 0, name: "Lions", description: "they eat.", photo: "" },
    { id: 1, name: "Fish", description: "they eat.", photo: "" },
    { id: 2, name: "Bears", description: "they eat.", photo: "" },
  ],
  mockHabitats: [
    { id: 0, name: "Lion habitat", description: "he eats.", photo: "" },
    { id: 1, name: "Nemo habitat", description: "he eats.", photo: "" },
    { id: 2, name: "Bear habitat", description: "he eats.", photo: "" },
  ],
  mockIndividuals: [
    { id: 0, name: "Lion", species: "Lions", description: "they live in a cave", photo: "", comments: ["hello"] },
    { id: 1, name: "Fish", species: "Fish", description: "they live in a cave", photo: "", comments: ["hello"] },
    {
      id: 2,
      name: "Bear",
      species: "Bears",
      description: "they live in a cave",
      photo: "",
      comments: ["hello", "hello2"],
    },
  ],

  mockCoords: {
    animals: [
      {
        id: 0,
        species: "African Lion",
        coords: [
          [45.812345, 15.976123, 0.2],
          [45.811234, 15.978456, 0.4],
          [45.810987, 15.979876, 0.6],
          [45.813456, 15.977654, 0.8],
          [45.810234, 15.975678, 0.3],
          [45.811987, 15.980987, 0.5],
          [45.814567, 15.976789, 0.7],
          [45.809876, 15.978345, 0.9],
          [45.813789, 15.979012, 0.1],
        ],
      },
      {
        id: 1,
        species: "Fish",
        coords: [
          [45.808765, 15.981234, 1],
          [45.812678, 15.976543, 0.6],
          [45.811234, 15.982345, 0.4],
          [45.810987, 15.977654, 0.7],
          [45.813456, 15.980987, 0.3],
          [45.812345, 15.975678, 0.5],
          [45.811234, 15.979012, 0.9],
        ],
      },
      {
        id: 2,
        species: "Bears",
        coords: [
          [45.809876, 15.976789, 0.2],
          [45.810234, 15.980345, 0.6],
          [45.813789, 15.978456, 0.4],
          [45.814567, 15.981234, 0.8],
          [45.811111, 15.977777, 0.3],
          [45.813333, 15.979999, 0.5],
          [45.81, 15.976666, 0.7],
        ],
      },
    ],
    trackers: [
      {
        id: 0,
        medium: "ON_FOOT",
        coords: [
          [45.812222, 15.978888, 0.9],
          [45.813444, 15.981222, 0.1],
          [45.811999, 15.978111, 1],
          [45.815678, 15.980123, 0.3],
          [45.811234, 15.975678, 0.6],
          [45.814567, 15.977654, 0.4],
          [45.813456, 15.981234, 0.8],
          [45.812345, 15.979012, 0.2],
          [45.816789, 15.978345, 0.7],
          [45.810987, 15.982345, 0.5],
          [45.81789, 15.976789, 0.9],
          [45.812678, 15.983456, 0.1],
          [45.818901, 15.97789, 1],
        ],
      },
      {
        id: 1,
        medium: "ON_FOOT",
        coords: [
          [45.811234, 15.976123, 0.2],
          [45.812345, 15.978456, 0.4],
          [45.810987, 15.979876, 0.6],
          [45.813456, 15.977654, 0.8],
          [45.810234, 15.975678, 0.3],
          [45.811987, 15.980987, 0.5],
          [45.814567, 15.976789, 0.7],
          [45.809876, 15.978345, 0.9],
          [45.813789, 15.979012, 0.1],
          [45.808765, 15.981234, 1],
          [45.812678, 15.976543, 0.6],
          [45.811234, 15.982345, 0.4],
          [45.810987, 15.977654, 0.7],
          [45.813456, 15.980987, 0.3],
          [45.812345, 15.975678, 0.5],
          [45.811234, 15.979012, 0.9],
          [45.809876, 15.976789, 0.2],
          [45.810234, 15.980345, 0.6],
          [45.813789, 15.978456, 0.4],
          [45.814567, 15.981234, 0.8],
          [45.815678, 15.980123, 0.3],
          [45.811234, 15.975678, 0.6],
          [45.814567, 15.977654, 0.4],
          [45.813456, 15.981234, 0.8],
          [45.812345, 15.979012, 0.2],
          [45.816789, 15.978345, 0.7],
          [45.810987, 15.982345, 0.5],
          [45.81789, 15.976789, 0.9],
          [45.812678, 15.983456, 0.1],
        ],
      },
      {
        id: 2,
        medium: "CAR",
        coords: [
          [45.818901, 15.97789, 1],
          [45.8687, 15.9429, 0.3],
          [45.8692, 15.9475, 0.6],
          [45.8705, 15.9461, 0.4],
          [45.8723, 15.9482, 0.8],
          [45.871, 15.9447, 0.2],
          [45.8698, 15.9505, 0.7],
          [45.8709, 15.9413, 0.5],
          [45.8715, 15.9521, 0.9],
          [45.8696, 15.9441, 0.1],
          [45.87, 15.956, 1],
          [45.868, 15.948, 0.6],
          [45.872, 15.955, 0.4],
          [45.871, 15.942, 0.7],
          [45.873, 15.959, 0.3],
          [45.872, 15.946, 0.5],
          [45.87, 15.95, 0.9],
          [45.869, 15.945, 0.2],
          [45.8735, 15.958, 0.6],
          [45.874, 15.944, 0.4],
          [45.873, 15.96, 0.8],
          [45.8705, 15.94, 0.3],
          [45.871, 15.941, 0.5],
          [45.872, 15.946, 0.1],
          [45.871, 15.942, 0.8],
          [45.87, 15.938, 0.7],
          [45.869, 15.935, 0.9],
          [45.868, 15.932, 0.4],
          [45.867, 15.93, 0.6],
          [45.872, 15.948, 0.3],
          [45.873, 15.952, 0.5],
          [45.874, 15.956, 0.2],
          [45.875, 15.96, 0.8],
          [45.876, 15.964, 0.7],
          [45.877, 15.968, 0.9],
          [45.878, 15.972, 0.4],
          [45.879, 15.976, 0.6],
          [45.88, 15.98, 0.3],
          [45.881, 15.984, 0.5],
          [45.882, 15.988, 0.1],
          [45.883, 15.992, 0.8],
          [45.884, 15.996, 0.7],
          [45.885, 16.0, 0.9],
          [45.886, 16.004, 0.4],
          [45.887, 16.008, 0.6],
          [45.888, 16.012, 0.3],
          [45.889, 16.016, 0.5],
          [45.89, 16.02, 0.2],
        ],
      },
    ],
  },

  /* TRACKERS */
  tracker: {
    action: { title: "This is the title of the action", comments: ["yoyo"] },
    name: "Alice",
    surname: "Smith",
    medium: "CAR",
    station: { name: "Puntijarka", latitude: 45.9166667, longitude: 15.9666667 },
  },
  trackers: [
    {
      name: "Milka",
      surname: "Smith",
      coordinates: [45.9178, 15.9687],
    },
    {
      name: "Mirko",
      surname: "Smith",
      coordinates: [45.9202, 15.9764],
    },
    {
      name: "Marica",
      surname: "Smith",
      coordinates: [45.9123, 15.9601],
    },
  ],
  species: [
    {
      id: 1,
      name: "African Lion",
      photo: "lion_photo_url",
      description: "They like to eat",
    },
  ],
  individuals: [
    {
      id: 3,
      name: "Magpie",
      species: "Eurasian Magpie",
      photo: "magpie_photo_url",
      description: "Adult male magpie",
      latitude: 45.8639,
      longitude: 15.9778,
      comments: ["hi", "hi2"],
    },
    {
      id: 4,
      name: "Magpie 2",
      species: "Eurasian Magpie",
      photo: "magpie_photo_url",
      description: "Adult female magpie",
      latitude: 45.8631,
      longitude: 15.9785,
      comments: [],
    },
  ],
  habitats: [
    {
      id: 1,
      name: "Habitat of Lions",
      photo: "photo_url",
      description: "Some amazing stuff",
      latitude: 45.8668,
      longitude: 15.9732,
    },
  ],
  tasks: [
    {
      id: 1,
      title: "Camera Trap Setup",
      start: "15.1.2023.",
      end: "15.2.2023",
      status: 0,
      coordinatesStart: [45, 15],
      coordinatesFinish: [45.01, 15.01],
      content: "Setting up cameras in designated areas.",
      comments: ["Weather conditions may affect camera placements."],
    },
    {
      id: 5,
      title: "Camera Trap Setup 2",
      start: "15.1.2023.",
      end: "15.2.2023",
      status: 0,
      coordinatesStart: [45.1, 15.1],
      coordinatesFinish: [45.11, 15.11],
      content: "Setting up cameras in designated areas.",
      comments: ["Weather conditions may affect camera placements."],
    },
  ]
};

export default mockData;