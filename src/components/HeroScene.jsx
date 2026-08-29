import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { MeshDistortMaterial, Environment, Lightformer, Float } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

/**
 * The floating iridescent form behind the hero headline. Chrome-ish blob
 * lit only by coloured light-cards (no external HDRI), gently distorting,
 * parallaxing toward the pointer. Bloom for the glow.
 *
 * Mounted lazily by Hero.jsx and only when WebGL + motion are available.
 */

function Blob({ dark }) {
  const group = useRef(null)
  const mat = useRef(null)
  const { pointer } = useThree()

  useFrame((state, delta) => {
    if (!group.current) return
    // ease toward the pointer for a parallax tilt
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      pointer.x * 0.4,
      2.2 * delta,
    )
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      -pointer.y * 0.3,
      2.2 * delta,
    )
    group.current.rotation.z += delta * 0.05
  })

  return (
    <Float speed={1.1} rotationIntensity={0.35} floatIntensity={0.9}>
      <group ref={group}>
        <mesh scale={1.55}>
          <icosahedronGeometry args={[1, 14]} />
          <MeshDistortMaterial
            ref={mat}
            color={dark ? '#2a2140' : '#efe7ef'}
            envMapIntensity={dark ? 1.15 : 1.35}
            metalness={0.92}
            roughness={0.16}
            clearcoat={1}
            clearcoatRoughness={0.25}
            iridescence={1}
            iridescenceIOR={1.5}
            iridescenceThicknessRange={[100, 520]}
            distort={0.34}
            speed={1.4}
          />
        </mesh>
      </group>
    </Float>
  )
}

function Rig() {
  // subtle camera drift toward the pointer
  useFrame((state, delta) => {
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      state.pointer.x * 0.35,
      1.5 * delta,
    )
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      state.pointer.y * 0.25,
      1.5 * delta,
    )
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

export default function HeroScene() {
  const [dark, setDark] = useState(
    typeof document !== 'undefined' &&
      document.documentElement.getAttribute('data-theme') === 'dark',
  )

  // follow the site theme
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setDark(document.documentElement.getAttribute('data-theme') === 'dark'),
    )
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => obs.disconnect()
  }, [])

  return (
    <div className="hero-scene" aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 5], fov: 42 }}
        frameloop="always"
      >
        <Rig />
        <ambientLight intensity={dark ? 0.35 : 0.6} />

        <Blob dark={dark} />

        {/* coloured light-cards = iridescent pastel reflections, no HDRI */}
        <Environment resolution={256} frames={1}>
          <group rotation={[0, 0, 0]}>
            <Lightformer
              form="circle"
              intensity={dark ? 2.4 : 3.2}
              color="#e7c4d5"
              position={[-3, 2, 2]}
              scale={4}
            />
            <Lightformer
              form="circle"
              intensity={dark ? 2.2 : 3}
              color="#c6c4ea"
              position={[3, -1, 3]}
              scale={5}
            />
            <Lightformer
              form="ring"
              intensity={dark ? 1.6 : 2.2}
              color="#f0d6bd"
              position={[0, 3, -4]}
              scale={6}
            />
            <Lightformer
              form="rect"
              intensity={dark ? 0.5 : 1}
              color="#ffffff"
              position={[0, 0, 5]}
              scale={8}
            />
          </group>
        </Environment>

        <EffectComposer disableNormalPass multisampling={0}>
          <Bloom
            mipmapBlur
            luminanceThreshold={dark ? 0.35 : 0.55}
            luminanceSmoothing={0.3}
            intensity={dark ? 0.9 : 0.6}
          />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
