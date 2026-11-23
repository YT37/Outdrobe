import { GroupProps, MeshProps } from "@react-three/fiber";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: GroupProps;
      mesh: MeshProps;
      sphereGeometry: any;
      cylinderGeometry: any;
      circleGeometry: any;
      boxGeometry: any;
      meshStandardMaterial: any;
      ambientLight: any;
      directionalLight: any;
      pointLight: any;
    }
  }
}
