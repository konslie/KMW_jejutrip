// src/main.js

import { loadConfig, config } from './data/config.js';
import { initData, activePlan, dayOptions, setLocalPlanData } from './data/schedule.js';
import { restoreAdminPlan, overwriteAdminPlan } from './api/firebase.js';
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
        await loadConfig();

        if (config) {
            document.title = config.title;
            const titleEl = document.getElementById('dynamic-trip-title');
            if (titleEl) titleEl.textContent = config.title;

            const filterGroup = document.getElementById('filter-group');
            if (filterGroup) {
                let filterHtml = `<input type="radio" id="filter-all" name="map-filter" value="all" checked>
                                  <label for="filter-all">전체 일정</label>`;
                for (let i = 1; i <= config.totalDays; i++) {
                    filterHtml += `<input type="radio" id="filter-d${i}" name="map-filter" value="day${i}">
                                   <label for="filter-d${i}">${i}일차</label>`;
                }
                filterGroup.innerHTML = filterHtml;
            }
        }

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

        // Usage Guide Toggle
        const guideToggle = document.getElementById('guide-toggle');
        const guideContent = document.getElementById('guide-content');
        const guideArrow = document.getElementById('guide-arrow');
        if (guideToggle) {
            guideToggle.addEventListener('click', () => {
                guideContent.classList.toggle('open');
                if (guideContent.classList.contains('open')) {
                    guideArrow.style.transform = 'rotate(180deg)';
                } else {
                    guideArrow.style.transform = 'rotate(0deg)';
                }
            });
        }

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
                        try {
                            const restoredData = await restoreAdminPlan();
                            if (restoredData) {
                                setLocalPlanData(restoredData.activePlan, restoredData.dayOptions);
                                renderList();
                                updateMap();
                                alert("일정이 관리자 지정 초기 상태로 복구되었습니다!");
                            } else {
                                alert("복구에 실패했거나 백엔드에 초기 데이터가 없습니다.");
                            }
                        } catch (e) {
                            console.error(e);
                            alert("복구 중 오류가 발생했습니다.");
                        }
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
                        try {
                            const success = await overwriteAdminPlan(activePlan, dayOptions);
                            if (success) alert("현재 화면의 일정이 새로운 관리자(원본) 일정으로 저장되었습니다!");
                            else alert("관리자 일정 저장에 실패했습니다.");
                        } catch (e) {
                            console.error(e);
                            alert("저장 중 오류가 발생했습니다.");
                        }
                    }
                }
            });
        }

    } catch (error) {
        console.error("Initialization Error", error);
    }
};
