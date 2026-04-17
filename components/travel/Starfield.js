import React, { useMemo } from 'react';
import * as THREE from 'three';

export default function StarField({ count = 2000, radius = 100, depth = 50 }) {
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = ['#ffffff','#ffd4e6','#d4eaff','#e9d4ff','#ffd4d4'];
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = radius + Math.random() * depth;
      pos[i3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i3+1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i3+2] = r * Math.cos(phi);
      const c = new THREE.Color(palette[Math.floor(Math.random()*palette.length)]);
      col[i3] = c.r; col[i3+1] = c.g; col[i3+2] = c.b;
    }
    return {positions:pos,colors:col};
  }, [count,radius,depth]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} itemSize={3} count={positions.length/3} />
        <bufferAttribute attach="attributes-color" array={colors} itemSize={3} count={colors.length/3} />
      </bufferGeometry>
      <pointsMaterial vertexColors size={0.5} sizeAttenuation />
    </points>
  );
}