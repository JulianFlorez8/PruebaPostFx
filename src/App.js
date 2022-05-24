import React from "react";
import * as THREE from "three";
import ForceGraph3D from "react-force-graph-3d";
import { RenderPass, EffectComposer, OutlinePass } from "three-outlinepass";
import { createNode } from "./config";
import "./styles.css";

const { useState, useEffect, useCallback, useRef } = React;

let outlinePassEffect = null;

const createHoverEffect = (scene, camera, renderer) => {
  const clock = new THREE.Clock();
  let compose = new EffectComposer(renderer);
  let renderPass = new RenderPass(scene, camera);

  outlinePassEffect = new OutlinePass(renderer.getSize(), scene, camera);
  outlinePassEffect.renderToScreen = true;

  outlinePassEffect.edgeStrength = 5;
  outlinePassEffect.edgeGlow = 1;
  outlinePassEffect.edgeThickness = 3.3;
  outlinePassEffect.pulsePeriod = 0;
  outlinePassEffect.visibleEdgeColor.set(0x0078ff);

  compose.addPass(renderPass);
  compose.addPass(outlinePassEffect);

  const render = () => {
    requestAnimationFrame(render);
    compose.render(clock.getDelta());
  };

  render();
};

const App = () => {
  const ref = useRef(null);
  const [bg, setBg] = useState(undefined);
  const [data, setData] = useState({
    nodes: [
      { id: 0, type: "policy", status: "default", isSaved: false },
      { id: 1, type: "asset", status: "default", isSaved: false },
      { id: 2, type: "resource", status: "default", isSaved: false },
      { id: 3, type: "action", status: "default", isSaved: false },
      { id: 4, type: "technique", status: "default", isSaved: false },
      { id: 5, type: "market", status: "default", isSaved: false },
      { id: 6, type: "mitigation", status: "default", isSaved: false },
      { id: 7, type: "policy", status: "selected", isSaved: true },
      { id: 8, type: "asset", status: "selected", isSaved: true },
      { id: 9, type: "resource", status: "selected", isSaved: true },
      { id: 10, type: "action", status: "selected", isSaved: true },
      { id: 11, type: "technique", status: "selected", isSaved: true },
      { id: 12, type: "market", status: "selected", isSaved: true },
      { id: 13, type: "mitigation", status: "selected", isSaved: true },
      { id: 14, type: "mitigation", status: "disabled", isSaved: false },
      { id: 15, type: "policy", status: "hover", isSaved: true },
      { id: 16, type: "asset", status: "hover", isSaved: true },
      { id: 17, type: "resource", status: "hover", isSaved: true },
      { id: 18, type: "action", status: "hover", isSaved: true },
      { id: 19, type: "technique", status: "hover", isSaved: true },
      { id: 20, type: "market", status: "hover", isSaved: true },
      { id: 21, type: "mitigation", status: "hover", isSaved: true },
      { id: 22, type: "policy", status: "selected", isSaved: false },
      { id: 23, type: "asset", status: "selected", isSaved: false },
      { id: 24, type: "resource", status: "selected", isSaved: false },
      { id: 25, type: "action", status: "selected", isSaved: false },
      { id: 26, type: "technique", status: "selected", isSaved: false },
      { id: 27, type: "market", status: "selected", isSaved: false },
      { id: 28, type: "mitigation", status: "selected", isSaved: false },
      { id: 29, type: "policy", status: "hover", isSaved: false },
      { id: 30, type: "asset", status: "hover", isSaved: false },
      { id: 31, type: "resource", status: "hover", isSaved: false },
      { id: 32, type: "action", status: "hover", isSaved: false },
      { id: 33, type: "technique", status: "hover", isSaved: false },
      { id: 34, type: "market", status: "hover", isSaved: false },
      { id: 35, type: "mitigation", status: "hover", isSaved: false }
    ],
    links: [{ source: 0, target: 1 }, { source: 0, target: 7 }]
  });

  useEffect(() => {
    setTimeout(() => {
      const scene = ref.current.scene();
      const camera = ref.current.camera();
      const renderer = ref.current.renderer();
      const directionLight = scene.children.find(
        child => child.type === "DirectionalLight"
      );
      scene.remove(directionLight);
      const ambientLight = scene.children.find(
        child => child.type === "AmbientLight"
      );
      ambientLight.color.setHex("#333333");
      var axesHelper = new THREE.AxesHelper(25);
      scene.add(axesHelper);
      createHoverEffect(scene, camera, renderer);
    }, 0);
  }, []);

  return (
    <div>
      <button
        onClick={() => {
          if (bg === undefined) {
            setBg("#f2f2f2");
          } else {
            setBg(undefined);
          }
        }}
      >
        toggle background
      </button>
      <ForceGraph3D
        ref={ref}
        enableNodeDrag={true}
        linkWidth={1}
        linkOpacity={1}
        backgroundColor={bg}
        graphData={data}
        linkMaterial={mat => {
          var material = new THREE.ShaderMaterial({
            uniforms: {
              color1: {
                value: new THREE.Color("#ffffff")
              },
              color2: {
                value: new THREE.Color("#ffffff")
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
                  
                  gl_FragColor = vec4(mix(color2, color1, vUv.x), 1.0);
                }
              `
          });
          //return material;
        }}
        nodeThreeObject={node => {
          let group = createNode(node.type, node.status, node.isSaved);
          setTimeout(() => {
            if (node.status === "hover") {
              outlinePassEffect.selectedObjects.push(group);
            }
          }, 0);
          return group;
        }}
      />
    </div>
  );
};

export default App;
