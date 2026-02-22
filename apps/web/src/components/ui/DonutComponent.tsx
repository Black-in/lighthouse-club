/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
export default function ExplodingTorus() {
    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#0a0c0d');
        const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight);
        camera.position.set(0, 0, 10);
        camera.lookAt(scene.position);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.enableZoom = false;
        const light = new THREE.DirectionalLight('white', 1.5);
        scene.add(light);
        const geo = new THREE.TorusGeometry(1.5, 0.4, 6, 16).toNonIndexed();
        const object = new THREE.Mesh(
            geo,
            new THREE.MeshPhongMaterial({
                color: '#5483B3',
                shininess: 510,
                flatShading: true,
                side: THREE.DoubleSide,
                vertexColors: true,
                transparent: true,
            }),
        );
        scene.add(object);
        const pos = geo.getAttribute('position');
        const ori = pos.clone();
        const colors: number[] = [];
        for (let i = 0; i < pos.count; i++) {
            colors.push(1, 1, 1, 1);
        }
        geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 4));
        const nor = geo.getAttribute('normal');
        const col = geo.getAttribute('color');
        const n = new THREE.Vector3();
        const v = new THREE.Vector3();
        function explodePlate(idx: number, distance: number) {
            n.fromBufferAttribute(nor, 6 * idx);
            for (let i = 0; i < 6; i++) {
                v.fromBufferAttribute(ori, 6 * idx + i);
                v.addScaledVector(n, distance);
                pos.setXYZ(6 * idx + i, v.x, v.y, v.z);
                col.setW(6 * idx + i, 1 - 4 * distance);
            }
        }
        function animationLoop(t: number) {
            object.rotation.set(t / 3000, t / 2000, 0);
            for (let i = 0; i < pos.count / 6; i++) {
                explodePlate(i, (Math.sin(t / 200 + i * i) / 2 + 1 / 2) / 5);
            }
            pos.needsUpdate = true;
            col.needsUpdate = true;
            controls.update();
            light.position.copy(camera.position);
            renderer.render(scene, camera);
        }
        renderer.setAnimationLoop(animationLoop);
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            renderer.setAnimationLoop(null);
            renderer.dispose();
            geo.dispose();
            object.material.dispose();
            controls.dispose();
            if (container && renderer.domElement) {
                container.removeChild(renderer.domElement);
            }
        };
    }, []);
    return (
        <div
            ref={containerRef}
            style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }}
        />
    );
}
