// src/api/map.js

import { activePlan, dayColors } from '../data/schedule.js';

export let map, ps;
export let markers = [];
export let polylines = [];
export let customOverlays = [];
export let isMapLoaded = false;
export let currentMapFilter = 'all';

export function setMapFilter(filterValue) {
    currentMapFilter = filterValue;
}

export function initMap(containerId, fallbackTextId) {
    return new Promise((resolve, reject) => {
        if (typeof kakao !== 'undefined' && kakao.maps) {
            kakao.maps.load(() => {
                const container = document.getElementById(containerId);
                container.innerHTML = "";
                map = new kakao.maps.Map(container, { center: new kakao.maps.LatLng(33.38, 126.55), level: 10 });
                ps = new kakao.maps.services.Places();
                isMapLoaded = true;
                resolve();
            });
        } else {
            const container = document.getElementById(containerId);
            if (container) container.innerHTML = fallbackTextId || "지도를 불러올 수 없습니다.";
            reject(new Error("Kakao Maps API Load Failed"));
        }
    });
}

function getCoords(name) {
    return new Promise((resolve) => {
        if (!ps) { resolve(null); return; }
        const query = name.includes("제주") ? name : name + " 제주";
        ps.keywordSearch(query, (data, status) => {
            if (status === kakao.maps.services.Status.OK) {
                resolve(new kakao.maps.LatLng(data[0].y, data[0].x));
            } else {
                resolve(null);
            }
        });
    });
}

export async function updateMap() {
    if (!isMapLoaded) return;

    markers.forEach(m => m.setMap(null));
    polylines.forEach(p => p.setMap(null));
    customOverlays.forEach(o => o.setMap(null));

    markers = [];
    polylines = [];
    customOverlays = [];

    let bounds = new kakao.maps.LatLngBounds();
    let hasPoints = false;

    const daysToRender = currentMapFilter === 'all' ? ['day1', 'day2', 'day3', 'day4'] : [currentMapFilter];

    for (const dayKey of daysToRender) {
        const path = [];
        let isFirstPoint = true;

        for (const item of activePlan[dayKey]) {
            const query = item.searchName || item.name;
            const coords = await getCoords(query);
            if (coords) {
                path.push(coords);

                const marker = new kakao.maps.Marker({ map: map, position: coords, title: item.name });
                markers.push(marker);

                if (isFirstPoint) {
                    const dayNumber = dayKey.replace('day', '');
                    const labelContent = `<div class="custom-marker-label" style="color: ${dayColors[dayKey]}; border: 2px solid ${dayColors[dayKey]};">${dayNumber}일차 출발</div>`;

                    const customOverlay = new kakao.maps.CustomOverlay({
                        position: coords,
                        content: labelContent,
                        yAnchor: 1
                    });
                    customOverlay.setMap(map);
                    customOverlays.push(customOverlay);
                    isFirstPoint = false;
                }

                bounds.extend(coords);
                hasPoints = true;
            }
        }

        if (path.length > 1) {
            const poly = new kakao.maps.Polyline({
                path: path,
                strokeWeight: 5,
                strokeColor: dayColors[dayKey],
                strokeOpacity: 0.8
            });
            poly.setMap(map);
            polylines.push(poly);
        }
    }

    if (hasPoints) {
        map.setBounds(bounds);
    }
}
