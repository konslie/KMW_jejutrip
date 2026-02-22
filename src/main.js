// src/main.js

import { initData } from './data/schedule.js';
import { initMap, updateMap, setMapFilter } from './api/map.js';
import { renderList } from './ui/render.js';
import { initSearchEvents } from './ui/search.js';

// Scroll Event for Shrinking Map
window.onscroll = function () {
    const wrapper = document.getElementById('map-wrapper');
    if (window.pageYOffset > 40) {
        wrapper.classList.add('shrink');
    } else {
        wrapper.classList.remove('shrink');
    }
};

window.onload = function () {
    try {
        initData(renderList, updateMap);
        initSearchEvents(renderList);

        initMap('kakao-map', '지도를 불러올 수 없습니다.')
            .then(() => {
                updateMap();
            })
            .catch(err => {
                console.error(err);
            });

        // Map Filter Buttons
        document.querySelectorAll('input[name="map-filter"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                setMapFilter(e.target.value);
                updateMap();
            });
        });

    } catch (error) {
        console.error("Initialization Error", error);
    }
};
