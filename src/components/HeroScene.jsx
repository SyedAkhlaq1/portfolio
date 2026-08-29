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
  const { pointer, viewport } = useThree()

  // scale down on narrow viewports so it stays a motif, not a wall
  const s = viewport.width < 6 ? 0.62 : viewport.width < 9 ? 0.82 : 1

  useFrame((state, delta) => {
    if (!group.current) return
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      pointer.x * 0.3,
      1.8 * delta,
    )
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      -pointer.y * 0.2,
      1.8 * delta,
    )
    group.current.rotation.z += delta * 0.04
  })

  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.7}>
      {/* pushed to the upper-right and back so it sits behind the text */}
      <group ref={group} position={[2.1, 0.35, -1.4]} scale={s}>
        <mesh scale={1.35}>
          <icosahedronGeometry args={[1, 18]} />
          <MeshDistortMaterial
            color={dark ? '#241a38' : '#eee6ef'}
            envMapIntensity={dark ? 1.1 : 1.3}
            metalness={0.94}
            roughness={0.14}
            clearcoat={1}
            clearcoatRoughness={0.28}
            iridescence={1}
            iridescenceIOR={1.45}
            iridescenceThicknessRange={[120, 560]}
            distort={0.46}
            speed={1.9}
          />
        </mesh>
      </group>
    </Float>
  )
}

function Rig() {
  // very subtle camera drift toward the pointer
  useFrame((state, delta) => {
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      state.pointer.x * 0.18,
      1.3 * delta,
    )
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      state.pointer.y * 0.12,
      1.3 * delta,
    )
    state.camera.lookAt(1.2, 0, 0)
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
          <group>
            <Lightformer
              form="circle"
              intensity={dark ? 2 : 2.6}
              color="#e7c4d5"
              position={[-4, 2, 1]}
              scale={5}
            />
            <Lightformer
              form="circle"
              intensity={dark ? 1.8 : 2.4}
              color="#c6c4ea"
              position={[4, -1, 2]}
              scale={6}
            />
            <Lightformer
              form="ring"
              intensity={dark ? 1.4 : 1.8}
              color="#f0d6bd"
              position={[1, 3, -3]}
              scale={7}
            />
            <Lightformer
              form="circle"
              intensity={dark ? 0.4 : 0.7}
              color="#ffffff"
              position={[0, -2, 4]}
              scale={4}
            />
          </group>
        </Environment>

        <EffectComposer disableNormalPass multisampling={0}>
          <Bloom
            mipmapBlur
            luminanceThreshold={dark ? 0.6 : 0.82}
            luminanceSmoothing={0.35}
            intensity={dark ? 0.55 : 0.3}
          />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
