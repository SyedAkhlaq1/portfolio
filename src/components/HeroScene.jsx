import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { MeshDistortMaterial, Environment, Lightformer, Float } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

/**
 * The floating iridescent orb behind the hero headline. Glassy
 * transmission material with chromatic + iridescence edges, lit by a
 * few soft coloured light-cards (no external HDRI). Positioned as an
 * upper-right motif, masked by CSS so it never blocks the text.
 *
 * Mounted lazily by Hero.jsx, only when WebGL + motion are available.
 */

function Orb({ dark }) {
  const group = useRef(null)
  const { pointer, viewport } = useThree()

  // keep it a motif on small screens
  const s = viewport.width < 5 ? 0.5 : viewport.width < 8 ? 0.78 : 1.15

  useFrame((state, delta) => {
    if (!group.current) return
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      pointer.x * 0.25 + state.clock.elapsedTime * 0.04,
      1.6 * delta,
    )
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      -pointer.y * 0.16,
      1.6 * delta,
    )
  })

  return (
    <Float speed={1.3} rotationIntensity={0.25} floatIntensity={0.6}>
      <group ref={group} position={[2.3, 0.5, -0.6]} scale={s}>
        <mesh>
          <icosahedronGeometry args={[1, 20]} />
          <MeshDistortMaterial
            color={dark ? '#b9b2e0' : '#efe9f4'}
            envMapIntensity={dark ? 1.4 : 1.8}
            metalness={0.2}
            roughness={0.14}
            clearcoat={1}
            clearcoatRoughness={0.18}
            iridescence={1}
            iridescenceIOR={1.32}
            iridescenceThicknessRange={[80, 780]}
            distort={0.4}
            speed={1.8}
          />
        </mesh>
      </group>
    </Float>
  )
}

function Rig() {
  useFrame((state, delta) => {
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      state.pointer.x * 0.14,
      1.2 * delta,
    )
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      state.pointer.y * 0.09,
      1.2 * delta,
    )
    state.camera.lookAt(1.4, 0.2, 0)
  })
  return null
}

export default function HeroScene() {
  const [dark, setDark] = useState(
    typeof document !== 'undefined' &&
      document.documentElement.getAttribute('data-theme') === 'dark',
  )

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
        <ambientLight intensity={dark ? 0.55 : 0.9} />
        <directionalLight position={[3, 4, 5]} intensity={dark ? 0.5 : 0.9} color="#ffffff" />

        <Orb dark={dark} />

        {/* big, soft coloured cards → even pastel reflections, no HDRI */}
        <Environment resolution={128} frames={1}>
          <group>
            <Lightformer form="rect" intensity={dark ? 1.1 : 1.6} color="#e7c4d5" position={[-5, 3, 2]} scale={[8, 6, 1]} />
            <Lightformer form="rect" intensity={dark ? 1 : 1.5} color="#c6c4ea" position={[5, -2, 3]} scale={[8, 6, 1]} />
            <Lightformer form="rect" intensity={dark ? 0.8 : 1.2} color="#f0d6bd" position={[0, 5, -4]} scale={[10, 5, 1]} />
            <Lightformer form="rect" intensity={dark ? 0.5 : 0.9} color="#ffffff" position={[0, 0, 6]} scale={[10, 10, 1]} />
          </group>
        </Environment>

        <EffectComposer disableNormalPass multisampling={0}>
          <Bloom
            mipmapBlur
            luminanceThreshold={dark ? 0.75 : 0.92}
            luminanceSmoothing={0.4}
            intensity={dark ? 0.5 : 0.22}
          />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
