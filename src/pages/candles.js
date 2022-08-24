import * as THREE from 'three';
import { useState, useRef, Suspense, useMemo } from 'react';
import { Canvas, useThree, useFrame, useLoader } from '@react-three/fiber';
import { Reflector, CameraShake, OrbitControls, useTexture } from '@react-three/drei';
import { KernelSize } from 'postprocessing';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import './candlestick.css';


function Varcandle1({ color, ...props }) {
  const ref = useRef()
  const [r] = useState(() => Math.random() * 10000)
  useFrame((_) => (ref.current.position.y = -1.7 + Math.sin(_.clock.elapsedTime + r) / 10))
  const { paths: [path] } = useLoader(SVGLoader, '/cd1.svg') // prettier-ignore
  const geom = useMemo(() => SVGLoader.pointsToStroke(path.subPaths[0].getPoints(), path.userData.style), [])
  return (
    <group ref={ref}>
      <mesh geometry={geom} {...props}>
        <meshBasicMaterial color={color} toneMapped={false}/>
      </mesh>
    </group>
  )
}
function Varcandle2({ color, ...props }) {
  const ref = useRef()
  const [r] = useState(() => Math.random() * 10000)
  useFrame((_) => (ref.current.position.y = -1.7 + Math.sin(_.clock.elapsedTime + r) / 10))
  const { paths: [path] } = useLoader(SVGLoader, '/cd2.svg') // prettier-ignore
  const geom = useMemo(() => SVGLoader.pointsToStroke(path.subPaths[0].getPoints(), path.userData.style), [])
  return (
    <group ref={ref}>
      <mesh geometry={geom} {...props}>
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </group>
  )
}
function Varcandle3({ color, ...props }) {
  const ref = useRef()
  const [r] = useState(() => Math.random() * 10000)
  useFrame((_) => (ref.current.position.y = -1.7 + Math.sin(_.clock.elapsedTime + r) / 10))
  const { paths: [path] } = useLoader(SVGLoader, '/cd3.svg') // prettier-ignore
  const geom = useMemo(() => SVGLoader.pointsToStroke(path.subPaths[0].getPoints(), path.userData.style), [])
  return (
    <group ref={ref}>
      <mesh geometry={geom} {...props}>
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </group>
  )
}

function Rig({ children }) {
  const ref = useRef()
  const vec = new THREE.Vector3()
  const { camera, mouse } = useThree()
  useFrame(() => {
    camera.position.lerp(vec.set(mouse.x * 2, 0, 3.5), 0.05)
    ref.current.position.lerp(vec.set(mouse.x * 1, mouse.y * 0.1, 0), 0.1)
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, (-mouse.x * Math.PI) / 20, 0.1)
  })
  return <group ref={ref}>{children}</group>
}

function Ground(props) {
  const [floor, normal] = useTexture(['/SurfaceImperfections003_1K_var1.jpg.jpg', '/SurfaceImperfections003_1K_Normal.jpg.jpg'])
  return (
    <Reflector resolution={1024} args={[8, 8]} {...props}>
      {(Material, props) => <Material color="#f0f0f0" metalness={0} roughnessMap={floor} normalMap={normal} normalScale={[2, 2]} {...props} />}
    </Reflector>
  )
}

export default function Candlestick() {
  return (
    <div id="candle">
      
      <Canvas dpr={[1, 1.5]} camera={{ position: [1.5, -1.5, 15] }}>
        <color attach="background" args={['black']} />
        <ambientLight />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
        <Suspense fallback={null}>
          <Rig>
            <Varcandle1 color="cyan" scale={0.009} position={[-12, 1, -21]} rotation={[0, 0, 0]} />
            <Varcandle1 color="cyan" scale={0.009} position={[-12, 1, -21]} rotation={[0, 0, 0]} />
            <Varcandle2 color="#ff2060" scale={0.009} position={[-5.8, 2, -10]} rotation={[0, 0, 0]} />
            <Varcandle2 color="#ff2060" scale={0.009} position={[-5.8, 2, -10]} rotation={[0, 0, 0]} />
            <Varcandle1 color="cyan" scale={0.009} position={[-5.8, 1.5, -12]} rotation={[0, 0, 0]} />
            <Varcandle1 color="cyan" scale={0.009} position={[-5.8, 1.5, -12]} rotation={[0, 0, 0]} />
            <Varcandle1 color="#ff2060" scale={0.009} position={[-2, 2, -6]} rotation={[0, 0, 0]} />
            <Varcandle1 color="#ff2060" scale={0.009} position={[-2, 2, -6]} rotation={[0, 0, 0]} />
            <Varcandle3 color="#ff2060" scale={0.009} position={[-6.1, 8, -17]} rotation={[0, 0, 0]} />
            <Varcandle3 color="#ff2060" scale={0.009} position={[-6.1, 8, -17]} rotation={[0, 0, 0]} />
            <Varcandle2 color="cyan" scale={0.009} position={[-1, 2, -9]} rotation={[0, 0, 0]} />
            <Varcandle2 color="cyan" scale={0.009} position={[-1, 2, -9]} rotation={[0, 0, 0]} />
            <Varcandle1 color="cyan" scale={0.009} position={[4, 2, -13]} rotation={[0, 0, 0]} />
            <Varcandle1 color="cyan" scale={0.009} position={[4, 2, -13]} rotation={[0, 0, 0]} />
            <Varcandle1 color="#ff2060" scale={0.009} position={[3.7, 2.12, -7.5]} rotation={[0, 0, 0]} />
            <Varcandle1 color="#ff2060" scale={0.009} position={[3.7, 2.12, -7.5]} rotation={[0, 0, 0]} />
            <Varcandle1 color="cyan" scale={0.009} position={[1.6, 2, -20]} rotation={[0, 0, 0]} />
            <Varcandle1 color="cyan" scale={0.009} position={[1.6, 2, -20]} rotation={[0, 0, 0]} />
            <Varcandle1 color="#ff2060" scale={0.009} position={[2.5, 4, -15]} rotation={[0, 0, 0]} />
            <Varcandle1 color="#ff2060" scale={0.009} position={[2.5, 4, -15]} rotation={[0, 0, 0]} />
            <Varcandle3 color="cyan" scale={0.009} position={[0, 11, -21]} rotation={[0, 0, 0]} />
            <Varcandle3 color="cyan" scale={0.009} position={[0, 11, -21]} rotation={[0, 0, 0]} />
            <Varcandle2 color="#ff2060" scale={0.009} position={[4.95, 2, -8]} rotation={[0, 0, 0]} />
            <Varcandle2 color="#ff2060" scale={0.009} position={[4.95, 2, -8]} rotation={[0, 0, 0]} />
            <Varcandle1 color="#ff2060" scale={0.009} position={[-5.9, 1, -6]} rotation={[0, 0, 0]} />
            <Varcandle1 color="#ff2060" scale={0.009} position={[-5.9, 1, -6]} rotation={[0, 0, 0]} />
            <Varcandle2 color="cyan" scale={0.009} position={[-7.5, 1.25, -7]} rotation={[0, 0, 0]} />
            <Varcandle2 color="cyan" scale={0.009} position={[-7.5, 1.25, -7]} rotation={[0, 0, 0]} />
            <Varcandle1 color="#ff2060" scale={0.009} position={[4.8, 2, -6]} rotation={[0, 0, 0]} />
            <Varcandle1 color="#ff2060" scale={0.009} position={[4.8, 2, -6]} rotation={[0, 0, 0]} />
            <Varcandle2 color="cyan" scale={0.009} position={[6, 1, -6]} rotation={[0, 0, 0]} />
            <Varcandle2 color="cyan" scale={0.009} position={[6, 1, -6]} rotation={[0, 0, 0]} />
            <Varcandle1 color="#ff2060" scale={0.009} position={[-8.2, 2, -6]} rotation={[0, 0, 0]} />
            <Varcandle1 color="#ff2060" scale={0.009} position={[-8.2, 2, -6]} rotation={[0, 0, 0]} />
            <Varcandle1 color="cyan" scale={0.009} position={[-9, 3.2, -6]} rotation={[0, 0, 0]} />
            <Varcandle1 color="cyan" scale={0.009} position={[-9, 3.2, -6]} rotation={[0, 0, 0]} />
            <Ground mirror={1} blur={[500, 100]} mixBlur={12} mixStrength={1.5} rotation={[-Math.PI / 2, 0, Math.PI / 2]} position-y={-0.8} />
          </Rig>
          <EffectComposer multisampling={8}>
            <Bloom kernelSize={3} luminanceThreshold={0} luminanceSmoothing={0.4} intensity={0.6} />
            <Bloom kernelSize={KernelSize.HUGE} luminanceThreshold={0} luminanceSmoothing={0} intensity={0.5} />
          </EffectComposer>
        </Suspense>
        <CameraShake yawFrequency={0.2} pitchFrequency={0.2} rollFrequency={0.2} />
      </Canvas>
      <div ><button class="sign-in" ><span>Sign Up </span></button></div>
    </div>
  )
}