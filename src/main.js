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

        // Admin Restore Easter Egg (Double Click on '플래너')
        const restoreEl = document.getElementById('admin-restore-trigger');
        let restoreClickCount = 0;
        let restoreTimer = null;

        if (restoreEl) {
            restoreEl.addEventListener('click', async () => {
                restoreClickCount++;

                if (restoreTimer) clearTimeout(restoreTimer);

                // Reset click count if no click happens within 1.5 seconds
                restoreTimer = setTimeout(() => {
                    restoreClickCount = 0;
                }, 1500);

                if (restoreClickCount >= 2) {
                    restoreClickCount = 0; // Reset just in case
                    if (confirm("🤫 [관리자 모드: 복구]\n정말 관리자 초기 일정으로 되돌리시겠습니까? 모든 변경 사항이 즉시 사라집니다.")) {
                        await triggerAdminRestore(renderList, updateMap);
                    }
                }
            });
        }

        // Admin Save Easter Egg (Double Click on Palm Tree)
        const saveEl = document.getElementById('admin-save-trigger');
        let saveClickCount = 0;
        let saveTimer = null;

        if (saveEl) {
            saveEl.addEventListener('click', async () => {
                saveClickCount++;
                if (saveTimer) clearTimeout(saveTimer);

                saveTimer = setTimeout(() => { saveClickCount = 0; }, 1500);

                if (saveClickCount >= 2) {
                    saveClickCount = 0;
                    if (confirm("🚨 [관리자 모드: 덮어쓰기]\n현재 화면에 보이는 일정을 '새로운 관리자 원본'으로 덮어쓰시겠습니까?\n(다음에 누군가 복구를 시도하면 현재 상태로 돌아오게 됩니다.)")) {
                        await triggerAdminSave();
                    }
                }
            });
        }

    } catch (error) {
        console.error("Initialization Error", error);
    }
};
