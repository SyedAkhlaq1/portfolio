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

function Orb({ dark, mobile }) {
  const group = useRef(null)
  const { pointer, viewport } = useThree()

  const s = mobile ? 0.62 : viewport.width < 8 ? 0.82 : 1.0
  const pos = mobile ? [1.7, 2.9, -1.6] : [2.75, 0.05, -0.6]

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
      <group ref={group} position={pos} scale={s}>
        <mesh>
          <icosahedronGeometry args={[1, 20]} />
          <MeshDistortMaterial
            color={dark ? '#5f5299' : '#8b7ec9'}
            envMapIntensity={dark ? 1.8 : 2.4}
            metalness={0.55}
            roughness={0.12}
            clearcoat={1}
            clearcoatRoughness={0.16}
            iridescence={1}
            iridescenceIOR={1.35}
            iridescenceThicknessRange={[120, 1000]}
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
    state.camera.lookAt(1.7, 0.1, 0)
  })
  return null
}

export default function HeroScene() {
  const mobile = typeof window !== 'undefined' && window.innerWidth < 768
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
        dpr={[1, mobile ? 1.3 : 1.75]}
        gl={{ antialias: !mobile, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 5], fov: 42 }}
        frameloop="always"
      >
        {!mobile && <Rig />}
        <ambientLight intensity={dark ? 0.55 : 0.9} />
        <directionalLight position={[3, 4, 5]} intensity={dark ? 0.5 : 0.9} color="#ffffff" />

        <Orb dark={dark} mobile={mobile} />

        {/* coloured cards → iridescent pastel reflections + one dark card
            so the orb keeps its form and doesn't wash out (no HDRI) */}
        <Environment resolution={128} frames={1}>
          <group>
            <Lightformer form="rect" intensity={2.4} color="#e7a9c8" position={[-5, 3, 2]} scale={[7, 6, 1]} />
            <Lightformer form="rect" intensity={2.2} color="#9d9bec" position={[5, -2, 3]} scale={[7, 6, 1]} />
            <Lightformer form="rect" intensity={1.8} color="#f0cfa8" position={[0, 5, -4]} scale={[9, 5, 1]} />
            <Lightformer form="rect" intensity={1.4} color="#ffffff" position={[0, 1, 6]} scale={[8, 8, 1]} />
            {/* dark card = a shadowed side, gives the sphere volume */}
            <Lightformer form="rect" intensity={0.06} color="#120c1e" position={[-4, -4, -3]} scale={[9, 9, 1]} />
          </group>
        </Environment>

        {!mobile && (
          <EffectComposer disableNormalPass multisampling={0}>
            <Bloom
              mipmapBlur
              luminanceThreshold={dark ? 0.75 : 0.92}
              luminanceSmoothing={0.4}
              intensity={dark ? 0.5 : 0.22}
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  )
}
