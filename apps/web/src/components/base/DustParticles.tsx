/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
interface DustParticlesProps {
    className?: string;
    particleCount?: number;
    particleColor?: number;
    particleSize?: number;
    spread?: number;
}
export default function DustParticles({
    className = '',
    particleCount = 300,
    particleColor = 0xffff00,
    particleSize = 0.01,
    spread = 5,
}: DustParticlesProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const animationFrameRef = useRef<number>(0);
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000,
        );
        camera.position.z = 5;
        const scene = new THREE.Scene();
        const particles = new THREE.Object3D();
        // Random position helper
        function mathRandom(num = 1) {
            return -Math.random() * num + Math.random() * num;
        }
        // Create dust particles
        const particleMaterial = new THREE.MeshToonMaterial({
            color: particleColor,
            side: THREE.DoubleSide,
        });
        const particleGeometry = new THREE.CircleGeometry(particleSize, 3);
        for (let i = 0; i < particleCount; i++) {
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            particle.position.set(mathRandom(spread), mathRandom(spread), mathRandom(spread));
            particle.rotation.set(mathRandom(Math.PI), mathRandom(Math.PI), mathRandom(Math.PI));
            particles.add(particle);
        }
        scene.add(particles);
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        scene.add(ambientLight);
        // Window resize handler
        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
        // Animation loop
        const animate = function () {
            animationFrameRef.current = requestAnimationFrame(animate);
            particles.rotation.y += 0.001;
            particles.rotation.x += 0.001;
            renderer.render(scene, camera);
        };
        animate();
        window.addEventListener('resize', onWindowResize);
        // Cleanup
        return () => {
            window.removeEventListener('resize', onWindowResize);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (rendererRef.current && container) {
                container.removeChild(rendererRef.current.domElement);
                rendererRef.current.dispose();
            }
            scene.traverse((object) => {
                if (object instanceof THREE.Mesh) {
                    object.geometry.dispose();
                    if (Array.isArray(object.material)) {
                        object.material.forEach((material) => material.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            });
        };
    }, [particleCount, particleColor, particleSize, spread]);
    return (
        <div
            ref={containerRef}
            className={`fixed inset-0 pointer-events-none ${className}`}
            style={{ zIndex: 9 }}
        />
    );
}
