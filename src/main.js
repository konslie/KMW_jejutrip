// src/main.js

import { initData, triggerAdminRestore, triggerAdminSave } from './data/schedule.js';
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

window.onload = async function () {
    try {
        await initData(renderList, updateMap);
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

        // Admin Restore Easter Egg (5 Clicks on Title)
        const titleEl = document.getElementById('main-title');
        let clickCount = 0;
        let clickTimer = null;

        if (titleEl) {
            titleEl.addEventListener('click', async () => {
                clickCount++;

                if (clickTimer) clearTimeout(clickTimer);

                // Reset click count if no click happens within 2 seconds
                clickTimer = setTimeout(() => {
                    clickCount = 0;
                }, 2000);

                if (clickCount >= 5) {
                    clickCount = 0; // Reset just in case
                    if (confirm("🤫 [관리자 모드]\n정말 관리자 초기 일정으로 덮어쓰시겠습니까? 모든 변경 사항이 즉시 사라집니다.")) {
                        await triggerAdminRestore(renderList, updateMap);
                    }
                }
            });
        }

        // Admin Save Easter Egg (5 Clicks on Map Filter Label)
        const saveEl = document.getElementById('admin-save-trigger');
        let saveClickCount = 0;
        let saveTimer = null;

        if (saveEl) {
            saveEl.addEventListener('click', async () => {
                saveClickCount++;
                if (saveTimer) clearTimeout(saveTimer);

                saveTimer = setTimeout(() => { saveClickCount = 0; }, 2000);

                if (saveClickCount >= 5) {
                    saveClickCount = 0;
                    if (confirm("🚨 [관리자 저장 모드]\n현재 화면에 보이는 일정을 '새로운 관리자 원본'으로 덮어쓰시겠습니까?\n(다음에 누군가 복구를 시도하면 이 상태로 돌아오게 됩니다.)")) {
                        await triggerAdminSave();
                    }
                }
            });
        }

    } catch (error) {
        console.error("Initialization Error", error);
    }
};
