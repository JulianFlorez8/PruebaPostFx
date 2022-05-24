import * as THREE from "three";
let materialColorsByType = {
  policy: {
    color: 0x193ad9,
    ambient: 0x6e0000,
    emissive: 0x000078,
    specular: 0x00c3ff,
    shininess: 0
  },
  asset: {
    color: 0x023dcd,
    ambient: 0x0096ff,
    emissive: 0x005f93,
    specular: 0x0f4ec3,
    shininess: 0
  },
  resource: {
    color: 0x724a01,
    ambient: 0xff1eff,
    emissive: 0x112ba2,
    specular: 0x550000,
    shininess: 0
  },
  action: {
    color: 0xa71309,
    ambient: 0x2f1300,
    emissive: 0xc04f00,
    specular: 0x898102,
    shininess: 0
  },
  technique: {
    color: 0x000000,
    ambient: 0x590000,
    emissive: 0x910000,
    specular: 0xffb400,
    shininess: 0
  },
  market: {
    color: 0x002202,
    ambient: 0x1102ff,
    emissive: 0x00822d,
    specular: 0x015d84,
    shininess: 0
  },
  mitigation: {
    color: 0x022cf0,
    ambient: 0xac033f,
    emissive: 0xc00043,
    specular: 0x201800,
    shininess: 0
  }
};

const materialColorsDisableStatus = {
  color: 0xffffff,
  ambient: 0xb2b8c5,
  emissive: 0x8787ca,
  specular: 0xffffff
};

const createSphere = (type, isDisabled) => {
  let materialOptions = isDisabled
    ? materialColorsDisableStatus
    : materialColorsByType[type];
  const geometry = new THREE.SphereBufferGeometry(5, 32, 32);
  const material = new THREE.MeshPhongMaterial(materialOptions);
  const sphere = new THREE.Mesh(geometry, material);
  return sphere;
};

const createLight = sphere => {
  var pointLight = new THREE.SpotLight(0xffffff, 2, 20, 0.5);
  pointLight.position.set(-5, 5, 8);
  pointLight.target = sphere;
  return pointLight;
};

const makeUnSavedSphere = (group, sphereGeometry) => {
  // let material = new THREE.MeshLambertMaterial({
  //     color: 'gray',
  //     emissive: 'lightgray',
  //     side: THREE.BackSide,
  // });
  var material = new THREE.ShaderMaterial({
    uniforms: {
      color1: {
        value: new THREE.Color("#ffffff")
      },
      color2: {
        value: new THREE.Color("#a8a8a8")
      }
    },
    vertexShader: `
        varying vec2 vUv;
    
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,
    fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;
      
        varying vec2 vUv;
        
        void main() {
          
          gl_FragColor = vec4(mix(color2, color1, vUv.y), 1.0);
        }
      `,
    side: THREE.BackSide
  });
  let savedSphere = new THREE.Mesh(sphereGeometry, material);
  savedSphere.scale.multiplyScalar(1.2);
  savedSphere.rotation.set(0.5, 0.5, 0.5);
  group.add(savedSphere);
};

const makeUnSavedAndSelectedSphere = (group, sphereGeometry) => {
  let material = new THREE.MeshBasicMaterial({
    color: "#0078FF",
    side: THREE.BackSide
  });
  let selectedSphere = new THREE.Mesh(sphereGeometry, material);
  selectedSphere.scale.multiplyScalar(1.24);
  group.add(selectedSphere);
};

const makeSavedAndSelectedSphere = (group, sphereGeometry) => {
  let materialLight = new THREE.MeshBasicMaterial({
    color: "#fff",
    side: THREE.BackSide
  });

  let lightSphere = new THREE.Mesh(sphereGeometry, materialLight);
  lightSphere.scale.multiplyScalar(1.06);
  group.add(lightSphere);

  let materialSelected = new THREE.MeshBasicMaterial({
    color: "#0078FF",
    side: THREE.BackSide
  });

  let selectedSphere = new THREE.Mesh(sphereGeometry, materialSelected);
  selectedSphere.scale.multiplyScalar(1.1);
  group.add(selectedSphere);
};

export const createNode = (type, status, isSaved) => {
  let group = new THREE.Group();
  let sphere = createSphere(type, status === "disabled");
  let light = createLight(sphere);
  group.add(sphere);
  group.add(light);
  if (!isSaved) {
    makeUnSavedSphere(group, sphere.geometry);
    if (status === "selected") {
      makeUnSavedAndSelectedSphere(group, sphere.geometry);
    }
  }
  if (status === "selected" && isSaved) {
    makeSavedAndSelectedSphere(group, sphere.geometry);
  }
  return group;
};
