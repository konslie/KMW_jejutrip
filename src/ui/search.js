// src/ui/search.js

import { ps, isMapLoaded, currentMapFilter, updateMap } from '../api/map.js';
import { addToList } from '../data/schedule.js';

export function initSearchEvents(renderCallback) {
    const searchBtn = document.getElementById('search-btn');
    const resetBtn = document.getElementById('reset-btn');
    const keywordInput = document.getElementById('keyword');

    if (searchBtn) searchBtn.addEventListener('click', () => searchPlace(renderCallback));
    if (resetBtn) resetBtn.addEventListener('click', clearSearch);
    if (keywordInput) {
        keywordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchPlace(renderCallback);
        });
    }
}

export function searchPlace(renderCallback) {
    if (!isMapLoaded) return;

    const k = document.getElementById('keyword').value;
    if (!k.trim()) return;

    ps.keywordSearch(k + " 제주", (data, status) => {
        const resDiv = document.getElementById('search-results');
        resDiv.innerHTML = "";

        if (status === kakao.maps.services.Status.OK) {
            const resultsHtml = data.slice(0, 3).map(item => `
                <div class="result-item">
                    <div class="result-info">
                        <strong>${item.place_name}</strong>
                        <span class="result-address">${item.address_name}</span>
                    </div>
                    <button class="add-btn" data-placename="${item.place_name}">추가</button>
                </div>
            `).join('');

            resDiv.innerHTML = resultsHtml;

            // Add event listeners dynamically to buttons
            document.querySelectorAll('.add-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const placeName = e.target.getAttribute('data-placename');
                    const targetDay = currentMapFilter === 'all' ? 'day1' : currentMapFilter;
                    addToList(targetDay, placeName, renderCallback, updateMap);
                    clearSearch();
                });
            });

        } else {
            resDiv.innerHTML = `<div class="no-results">검색 결과가 없습니다.</div>`;
        }
    });
}

export function clearSearch() {
    const keywordEl = document.getElementById('keyword');
    const resultsEl = document.getElementById('search-results');
    if (keywordEl) keywordEl.value = "";
    if (resultsEl) resultsEl.innerHTML = "";
}
