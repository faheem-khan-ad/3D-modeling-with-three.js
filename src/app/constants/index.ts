export const ModelConfig = {
  centerObjZoomFactor: 0.5,
  pointSizeChangeFactor: 0.2,
  defaultPointSize: 1,
  minimumPointSize: 0,
};

export const CANVAS_MODEL_TYPES = {
  THREE_D_MESH: '3d',
  THREE_D_POINT_CLOUD: 'point-cloud',
};

export const CANVAS_VIEWER = {
  SCENE_BG: 0x14171f,
  SCENE_FOG_COLOR: 0x050505,
  AMBIENT_LIGHT_COLOR: 0xffffff,
  CUBOID_DEFAULT_COLOR: '#FF33CC',
  CAMERA_SIZING_FACTOR: 100,
  CUBOID_BORDER_COLOR: 0xfff000,
  CUBOID_DEFAULT_SIZING: 1,
  CUBOID_DEFAULT_SEGEMENT: 1, //this value doesnt matter unless we are using custom shaders. Adversely impacts the performance. (note: the shattering happens on min value 1 to avoid balance value given)
  CUBOID_DEFAULT_MANUAL_NAME: 'ANT_',
  REFERENCE_MARKER_COLOR: 0xffff00,
  REFERENCE_POLYGON_COLOR: 0xffff00,
  MEASUREMENT_COLOR: 0x00f0ff,
  MEASUREMENT_COLOR_LABEL_TEXT_HEX: '#00F0FF',
  MEASUREMENT_COLOR_LABEL_BG_HEX: '#24262B',
  MEASUREMENT_COLOR_LABEL_BORDER_HEX: '#4E5B6D',
  REFERENCE_OFFSET: 0.05,
  BOUNDARY_WIDTH_DEFAULT: 1,
  BOUNDARY_WIDTH_SELECTED: 6,
  RAYCAST_THRESHOLD: 0.07, // Default: 1, 0.07 suitable for mesh and point-cloud
  AUTO_SAVE_INTERVAL: 300000, // 5 minutes
};

export const BOUNDING_BOX_SIZE = { x: 2, y: 2, z: 2 }

export const OBJMODELSDATA = [{
  name: 'Poynting_HELI-3',
  path: 'assets/Antenna/Helical/Poynting_HELI-3/Poynting_HELI-3.obj',
  geometry: { x: 1.04, y: 0.145, z: 0.12 }
  // geometry: { x: 0.145, y: 0.12, z: 1.04 }
},
{
  name: 'Antenna-Omni',
  path: 'assets/Antenna/Omni/3X-RRV4-65B-R12/3X-RRV4-65B-R12.obj',
  geometry: { x: 0.58, y: 2.1, z: 0.58 }

},
{
  name: 'Antenna-Dish',
  path: 'assets/Antenna/Dish/HX6-11W-2WH/HX6-11W-2WH.obj',
  geometry: { x: 1.8, y: 1.8, z: 1.206 }
},
{
  name: 'Antenna-Panel',
  path: 'assets/Antenna/Panel/APXBL06B_43-CT5/APXBL06B_43-CT5.obj',
  geometry: { x: 0.35, y: 0.62, z: 0.2 }
},
{
  name: 'BENELEC_174502S',
  path: 'assets/Transceiver%20Junction/Splitters/BENELEC_174502S/BENELEC_174502S.obj',
  geometry: { x: 0.082, y: 0.105, z: 0.024 }
}
]

export const MODEL_URL = 'https://dronos-telco-tpm-audit-65d6f93ac19ed972470b12db.s3.ap-southeast-1.amazonaws.com/mission-66138221b88124db892b8719/meshNxz/fc4eca68-45cf-4a59-a2ac-99b3b8b224fd_2024-04-08-08-46-44.nxs?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAX4QGSDYOQW3JEHLD%2F20250224%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20250224T093647Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDmFwLXNvdXRoZWFzdC0xIkYwRAIgPPQ2kPbh10QkkqiEkHB%2B3%2FhvrYhs3xGfjA6TiWmbAAQCIC82Hk3TKd0UmtUg3VRdoAErgxjtMX6ZoayxSIF%2FqeJAKqAFCCsQABoMNTQyMjUzMzkxMzg5IgwwwLiS03ru4VOfZmgq%2FQTdoKpnkm0uUhIrKlT3bh33ojLCAukSHMkaUhKlnb%2BhUkdOQlGjzupWjm4981Z4MHiTFXTFHwrU5myvtBxqFQyvc7JoNymjCy1YmE%2FeDU1xGZ%2BIEiTDgLXq9Ys%2Bwtz%2BwdzB2u6eLJ77Offe%2BmMA8ftiINs0wiWroreLcgR7DnbWffRbeJwbpq%2BlHLSgPgNAz42kXNa77%2BWIa6vN5OV54WbXVaCenq8IKvcEqtjnMgY10BZxAlp5HPfLDznDG2HTaLc7dsBsb%2Fw0QoZaehcUn4qJhwQhlO1cKTi%2FK1Ge%2BNFotEX49iXCt35Htj5hG0NHPcKw5KkjEDnzDsSibIEZU45ej0JhTen2V1L4weajKBjfNNJOq2gCgweAHdAsVVEPWUuS09P8%2F4ZDAWrVl3w%2FpiUTCX8JW94hvt2S4GuKaObrFmIR%2B%2FjOhazGXyCrOPedJHUComlcri0MLenvA7vAG0OpABNEL5LUlFxoC2P83Suqmol%2Bfj%2BSBHq7hsCjeqc9xWuZ913VKh7XqtYzhhZ7%2FvGtP5q11zU8NBFJITUb1eN0rk6gB4vjSl5BpzrmFIJzcToPscYoJl0PFVf08nn%2FA1u4gf8S7NqKdZUVfHbqXV49wgFqNUZxC8W7NbLpn41TTKXzapMkBzHragVk%2BXxHXy8n5BXNrShk6fF%2BRVt9kf%2Fsxn7QPhtPFV6N3OWmDJk19hoOjyToCCIRZ4TgIZIWg9Ij71VgzBy7SpGv7WvRflxLbFKQR%2B%2FAm3PKs%2Fn7BubF%2F%2FInZjpVYOoHOcHqymSh%2FDjza%2Fo9EX7ZYW3bFI7TgeM%2FZlP0C9Dxy8QYPiXh6nYby5SwhWompDWedH5CZYrFMK%2F78L0GOpwBIKuK%2FwwfpwX2VIuklaSBJkQkIrS4we4gVowrYia67U2paGErFBH5yCmjUZkK%2FQUrHQnEwaPUd7pjjS48ZzuaoRprcPhEBbsjr76ClB6lWur06EPU72EpIzaYJkPqmQn6BT2x7sLcd32sWl6oqc4ttYnb5lApNRG0iM7dUKtmcOp9yI3xnjy%2F4U0Y%2BRL0TYOY6TpZL%2FRzt7c%2BOxkZ&X-Amz-Signature=66b2994f963f25dd1ae6af5dfcb4f340c85696cebc86200e4ef715cee9400303&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject'