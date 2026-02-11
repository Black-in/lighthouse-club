/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface City3DProps {
    className?: string;
}

export default function City3D({ className = '' }: City3DProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const animationFrameRef = useRef<number>(0);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const isXL = () => window.innerWidth >= 1280;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);

        if (window.innerWidth > 800) {
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        }

        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        const camera = new THREE.PerspectiveCamera(
            20,
            window.innerWidth / window.innerHeight,
            1,
            500,
        );
        camera.position.set(0, 2, 14);

        const scene = new THREE.Scene();
        const city = new THREE.Object3D();
        const smoke = new THREE.Object3D();
        const town = new THREE.Object3D();

        const uSpeed = 0.001;
        let createCarPos = true;

        // Background
        const bg = 0x6c44fc;
        scene.background = new THREE.Color(bg);
        scene.fog = new THREE.Fog(bg, 10, 16);

        // Utils
        const mathRandom = (n = 8) => -Math.random() * n + Math.random() * n;

        // Buildings
        function init() {
            const segments = 2;

            for (let i = 0; i < 100; i++) {
                const geo = new THREE.BoxGeometry(1, 1, 1, segments, segments, segments);
                const mat = new THREE.MeshStandardMaterial({ color: 0x000000 });
                const wire = new THREE.MeshLambertMaterial({
                    color: 0xffffff,
                    wireframe: true,
                    transparent: true,
                    opacity: 0.03,
                });

                const cube = new THREE.Mesh(geo, mat);
                const wireMesh = new THREE.Mesh(geo, wire);
                const floor = new THREE.Mesh(geo, mat);

                cube.add(wireMesh);
                cube.castShadow = cube.receiveShadow = true;

                cube.scale.y = 0.1 + Math.abs(mathRandom(8));
                cube.scale.x = cube.scale.z = 0.9 + mathRandom(0.1);

                cube.position.set(Math.round(mathRandom()), 0, Math.round(mathRandom()));

                floor.scale.y = 0.05;
                floor.position.set(cube.position.x, 0, cube.position.z);

                town.add(floor);
                town.add(cube);
            }

            // Particles
            const pGeo = new THREE.CircleGeometry(0.01, 3);
            const pMat = new THREE.MeshToonMaterial({ color: 0xffff00 });

            for (let i = 0; i < 300; i++) {
                const p = new THREE.Mesh(pGeo, pMat);
                p.position.set(mathRandom(5), mathRandom(5), mathRandom(5));
                smoke.add(p);
            }

            // Ground
            const ground = new THREE.Mesh(
                new THREE.PlaneGeometry(60, 60),
                new THREE.MeshPhongMaterial({
                    color: 0x000000,
                    transparent: true,
                    opacity: 0.9,
                }),
            );
            ground.rotation.x = -Math.PI / 2;
            ground.position.y = -0.001;
            ground.receiveShadow = true;

            city.add(ground);
        }

        // Lights
        const ambient = new THREE.AmbientLight(0xffffff, 4);
        const front = new THREE.SpotLight(0xffffff, 20);
        const back = new THREE.PointLight(0xffffff, 0.5);

        front.position.set(5, 5, 5);
        front.castShadow = true;
        back.position.set(0, 6, 0);

        smoke.position.y = 2;

        scene.add(ambient, back);
        city.add(front, smoke, town);
        scene.add(city);

        city.add(new THREE.GridHelper(60, 120, 0xff0000, 0x000000));

        // Cars
        const createCars = (scale = 0.1, pos = 20) => {
            const car = new THREE.Mesh(
                new THREE.BoxGeometry(1, scale / 40, scale / 40),
                new THREE.MeshToonMaterial({ color: 0xffff00 }),
            );

            if (createCarPos) {
                createCarPos = false;
                car.position.set(-pos, Math.abs(mathRandom(5)), mathRandom(3));
            } else {
                createCarPos = true;
                car.position.set(mathRandom(3), Math.abs(mathRandom(5)), -pos);
                car.rotation.y = Math.PI / 2;
            }

            city.add(car);
        };

        for (let i = 0; i < 60; i++) createCars();

        // Mouse (hover only)
        const mouse = { x: 0, y: 0 };

        function onMouseMove(e: MouseEvent) {
            if (!isXL()) return;

            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        }

        // Resize
        function onResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        // Animate
        function animate() {
            animationFrameRef.current = requestAnimationFrame(animate);

            if (isXL()) {
                city.rotation.y -= (mouse.x * 8 - camera.rotation.y) * uSpeed;
                city.rotation.x -= (-(mouse.y * 2) - camera.rotation.x) * uSpeed;
            } else {
                city.rotation.y += 0.001;
            }

            city.rotation.x = Math.max(-0.05, Math.min(1, city.rotation.x));

            smoke.rotation.y += 0.01;
            smoke.rotation.x += 0.01;

            camera.lookAt(city.position);
            renderer.render(scene, camera);
        }

        init();
        animate();

        window.addEventListener('resize', onResize);
        window.addEventListener('mousemove', onMouseMove);

        return () => {
            window.removeEventListener('resize', onResize);
            window.removeEventListener('mousemove', onMouseMove);

            cancelAnimationFrame(animationFrameRef.current);

            if (rendererRef.current && container) {
                container.removeChild(rendererRef.current.domElement);
                rendererRef.current.dispose();
            }

            scene.traverse((obj) => {
                if (obj instanceof THREE.Mesh) {
                    obj.geometry.dispose();
                    if (Array.isArray(obj.material)) {
                        obj.material.forEach((m) => m.dispose());
                    } else {
                        obj.material.dispose();
                    }
                }
            });
        };
    }, []);

    return <div ref={containerRef} className={`fixed inset-0 ${className}`} />;
}
