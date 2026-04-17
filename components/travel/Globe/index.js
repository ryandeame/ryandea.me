'use client';

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Html, useTexture } from '@react-three/drei';
import * as solar from 'solar-calculator';
import { dayNightShader } from './Shaders/DayNightShader';

// ---------- Clustering helpers ---------------------------------------------
const CLUSTER_THRESHOLD = 8;

function latLonToCartesian(lat, lon, radius) {
  const phi   = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return [
    -radius * Math.sin(phi) * Math.cos(theta),
     radius * Math.cos(phi),
     radius * Math.sin(phi) * Math.sin(theta)
  ];
}

function groupCities(data) {
  const used = Array(data.length).fill(false);
  const groups = [];
  for (let i = 0; i < data.length; i++) {
    if (used[i]) continue;
    const base = data[i];
    const group = [base]; used[i] = true;
    for (let j = i + 1; j < data.length; j++) {
      if (used[j]) continue;
      const other = data[j];
      if (
        Math.abs(base.lat - other.lat) < CLUSTER_THRESHOLD &&
        Math.abs(base.lon - other.lon) < CLUSTER_THRESHOLD
      ) {
        group.push(other);
        used[j] = true;
      }
    }
    // Apply conditional sorting to the current group
    group.sort((a, b) => {
      const aIsNegativeLon = a.lon < 0;
      const bIsNegativeLon = b.lon < 0;

      return a.lon - b.lon;
    });
    groups.push(group);
  }
  return groups;
}

const sunPosAt = dt => {
  const day = new Date(+dt).setUTCHours(0, 0, 0, 0);
  const t = solar.century(dt);
  const longitude = (day - dt) / 864e5 * 360 - 180;
  // Set declination to 0 to ignore Earth's tilt
  return [longitude - solar.equationOfTime(t) / 4, 0];
};

// ---------- Globe mesh with clustering ------------------------------------
export default function Globe({ cityData, onCitySelect, onClusterToggle, selectedCluster, overlayOpen, navOpen }) {
  const dayTexture = useTexture('https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-day.jpg');
  const nightTexture = useTexture('https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg');
  const sphereRef = useRef();
  const clusters = useMemo(() => groupCities(cityData), [cityData]);
  const dt = useRef(+new Date());
  const { camera } = useThree();

  const globeMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      dayTexture: { value: dayTexture },
      nightTexture: { value: nightTexture },
      sunPosition: { value: new THREE.Vector2() },
      globeRotation: { value: new THREE.Vector2() }
    },
    vertexShader: dayNightShader.vertexShader,
    fragmentShader: dayNightShader.fragmentShader
  }), [dayTexture, nightTexture]);

  useFrame(({ clock }) => {
    const VELOCITY = 1; // minutes per frame
    dt.current += VELOCITY * 60 * 1000;
    
    globeMaterial.uniforms.sunPosition.value.set(...sunPosAt(dt.current));
    sphereRef.current.rotation.y = clock.getElapsedTime() * 0.015;

    const toGeoCoords = (position) => {
        const { x, y, z } = position;
        const r = Math.sqrt(x*x + y*y + z*z);
        return {
            lat: 90 - (Math.acos(y / r)) * 180 / Math.PI,
            lng: ((Math.atan2(x, z)) * 180 / Math.PI) - 90,
        };
    };

    const { lng, lat } = toGeoCoords(camera.position);
    globeMaterial.uniforms.globeRotation.value.set(lng, lat);
  });

  return (
    <group ref={sphereRef}>
      <mesh>
        <sphereGeometry args={[1.5, 64, 64]} />
        <primitive object={globeMaterial} attach="material" />
      </mesh>
      {clusters.map((group, idx) => {
        // hide labels whenever overlay or navbar is open
        if (overlayOpen || navOpen) return null;
        // if a cluster is open, hide all other clusters/singletons
        if (selectedCluster !== null && idx !== selectedCluster) return null;

        const avgLat = group.reduce((sum, c) => sum + c.lat, 0) / group.length;
        const avgLon = group.reduce((sum, c) => sum + c.lon, 0) / group.length;
        const [cx, cy, cz] = latLonToCartesian(avgLat, avgLon, 1.52);

        if (group.length === 1) {
          const city = group[0];
          const [x, y, z] = latLonToCartesian(city.lat, city.lon, 1.51);
          return (
            <Html key={city.name} occlude={[sphereRef]} position={[x, y, z]} center style={{ pointerEvents: 'none' }}>
              <div
                onClick={() => onCitySelect(city)}
                style={{
                  pointerEvents: 'auto',
                  cursor: 'pointer',
                  background: 'rgba(0,0,0,0.7)',
                  color: '#fff',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  border: '1px solid rgba(255,255,255,0.5)',
                  boxShadow: '0 0 8px rgba(255,255,255,0.5)',
                  userSelect:       'none',       // no text selection
                  WebkitUserSelect: 'none',
                  MozUserSelect:    'none',
                  WebkitUserDrag:   'none',       // no drag ghost
                  userDrag:         'none',
                  outline:          'none',       // no focus ring
                  WebkitTapHighlightColor: 'transparent', // no mobile tap glow
                }}
              >{city.name}</div>
            </Html>
          );
        }

        const isOpen = selectedCluster === idx;
        return (
          <React.Fragment key={`cluster-${idx}`}>            
            <Html position={[cx, cy, cz]} occlude={[sphereRef]} center style={{ pointerEvents: 'none' }}>
              <div
                onClick={() => onClusterToggle(idx)}
                style={{
                  pointerEvents: 'auto',
                  cursor: 'pointer',
                  background: 'rgba(255,0,0,0.7)',
                  color: '#fff',
                  padding: '6px 10px',
                  borderRadius: '16px',
                  fontSize: '0.75rem',
                  border: '1px solid rgba(255,255,255,0.5)',
                  boxShadow: '0 0 10px rgba(255,255,255,0.7)',
                  userSelect:       'none',       // no text selection
                  WebkitUserSelect: 'none',
                  MozUserSelect:    'none',
                  WebkitUserDrag:   'none',       // no drag ghost
                  userDrag:         'none',
                  outline:          'none',       // no focus ring
                  WebkitTapHighlightColor: 'transparent', // no mobile tap glow
                }}
              >{group.length} Cities</div>
            </Html>
            {isOpen && group.map((city, j, arr) => {
              const angleIncrement = (2 * Math.PI) / arr.length;
              const startAngle = -Math.PI / 2; // 9 o'clock position
              const currentAngle = startAngle + (j * angleIncrement); // Clockwise rotation
              const CIRCLE_RADIUS = 10; // Increased radius to spread out labels

              const latOff = avgLat + Math.cos(currentAngle) * CIRCLE_RADIUS;
              const lonOff = avgLon + Math.sin(currentAngle) * CIRCLE_RADIUS;
              const [px, py, pz] = latLonToCartesian(latOff, lonOff, 1.6);

              return (
                <React.Fragment key={city.name}>
                  <Html position={[px, py, pz]} center style={{ pointerEvents: 'none' }}>
                    <div
                      onClick={() => onCitySelect(city)}
                    style={{
                      pointerEvents: 'auto',
                      cursor: 'pointer',
                      background: 'rgba(0,0,0,0.7)',
                      color: '#fff',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      border: '1px solid rgba(255,255,255,0.5)',
                      boxShadow: '0 0 8px rgba(255,255,255,0.5)',
                      userSelect: 'none'
                    }}
                  >{city.name}</div>
                  </Html>
                </React.Fragment>
              );
            })}
          </React.Fragment>
        );
      })}
    </group>
  );
};
