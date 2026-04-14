import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'

function HexPrism() {
  const meshRef = useRef()

  const geometry = useMemo(() => {
    return new THREE.CylinderGeometry(1.2, 1.2, 1.8, 6, 1, false)
  }, [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    meshRef.current.rotation.x = t * 0.5
    meshRef.current.rotation.y = t * 0.7
    meshRef.current.rotation.z = t * 0.3
  })

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshPhongMaterial
        color="#a78bfa"
        emissive="#5b21b6"
        emissiveIntensity={0.5}
        wireframe
        transparent
        opacity={0.8}
      />
    </mesh>
  )
}

function GlowRing() {
  const ringRef = useRef()

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.3
    }
  })

  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[2, 0.02, 8, 64]} />
      <meshBasicMaterial color="#5DCAA5" transparent opacity={0.4} />
    </mesh>
  )
}

const phases = [
  'Detecting sections...',
  'Scoring clarity...',
  'Analyzing structure...',
  'Generating feedback...',
]

export default function LoadingOverlay({ visible }) {
  const [currentPhase, setCurrentPhase] = useState(0)

  useEffect(() => {
    if (!visible) {
      setCurrentPhase(0)
      return
    }
    const interval = setInterval(() => {
      setCurrentPhase(prev => (prev + 1) % phases.length)
    }, 900)
    return () => clearInterval(interval)
  }, [visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(10, 10, 15, 0.95)' }}
        >
          <div className="flex flex-col items-center">
            {/* 3D Hex Prism */}
            <div className="w-48 h-48 mb-8">
              <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.3} />
                <pointLight position={[10, 10, 10]} intensity={0.8} color="#a78bfa" />
                <pointLight position={[-10, -10, -10]} intensity={0.4} color="#5DCAA5" />
                <HexPrism />
                <GlowRing />
              </Canvas>
            </div>

            {/* Phase text */}
            <motion.p
              key={currentPhase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-lg text-text-primary font-medium mb-6"
            >
              {phases[currentPhase]}
            </motion.p>

            {/* Progress dots */}
            <div className="flex gap-3">
              {phases.map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: i <= currentPhase ? 1 : 0.6,
                    backgroundColor: i <= currentPhase ? '#a78bfa' : '#2a2a3a',
                  }}
                  transition={{ delay: i * 0.1 }}
                  className="w-2.5 h-2.5 rounded-full"
                />
              ))}
            </div>

            {/* Text ring simulation */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              className="absolute w-72 h-72 rounded-full border border-brand/10"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
