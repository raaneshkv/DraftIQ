import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Particles({ count = 60 }) {
  const meshRef = useRef()
  const linesRef = useRef()

  const particles = useMemo(() => {
    const positions = []
    const velocities = []
    const colors = []
    for (let i = 0; i < count; i++) {
      positions.push(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 10
      )
      velocities.push(
        (Math.random() - 0.5) * 0.005,
        (Math.random() - 0.5) * 0.005,
        (Math.random() - 0.5) * 0.003
      )
      // Mix between Cyan and Deep Purple
      const t = Math.random()
      colors.push(
        0.0 * (1 - t) + 0.51 * t, // R
        0.82 * (1 - t) + 0.22 * t, // G
        1.0 * (1 - t) + 0.92 * t  // B
      )
    }
    return {
      positions: new Float32Array(positions),
      velocities,
      colors: new Float32Array(colors),
    }
  }, [count])

  const lineGeometry = useMemo(() => new THREE.BufferGeometry(), [])

  useFrame((state) => {
    if (!meshRef.current) return
    const positions = meshRef.current.geometry.attributes.position.array
    const time = state.clock.elapsedTime

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      positions[i3] += particles.velocities[i3] + Math.sin(time * 0.3 + i) * 0.002
      positions[i3 + 1] += particles.velocities[i3 + 1] + Math.cos(time * 0.2 + i) * 0.002
      positions[i3 + 2] += particles.velocities[i3 + 2]

      // Wrap around
      if (Math.abs(positions[i3]) > 12) particles.velocities[i3] *= -1
      if (Math.abs(positions[i3 + 1]) > 8) particles.velocities[i3 + 1] *= -1
      if (Math.abs(positions[i3 + 2]) > 6) particles.velocities[i3 + 2] *= -1
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true

    // Build connection lines
    const linePositions = []
    const lineColors = []
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const i3 = i * 3, j3 = j * 3
        const dx = positions[i3] - positions[j3]
        const dy = positions[i3 + 1] - positions[j3 + 1]
        const dz = positions[i3 + 2] - positions[j3 + 2]
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
        if (dist < 3.5) {
          const alpha = 1 - dist / 3.5
          linePositions.push(
            positions[i3], positions[i3 + 1], positions[i3 + 2],
            positions[j3], positions[j3 + 1], positions[j3 + 2]
          )
          lineColors.push(
            0.36, 0.79, 0.65, alpha * 0.6,
            0.36, 0.79, 0.65, alpha * 0.6
          )
        }
      }
    }

    if (linesRef.current && linePositions.length > 0) {
      lineGeometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(linePositions, 3)
      )
      lineGeometry.setAttribute(
        'color',
        new THREE.Float32BufferAttribute(lineColors, 4)
      )
      lineGeometry.attributes.position.needsUpdate = true
      lineGeometry.attributes.color.needsUpdate = true
    }
  })

  return (
    <>
      <points ref={meshRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={count}
            array={particles.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Glow particles (larger, dimmer) */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={count}
            array={particles.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.3}
          vertexColors
          transparent
          opacity={0.15}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </>
  )
}

export default function NeuralNetwork3D() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.2} />
        <Particles count={60} />
      </Canvas>
    </div>
  )
}
