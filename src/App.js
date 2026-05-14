import React, { useState } from 'react';

import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyCdTjvcA0vOezKjs56C5O71ZhTF2j7Uwbg",
  authDomain: "chat-c629a.firebaseapp.com",
  projectId: "chat-c629a",
  storageBucket: "chat-c629a.firebasestorage.app",
  messagingSenderId: "1082924679055",
  appId: "1:1082924679055:web:fc8f08d38c9a5713b155fa"
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">

      {user ? <ChatRoom /> : <SignIn />}

    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {

    const provider = new firebase.auth.GoogleAuthProvider();

    auth.signInWithPopup(provider);

  };

  return (
    <div className="login">

      <h1>🔥 My Chat App</h1>

      <button onClick={signInWithGoogle}>
        Sign in with Google
      </button>

    </div>
  );
}


     /* ========================================
   CAMPUS AR NAVIGATOR — navigator.js
   Features:
   - Leaflet.js map with campus overlay
   - GPS geolocation + live tracking
   - AR camera overlay with waypoint arrows
   - Search with autocomplete
   - Route generation (step-by-step)
   - Daily events system
   - Push notifications for logged-in users
   - User auth (localStorage)
   ======================================== */

'use strict';

// ══════════════════════════════════════
// CAMPUS DATA — locations & events
// ══════════════════════════════════════
const CAMPUS_CENTER = [12.9716, 77.5946]; // Bengaluru coords — replace with actual campus

const CAMPUS_LOCATIONS = [
  { id: 'main-gate',      name: 'Main Gate',          type: 'entrance',   icon: '🚪', lat: 12.9730, lng: 77.5950, floor: 0 },
  { id: 'admin-block',    name: 'Admin Block',         type: 'admin',      icon: '🏛️', lat: 12.9720, lng: 77.5948, floor: 1 },
  { id: 'lib',            name: 'Central Library',     type: 'library',    icon: '📚', lat: 12.9712, lng: 77.5942, floor: 3 },
  { id: 'cs-dept',        name: 'CS Department',       type: 'academic',   icon: '💻', lat: 12.9718, lng: 77.5955, floor: 2 },
  { id: 'mech-dept',      name: 'Mechanical Dept',     type: 'academic',   icon: '⚙️', lat: 12.9708, lng: 77.5960, floor: 2 },
  { id: 'ece-dept',       name: 'ECE Department',      type: 'academic',   icon: '📡', lat: 12.9724, lng: 77.5938, floor: 2 },
  { id: 'civil-dept',     name: 'Civil Department',    type: 'academic',   icon: '🏗️', lat: 12.9710, lng: 77.5935, floor: 2 },
  { id: 'auditorium-a',   name: 'Auditorium A',        type: 'auditorium', icon: '🎭', lat: 12.9714, lng: 77.5952, floor: 0 },
  { id: 'auditorium-b',   name: 'Auditorium B',        type: 'auditorium', icon: '🎪', lat: 12.9706, lng: 77.5945, floor: 0 },
  { id: 'seminar-hall',   name: 'Seminar Hall',        type: 'auditorium', icon: '🎓', lat: 12.9722, lng: 77.5962, floor: 1 },
  { id: 'canteen',        name: 'Main Canteen',         type: 'food',       icon: '🍽️', lat: 12.9716, lng: 77.5940, floor: 0 },
  { id: 'sports',         name: 'Sports Complex',      type: 'sports',     icon: '⚽', lat: 12.9702, lng: 77.5950, floor: 0 },
  { id: 'hostel-boys',    name: 'Boys Hostel',         type: 'hostel',     icon: '🏠', lat: 12.9698, lng: 77.5960, floor: 0 },
  { id: 'hostel-girls',   name: 'Girls Hostel',        type: 'hostel',     icon: '🏡', lat: 12.9695, lng: 77.5942, floor: 0 },
  { id: 'medical',        name: 'Medical Centre',      type: 'medical',    icon: '🏥', lat: 12.9726, lng: 77.5944, floor: 0 },
  { id: 'parking',        name: 'Parking Area',        type: 'parking',    icon: '🅿️', lat: 12.9732, lng: 77.5956, floor: 0 },
  { id: 'workshop',       name: 'Workshop',            type: 'lab',        icon: '🔧', lat: 12.9704, lng: 77.5936, floor: 0 },
  { id: 'nss-room',       name: 'NSS / NCC Room',      type: 'club',       icon: '🎖️', lat: 12.9719, lng: 77.5932, floor: 1 },
  { id: 'placement',      name: 'Placement Cell',      type: 'admin',      icon: '💼', lat: 12.9722, lng: 77.5948, floor: 2 },
  { id: 'bank-atm',       name: 'Bank / ATM',          type: 'facility',   icon: '🏧', lat: 12.9728, lng: 77.5935, floor: 0 },
];

// Generate today's events (rotate daily)
function getTodaysEvents() {
  const today = new Date();
  const day = today.getDay(); // 0-6
  const date = today.toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'short' });
  
  const eventSets = [
    // Sunday
    [
      { venue: 'auditorium-a', title: 'Annual Cultural Fest – Day 2', time: '10:00 AM – 6:00 PM', organizer: 'Cultural Committee' },
    ],
    // Monday
    [
      { venue: 'seminar-hall',  title: 'Guest Lecture: AI in Healthcare', time: '2:00 PM – 4:00 PM', organizer: 'CS Dept' },
      { venue: 'cs-dept',       title: 'Hackathon Registrations Open', time: 'All Day', organizer: 'Tech Club' },
    ],
    // Tuesday
    [
      { venue: 'auditorium-b', title: 'Inter-College Debate Championship', time: '9:00 AM – 5:00 PM', organizer: 'Literary Society' },
      { venue: 'sports',       title: 'Football Tournament – Quarterfinal', time: '3:00 PM – 5:00 PM', organizer: 'Sports Committee' },
    ],
    // Wednesday
    [
      { venue: 'auditorium-a', title: 'Tech Symposium 2025', time: '10:00 AM – 6:00 PM', organizer: 'IEEE Club' },
      { venue: 'seminar-hall', title: 'Placement Drive – Infosys', time: '8:00 AM – 5:00 PM', organizer: 'Placement Cell' },
    ],
    // Thursday
    [
      { venue: 'seminar-hall', title: 'Research Paper Presentation', time: '11:00 AM – 1:00 PM', organizer: 'ECE Dept' },
      { venue: 'auditorium-b', title: 'Alumni Meet 2025', time: '5:00 PM – 8:00 PM', organizer: 'Alumni Association' },
    ],
    // Friday
    [
      { venue: 'auditorium-a', title: 'Freshers Welcome Ceremony', time: '11:00 AM – 2:00 PM', organizer: 'Student Council' },
      { venue: 'canteen',      title: 'Food Festival – Cultural Stalls', time: '1:00 PM – 7:00 PM', organizer: 'Cultural Club' },
    ],
    // Saturday
    [
      { venue: 'sports',       title: 'Annual Sports Day – Track Events', time: '7:00 AM – 5:00 PM', organizer: 'Sports Committee' },
      { venue: 'auditorium-b', title: 'Short Film Screening Night', time: '7:00 PM – 9:00 PM', organizer: 'Film Club' },
    ],
  ];
  
  return (eventSets[day] || []).map((e, i) => ({
    ...e,
    id: `evt-${i}`,
    date,
    location: CAMPUS_LOCATIONS.find(l => l.id === e.venue),
  }));
}

const TODAY_EVENTS = getTodaysEvents();

// Get venues with events today
const VENUES_WITH_EVENTS = new Set(TODAY_EVENTS.map(e => e.venue));

// ══════════════════════════════════════
// AUTH STATE
// ══════════════════════════════════════
let currentUser = null;

function loadUser() {
  const stored = localStorage.getItem('campusnav_user');
  if (stored) {
    try { currentUser = JSON.parse(stored); } catch {}
  }
}

function saveUser(user) {
  currentUser = user;
  localStorage.setItem('campusnav_user', JSON.stringify(user));
}

function logout() {
  currentUser = null;
  localStorage.removeItem('campusnav_user');
  updateAuthUI();
  showToast('Logged out', 'info');
}

function updateAuthUI() {
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const avatar = document.getElementById('user-avatar');
  const badge = document.getElementById('notif-badge');

  if (currentUser) {
    loginBtn.style.display = 'none';
    logoutBtn.style.display = '';
    avatar.textContent = currentUser.name.slice(0, 2).toUpperCase();
    avatar.classList.add('show');
    badge.classList.add('show');
    badge.textContent = getUnreadCount();
  } else {
    loginBtn.style.display = '';
    logoutBtn.style.display = 'none';
    avatar.classList.remove('show');
    badge.classList.remove('show');
  }
}

// ══════════════════════════════════════
// MAP STATE
// ══════════════════════════════════════
let map = null;
let userMarker = null;
let destMarker = null;
let routeLayer = null;
let userLat = null, userLng = null;
let selectedDestination = null;
let navMode = 'walk'; // walk | drive | accessible
let watchId = null;

// ══════════════════════════════════════
// INITIALISE MAP
// ══════════════════════════════════════
function initMap() {
  map = L.map('map', {
    center: CAMPUS_CENTER,
    zoom: 17,
    zoomControl: false,
    attributionControl: false,
  });

  // Tile layer — dark style
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap, © CARTO',
    maxZoom: 21,
  }).addTo(map);

  // Attribution small
  L.control.attribution({ position: 'bottomright', prefix: false }).addTo(map);

  // Add campus locations as markers
  CAMPUS_LOCATIONS.forEach(loc => {
    const hasEvent = VENUES_WITH_EVENTS.has(loc.id);
    const icon = L.divIcon({
      className: '',
      html: `<div class="map-campus-marker ${hasEvent ? 'has-event' : ''}">
               <span>${loc.icon}</span>
               ${hasEvent ? '<div class="map-event-pulse"></div>' : ''}
             </div>`,
      iconSize: [38, 38],
      iconAnchor: [19, 38],
    });

    const marker = L.marker([loc.lat, loc.lng], { icon })
      .addTo(map)
      .on('click', () => selectDestination(loc));

    // Tooltip
    marker.bindTooltip(`<b>${loc.name}</b>${hasEvent ? '<br>🟡 Event Today' : ''}`, {
      direction: 'top', offset: [0, -38],
      className: 'campus-tooltip'
    });
  });

  // Start geolocation
  startGeolocation();
  renderEventsList();
  renderLocationCards();
  buildTicker();
}

// Custom marker styles injected
const markerStyle = document.createElement('style');
markerStyle.textContent = `
  .map-campus-marker {
    width: 38px; height: 38px;
    background: rgba(13,21,32,0.9);
    border: 1.5px solid #1e3048;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.95rem;
    cursor: pointer;
    transition: border-color 0.2s;
    position: relative;
  }
  .map-campus-marker span { transform: rotate(45deg); }
  .map-campus-marker:hover, .map-campus-marker.selected { border-color: #00c8ff; box-shadow: 0 0 12px rgba(0,200,255,0.4); }
  .map-campus-marker.has-event { border-color: #ffb300; }
  .map-event-pulse {
    position: absolute; top: -4px; right: -4px;
    width: 10px; height: 10px;
    border-radius: 50%;
    background: #ffb300;
    animation: pulse-dot 1.2s ease-in-out infinite;
    transform: rotate(45deg);
  }
  .campus-tooltip {
    background: rgba(13,21,32,0.95) !important;
    border: 1px solid #1e3048 !important;
    border-radius: 6px !important;
    color: #ddeeff !important;
    font-family: 'Syne', sans-serif !important;
    font-size: 0.75rem !important;
    padding: 5px 10px !important;
    box-shadow: 0 4px 20px rgba(0,0,0,0.5) !important;
  }
  .campus-tooltip::before { display: none !important; }
  .user-loc-marker {
    width: 20px; height: 20px;
    border-radius: 50%;
    background: #00ff9d;
    border: 3px solid rgba(0,255,157,0.3);
    box-shadow: 0 0 0 6px rgba(0,255,157,0.15), 0 0 20px rgba(0,255,157,0.4);
    animation: user-pulse 2s ease-in-out infinite;
  }
  @keyframes user-pulse {
    0%,100% { box-shadow: 0 0 0 6px rgba(0,255,157,0.15), 0 0 20px rgba(0,255,157,0.4); }
    50%      { box-shadow: 0 0 0 12px rgba(0,255,157,0.05), 0 0 30px rgba(0,255,157,0.6); }
  }
  .dest-marker {
    width: 36px; height: 36px;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    background: rgba(0,200,255,0.15);
    border: 2px solid #00c8ff;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 20px rgba(0,200,255,0.4);
    animation: dest-pulse 2s ease-in-out infinite;
  }
  .dest-marker span { transform: rotate(45deg); font-size: 1rem; }
  @keyframes dest-pulse {
    0%,100% { box-shadow: 0 0 20px rgba(0,200,255,0.4); }
    50%      { box-shadow: 0 0 35px rgba(0,200,255,0.7); }
  }
  .leaflet-routing-container { display: none !important; }
`;
document.head.appendChild(markerStyle);

// ══════════════════════════════════════
// GEOLOCATION
// ══════════════════════════════════════
function startGeolocation() {
  if (!navigator.geolocation) {
    showToast('Geolocation not supported by your browser', 'warn');
    // Use campus centre as fallback
    setUserLocation(CAMPUS_CENTER[0], CAMPUS_CENTER[1]);
    return;
  }

  const opts = { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 };

  navigator.geolocation.getCurrentPosition(pos => {
    setUserLocation(pos.coords.latitude, pos.coords.longitude);
    watchId = navigator.geolocation.watchPosition(pos => {
      setUserLocation(pos.coords.latitude, pos.coords.longitude);
    }, null, opts);
  }, err => {
    showToast('📍 Using campus centre (GPS unavailable)', 'info');
    setUserLocation(CAMPUS_CENTER[0], CAMPUS_CENTER[1]);
  }, opts);
}

function setUserLocation(lat, lng) {
  userLat = lat; userLng = lng;

  const userIcon = L.divIcon({
    className: '',
    html: '<div class="user-loc-marker"></div>',
    iconSize: [20, 20], iconAnchor: [10, 10],
  });

  if (userMarker) {
    userMarker.setLatLng([lat, lng]);
  } else {
    userMarker = L.marker([lat, lng], { icon: userIcon, zIndexOffset: 1000 }).addTo(map);
    userMarker.bindTooltip('You are here', { permanent: false, direction: 'top', offset: [0, -14] });
    map.setView([lat, lng], 17);
  }

  // Update HUD
  const hud = document.getElementById('loc-hud-text');
  if (hud) {
    hud.textContent = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }

  document.getElementById('from-input').value = 'My Current Location';

  // Update route if navigating
  if (selectedDestination) updateRoute();
}

// ══════════════════════════════════════
// SEARCH
// ══════════════════════════════════════
function initSearch() {
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  const searchClear = document.getElementById('search-clear');

  searchInput.addEventListener('input', function () {
    const val = this.value.trim().toLowerCase();
    searchClear.classList.toggle('show', val.length > 0);

    if (val.length < 1) { searchResults.classList.remove('show'); return; }

    const filtered = CAMPUS_LOCATIONS.filter(l =>
      l.name.toLowerCase().includes(val) || l.type.toLowerCase().includes(val)
    );

    if (filtered.length === 0) { searchResults.classList.remove('show'); return; }

    searchResults.innerHTML = filtered.slice(0, 8).map(loc => {
      const hasEvent = VENUES_WITH_EVENTS.has(loc.id);
      return `<div class="search-result-item" onclick="selectDestinationFromSearch('${loc.id}')">
        <div class="sri-icon">${loc.icon}</div>
        <div class="sri-info">
          <div class="sri-name">${loc.name}</div>
          <div class="sri-type">${loc.type}${loc.floor > 0 ? ` · Floor ${loc.floor}` : ''}</div>
        </div>
        ${hasEvent ? '<div class="sri-event-dot" title="Event today"></div>' : ''}
      </div>`;
    }).join('');

    searchResults.classList.add('show');
  });

  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    searchClear.classList.remove('show');
    searchResults.classList.remove('show');
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
      searchResults.classList.remove('show');
    }
  });
}

function selectDestinationFromSearch(id) {
  const loc = CAMPUS_LOCATIONS.find(l => l.id === id);
  if (!loc) return;
  document.getElementById('search-input').value = loc.name;
  document.getElementById('search-results').classList.remove('show');
  selectDestination(loc);
}

// ══════════════════════════════════════
// DESTINATION & ROUTING
// ══════════════════════════════════════
function selectDestination(loc) {
  selectedDestination = loc;
  document.getElementById('to-input').value = loc.name;

  // Remove old dest marker
  if (destMarker) map.removeLayer(destMarker);

  const icon = L.divIcon({
    className: '',
    html: `<div class="dest-marker"><span>${loc.icon}</span></div>`,
    iconSize: [36, 36], iconAnchor: [18, 36],
  });

  destMarker = L.marker([loc.lat, loc.lng], { icon }).addTo(map);
  map.flyTo([loc.lat, loc.lng], 18, { duration: 1.2 });

  showToast(`📍 Destination: ${loc.name}`, 'info');
  updateRoute();
}

function updateRoute() {
  if (!userLat || !selectedDestination) return;

  const from = { lat: userLat, lng: userLng };
  const to = { lat: selectedDestination.lat, lng: selectedDestination.lng };

  // Draw a simple polyline route (in a real app use OSRM/GraphHopper)
  if (routeLayer) map.removeLayer(routeLayer);

  // Generate a simple campus route with waypoints
  const routePoints = generateCampusRoute(from, to);
  routeLayer = L.polyline(routePoints, {
    color: '#00c8ff',
    weight: 4,
    opacity: 0.8,
    dashArray: '10, 6',
    lineCap: 'round',
  }).addTo(map);

  // Fit bounds
  const bounds = L.latLngBounds([
    [from.lat, from.lng],
    [to.lat, to.lng],
  ]);
  map.fitBounds(bounds, { padding: [60, 60] });

  // Render route steps
  const dist = calcDistance(from.lat, from.lng, to.lat, to.lng);
  const steps = generateRouteSteps(selectedDestination, dist);
  renderRoutePanel(steps, dist);
}

function generateCampusRoute(from, to) {
  // Add an intermediate waypoint for a more realistic path
  const midLat = (from.lat + to.lat) / 2 + (Math.random() * 0.0006 - 0.0003);
  const midLng = (from.lng + to.lng) / 2 + (Math.random() * 0.0006 - 0.0003);
  return [
    [from.lat, from.lng],
    [midLat, midLng],
    [to.lat, to.lng],
  ];
}

function calcDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function generateRouteSteps(dest, totalDist) {
  const eta = navMode === 'drive'
    ? Math.ceil(totalDist / 8000 * 60) + ' min'
    : Math.ceil(totalDist / 80) + ' sec walk';

  const steps = [
    { text: `Head towards ${getCardinalDirection()} on the main pathway`, dist: `${Math.round(totalDist * 0.25)}m` },
    { text: 'Turn right at the Admin Block junction', dist: `${Math.round(totalDist * 0.35)}m` },
    { text: `Continue straight past the ${getRandomLandmark()}`, dist: `${Math.round(totalDist * 0.25)}m` },
    { text: `Arrive at <strong>${dest.name}</strong>${dest.floor > 0 ? ` — Floor ${dest.floor}` : ''}`, dist: `${Math.round(totalDist * 0.15)}m` },
  ];

  return { steps, totalDist, eta };
}

function renderRoutePanel({ steps, totalDist, eta }) {
  const panel = document.getElementById('route-panel');
  const stepsEl = document.getElementById('route-steps');

  document.getElementById('route-dist').textContent = totalDist >= 1000 ? `${(totalDist / 1000).toFixed(1)} km` : `${totalDist}m`;
  document.getElementById('route-eta').textContent = eta;

  stepsEl.innerHTML = steps.map((s, i) => `
    <div class="route-step">
      <div class="step-num">${i + 1}</div>
      <div>
        <div class="step-text">${s.text}</div>
        <div class="step-dist">${s.dist}</div>
      </div>
    </div>
  `).join('');

  panel.classList.add('show');
}

function getCardinalDirection() {
  const dirs = ['North', 'South', 'East', 'West', 'North-East', 'South-West'];
  return dirs[Math.floor(Math.random() * dirs.length)];
}

function getRandomLandmark() {
  const lm = ['canteen', 'library fountain', 'parking lot', 'garden path', 'basketball court'];
  return lm[Math.floor(Math.random() * lm.length)];
}

// Navigate button
function startNavigation() {
  if (!selectedDestination) {
    showToast('⚠ Select a destination first', 'warn');
    return;
  }
  if (!userLat) {
    showToast('⚠ Waiting for your location...', 'warn');
    return;
  }
  updateRoute();
  showToast(`🧭 Navigating to ${selectedDestination.name}`, 'info');
}

// ══════════════════════════════════════
// NAV MODE TABS
// ══════════════════════════════════════
function setNavMode(mode) {
  navMode = mode;
  document.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active'));
  document.getElementById(`tab-${mode}`).classList.add('active');
  if (selectedDestination) updateRoute();
}

// ══════════════════════════════════════
// AR OVERLAY
// ══════════════════════════════════════
let arStream = null;

async function openAR() {
  if (!selectedDestination) {
    showToast('📍 Select a destination first', 'warn');
    return;
  }

  const overlay = document.getElementById('ar-overlay');
  overlay.classList.add('active');

  // Update AR info
  document.getElementById('ar-dest-name').textContent = selectedDestination.name;
  const dist = userLat
    ? calcDistance(userLat, userLng, selectedDestination.lat, selectedDestination.lng)
    : 0;
  const eta = Math.ceil(dist / 80);
  document.getElementById('ar-eta-val').textContent = eta;

  // Position AR markers randomly (simulated)
  positionARMarkers();

  // Camera access
  try {
    arStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }
    });
    document.getElementById('ar-video').srcObject = arStream;
    document.getElementById('ar-video').play();
  } catch (err) {
    showToast('📷 Camera unavailable — AR simulation mode', 'info');
  }

  // Start compass
  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', handleOrientation);
  }
}

function closeAR() {
  document.getElementById('ar-overlay').classList.remove('active');
  if (arStream) {
    arStream.getTracks().forEach(t => t.stop());
    arStream = null;
  }
  window.removeEventListener('deviceorientation', handleOrientation);
}

function positionARMarkers() {
  const container = document.getElementById('ar-markers');
  container.innerHTML = '';
  const nearbyLocs = CAMPUS_LOCATIONS.slice(0, 4);
  nearbyLocs.forEach((loc, i) => {
    const marker = document.createElement('div');
    marker.className = 'ar-marker';
    marker.style.cssText = `
      top: ${20 + i * 18}%;
      left: ${15 + Math.random() * 60}%;
      animation-delay: ${i * 0.4}s;
    `;
    marker.textContent = `${loc.icon} ${loc.name} · ${calcDistance(userLat || CAMPUS_CENTER[0], userLng || CAMPUS_CENTER[1], loc.lat, loc.lng)}m`;
    container.appendChild(marker);
  });
}

let arDirection = '↑';
function handleOrientation(e) {
  const heading = e.alpha || 0;
  const dirs = ['↑', '↗', '→', '↘', '↓', '↙', '←', '↖'];
  const idx = Math.round(heading / 45) % 8;
  arDirection = dirs[idx];
  const arrow = document.getElementById('ar-direction-arrow');
  if (arrow) arrow.textContent = arDirection;
}

// ══════════════════════════════════════
// EVENTS
// ══════════════════════════════════════
function renderEventsList() {
  const container = document.getElementById('events-list');
  if (!container) return;

  if (TODAY_EVENTS.length === 0) {
    container.innerHTML = '<p style="color:var(--muted);font-size:0.78rem;font-style:italic;padding:10px 0">No events scheduled today.</p>';
    return;
  }

  container.innerHTML = TODAY_EVENTS.map(evt => {
    const loc = evt.location;
    return `<div class="location-card has-event" onclick="selectDestination(${JSON.stringify(JSON.stringify(loc)).slice(1,-1)})">
      <div class="lc-top">
        <div class="lc-icon">${loc ? loc.icon : '📅'}</div>
        <div class="lc-info">
          <div class="lc-name">${evt.title}</div>
          <div class="lc-type">${loc ? loc.name : evt.venue} · ${evt.time}</div>
        </div>
      </div>
      <div class="event-tag"><div class="event-dot"></div>${evt.organizer}</div>
    </div>`;
  }).join('');
}

// Simpler rendering avoiding JSON.stringify issues:
function renderEventCards() {
  const container = document.getElementById('events-list');
  if (!container) return;
  container.innerHTML = '';

  if (TODAY_EVENTS.length === 0) {
    const p = document.createElement('p');
    p.style.cssText = 'color:var(--muted);font-size:0.78rem;font-style:italic;padding:10px 0';
    p.textContent = 'No events scheduled today.';
    container.appendChild(p);
    return;
  }

  TODAY_EVENTS.forEach(evt => {
    const loc = evt.location;
    const card = document.createElement('div');
    card.className = 'location-card has-event';
    card.innerHTML = `
      <div class="lc-top">
        <div class="lc-icon">${loc ? loc.icon : '📅'}</div>
        <div class="lc-info">
          <div class="lc-name">${evt.title}</div>
          <div class="lc-type">${loc ? loc.name : ''} · ${evt.time}</div>
        </div>
      </div>
      <div class="event-tag"><div class="event-dot"></div>${evt.organizer}</div>
    `;
    if (loc) card.addEventListener('click', () => selectDestination(loc));
    container.appendChild(card);
  });
}

// ══════════════════════════════════════
// LOCATION CARDS (All Places)
// ══════════════════════════════════════
function renderLocationCards() {
  const container = document.getElementById('places-list');
  if (!container) return;
  container.innerHTML = '';

  CAMPUS_LOCATIONS.forEach(loc => {
    const hasEvent = VENUES_WITH_EVENTS.has(loc.id);
    const dist = userLat
      ? calcDistance(userLat, userLng, loc.lat, loc.lng)
      : Math.floor(Math.random() * 400 + 50);

    const card = document.createElement('div');
    card.className = 'location-card' + (hasEvent ? ' has-event' : '');
    card.innerHTML = `
      <div class="lc-top">
        <div class="lc-icon">${loc.icon}</div>
        <div class="lc-info">
          <div class="lc-name">${loc.name}</div>
          <div class="lc-type">${loc.type}${loc.floor > 0 ? ` · Floor ${loc.floor}` : ''}</div>
        </div>
        <div class="lc-dist">${dist}m</div>
      </div>
      ${hasEvent ? '<div class="event-tag"><div class="event-dot"></div>Event Today</div>' : ''}
    `;
    card.addEventListener('click', () => selectDestination(loc));
    container.appendChild(card);
  });
}

// ══════════════════════════════════════
// TICKER
// ══════════════════════════════════════
function buildTicker() {
  const inner = document.getElementById('ticker-inner');
  if (!inner) return;

  const items = TODAY_EVENTS.length > 0
    ? TODAY_EVENTS
    : [{ title: 'No events today — have a great day!', location: null, time: '' }];

  // Duplicate for seamless loop
  const html = [...items, ...items].map(e => `
    <div class="ticker-item">
      <span>${e.location ? e.location.icon : '📅'}</span>
      <span class="ti-name">${e.title}</span>
      ${e.location ? `<span class="ti-sep">@</span><span class="ti-loc">${e.location.name}</span>` : ''}
      ${e.time ? `<span class="ti-sep">·</span><span>${e.time}</span>` : ''}
    </div>
  `).join('<span class="ti-sep" style="padding:0 12px;color:#1e3048">│</span>');

  inner.innerHTML = html;
}

// ══════════════════════════════════════
// NOTIFICATIONS
// ══════════════════════════════════════
const NOTIFICATIONS = [
  ...TODAY_EVENTS.map((e, i) => ({
    id: `evt-notif-${i}`,
    type: 'event',
    title: e.title,
    body: `${e.location ? e.location.name : ''} · ${e.time}`,
    time: 'Today',
    unread: true,
  })),
  {
    id: 'info-1',
    type: 'info',
    title: 'Campus Wi-Fi Updated',
    body: 'New password distributed via email. Connect to CampusNet-5G.',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: 'alert-1',
    type: 'alert',
    title: 'Maintenance: Block C Lift',
    body: 'Block C elevator under maintenance till Friday. Use stairs.',
    time: '2 days ago',
    unread: true,
  },
];

function getUnreadCount() {
  return NOTIFICATIONS.filter(n => n.unread).length;
}

function renderNotifications() {
  const list = document.getElementById('notif-list');
  list.innerHTML = NOTIFICATIONS.map(n => `
    <div class="notif-item ${n.unread ? 'unread' : ''}" onclick="markRead('${n.id}')">
      <div class="notif-type ${n.type}">${n.type.toUpperCase()}</div>
      <div class="notif-title">${n.title}</div>
      <div class="notif-body">${n.body}</div>
      <div class="notif-time">${n.time}</div>
    </div>
  `).join('');
}

function markRead(id) {
  const n = NOTIFICATIONS.find(x => x.id === id);
  if (n) { n.unread = false; }
  renderNotifications();
  document.getElementById('notif-badge').textContent = getUnreadCount();
}

function toggleNotifPanel() {
  if (!currentUser) {
    showToast('🔒 Login to view notifications', 'warn');
    openLoginModal();
    return;
  }
  const panel = document.getElementById('notif-panel');
  panel.classList.toggle('open');
  if (panel.classList.contains('open')) renderNotifications();
}

// ══════════════════════════════════════
// LOGIN / AUTH
// ══════════════════════════════════════
function openLoginModal() {
  document.getElementById('login-modal').classList.add('show');
}
function closeLoginModal() {
  document.getElementById('login-modal').classList.remove('show');
}

function handleLogin(e) {
  e.preventDefault();
  const name = document.getElementById('login-name').value.trim();
  const id   = document.getElementById('login-id').value.trim();
  const pass = document.getElementById('login-pass').value.trim();

  if (!name || !id || !pass) {
    showToast('⚠ Fill in all fields', 'warn');
    return;
  }

  saveUser({ name, id, role: id.startsWith('F') ? 'Faculty' : 'Student' });
  closeLoginModal();
  updateAuthUI();
  showToast(`👋 Welcome, ${name}!`, 'info');

  // Send event notifications after login
  setTimeout(() => {
    if (TODAY_EVENTS.length > 0) {
      showToast(`📅 ${TODAY_EVENTS.length} event(s) happening today!`, 'event');
    }
  }, 1000);
}

// ══════════════════════════════════════
// MAP CONTROLS
// ══════════════════════════════════════
function zoomIn()  { map.zoomIn(); }
function zoomOut() { map.zoomOut(); }

function centerOnUser() {
  if (userLat) {
    map.flyTo([userLat, userLng], 18, { duration: 1 });
  } else {
    showToast('📍 Acquiring location...', 'info');
    startGeolocation();
  }
}

function toggleSatellite() {
  const btn = document.getElementById('satellite-btn');
  btn.classList.toggle('active');
  // Switch tile layer
  map.eachLayer(layer => {
    if (layer._url && layer._url.includes('carto')) map.removeLayer(layer);
    if (layer._url && layer._url.includes('tile.openstreetmap')) map.removeLayer(layer);
  });
  if (btn.classList.contains('active')) {
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 21,
    }).addTo(map);
  } else {
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 21,
    }).addTo(map);
  }
}

// ══════════════════════════════════════
// PANEL TABS (Explore / Events / Route)
// ══════════════════════════════════════
function showPanelTab(tab) {
  document.querySelectorAll('.panel-tab-content').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.panel-tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`tab-content-${tab}`).style.display = 'block';
  document.getElementById(`ptab-${tab}`).classList.add('active');
}

// ══════════════════════════════════════
// TOAST
// ══════════════════════════════════════
function showToast(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast-msg ${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = 'all 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ══════════════════════════════════════
// BOOT
// ══════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  loadUser();
  updateAuthUI();

  // Map init (Leaflet must be loaded)
  if (typeof L !== 'undefined') {
    initMap();
    renderEventCards();
  }

  initSearch();

  // Daily event notification
  setTimeout(() => {
    if (TODAY_EVENTS.length > 0) {
      showToast(`📅 ${TODAY_EVENTS.length} campus event(s) today`, 'event');
    }
  }, 1500);

  // Login form
  const loginForm = document.getElementById('login-form');
  if (loginForm) loginForm.addEventListener('submit', handleLogin);

  // Keyboard locate shortcut
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeAR();
      closeLoginModal();
      document.getElementById('notif-panel').classList.remove('open');
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      document.getElementById('search-input').focus();
    }
  });
});
