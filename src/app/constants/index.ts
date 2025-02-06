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

export const MODEL_URL = "https://dronos-telco-tpm-audit-65d6f93ac19ed972470b12db.s3.ap-southeast-1.amazonaws.com/mission-66138221b88124db892b8719/meshNxz/fc4eca68-45cf-4a59-a2ac-99b3b8b224fd_2024-04-08-08-46-44.nxs?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAX4QGSDYOYEQO3MWS%2F20250206%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20250206T052801Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjED4aDmFwLXNvdXRoZWFzdC0xIkgwRgIhAJuIvpf%2B7vD2ffGNKKYBp49l5kMAbCwclK73FdGhVHl2AiEA5S6VKeu1LJarwf0oYjUedxf6AV0PwfcyyW3uKM50qBsqoAUIVxAAGgw1NDIyNTMzOTEzODkiDFWcn3fE3BRe%2BnlPeyr9BIQRDGdzzPbYUAmb6Pq0cftiBfGC7pUHKoJzx1O%2Fu%2FyC1BrOpcyWHbZ6KVrk6uSQyOCEe1xku60uoY0exaK8CwZ2kaF5V6Llep1xhZgBTqu%2BiUT7q28KxvfnxyT%2FvP8xCpVx27AG5AAY8fqn9hWzoEljlsoJ8AwTO0smj8hcQXPxulA%2BlyGufqag1AvDWBNwWtYClDgVt6KHy9fOwau%2BUStQQzp2lJENlxkrvajaYWMhZptcEgbgs8Pe2W%2FxCay%2FVKn6%2BzYvvuM8RbzlIvfJKqLD7eL8%2Bx9ChbU1SvqyYsgzM4322Jgok2SFHGna%2FN96pTl3X%2BgDPc8ARE4BgCcFxFeFUsoA%2BIf%2BbEju%2BhXYNKaBmFPDFKOik%2BXvpLW2IxXDhqUOATGaWyTVzswL4McGpRFgAdpCic%2FPYcdohXaNKR1bEIOIkk2hsL5DjinGm8mvZRUoSi82BvaeWWBSZWldOolreCmdk0g000DWG3QNEQvQUfwWS8379jT4XLuisWlheqaz%2B%2B%2FEgAz%2BrsCJN06XZnk3xFq9oJAlyRegiI%2BGwL6KhYGEQUhl5pe0G4EhpyMDAzcC9nEgztvgEnrDpMlh1ztQluc6i7Gk4PEhvCkPNha4WZKQW4uiOUyPWLmnxr9h2slXFsL58OrNy7oyEvhIZ8r%2Fd9DlFj%2BV9kLFzVDunhrzy4mayGcUN7LNxPIOXECNRG9YYf8LIY1dDcyDUhO%2BWEmmVcbGyCQoBFcUUv6daAV0V9PonOJl7AKM4H%2BbJ0efsomsm5byjJel2VADSVnrOfRGE4CILHwk8T3PyUeOq4bJoj9B6riNK%2BQRUNtbgJLfK4y1sUtdp9ulkCn0cqsw4ZCRvQY6mgHzhXuSFKyY09RZniZQfzxseyEiTfSiMBaRD6aZmGNRM1DkVlejF%2FWT9t%2Ff4pR79TnItJ828zl%2B1LH2XzO4C%2BQ0WxsqHC3qVrhwGXjK6zmWIF5FyoX9p3ZYgNfsENc50nj43u4RxtSyqdDAqJEVjfgjGTd1IzI23a0KpjGNZeBBi2HcQgDl51g8l8k1gxm%2BpwYv7BhLd4fktQUh&X-Amz-Signature=61d4b4f8d802397dedf5cc0d967e2bae2b9ee2e942045751a8cc186bca856461&X-Amz-SignedHeaders=host&x-id=GetObject"