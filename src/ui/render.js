// src/ui/render.js

import { activePlan, dayOptions, dayColors, changeDayOption, updateTime, deleteItem, pushSync } from '../data/schedule.js';
import { updateMap, isMapLoaded } from '../api/map.js';
import { config } from '../data/config.js';

export function renderList() {
    const container = document.getElementById('itinerary-container');
    if (!container) return;
    container.innerHTML = "";

    if (!config) return;

    const daysArray = Array.from({ length: config.totalDays }, (_, i) => `day${i + 1}`);
    daysArray.forEach((day, dIdx) => {
        const section = document.createElement('div');
        section.className = 'day-section';

        let dayColor = dayColors[day] || '#333333';
        let optA_active = dayOptions[day] === 'A' ? 'active' : '';
        let optB_active = dayOptions[day] === 'B' ? 'active' : '';

        section.innerHTML = `
            <div class="day-header-wrap">
                <div class="day-title" style="color: ${dayColor}; border-left-color: ${dayColor};">
                    ${dIdx + 1}일차 일정
                </div>
            </div>
            <ul id="list-${day}" class="schedule-list"></ul>`;

        container.appendChild(section);

        const listEl = document.getElementById(`list-${day}`);

        activePlan[day].sort((a, b) => (a.time > b.time ? 1 : -1)).forEach((item, iIdx) => {
            const li = document.createElement('li');
            li.className = 'schedule-card';

            const descHtml = item.desc ? `<p class="desc">${item.desc}</p>` : '';

            let tipsHtml = '';
            if (item.tips) {
                const isAlert = item.tips.includes('⚠️');
                tipsHtml = `<div class="tips ${isAlert ? 'alert' : ''}">${item.tips}</div>`;
            }

            const currentOpt = dayOptions[day];
            const nextOpt = currentOpt === 'A' ? 'B' : 'A';
            const altBadgeHtml = item.hasAlt ? `<button class="alt-badge alt-toggle-btn" data-day="${day}" data-nextopt="${nextOpt}">대안 보기 Click</button>` : '';

            li.innerHTML = `
                <div class="handle">☰</div>
                <div class="time-col">
                    <input type="text" class="time-input" value="${item.time}" style="color: ${dayColor};" data-day="${day}" data-idx="${iIdx}">
                </div>
                <div class="info">
                    <h4>${item.name} ${altBadgeHtml}</h4>
                    ${descHtml}
                    ${tipsHtml}
                </div>
                <button class="del-btn" data-day="${day}" data-idx="${iIdx}">×</button>`;

            listEl.appendChild(li);
        });

        // Add Event Listeners inside list processing
        listEl.querySelectorAll('.time-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const d = e.target.getAttribute('data-day');
                const idx = e.target.getAttribute('data-idx');
                updateTime(d, idx, e.target.value, renderList, updateMap);
            });
        });

        listEl.querySelectorAll('.del-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const d = e.target.getAttribute('data-day');
                const idx = e.target.getAttribute('data-idx');
                deleteItem(d, idx, renderList, updateMap);
            });
        });

        listEl.querySelectorAll('.alt-toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetDay = e.target.getAttribute('data-day');
                const targetOpt = e.target.getAttribute('data-nextopt');
                changeDayOption(targetDay, targetOpt, renderList, updateMap);
            });
        });

        // Initialize Sortable
        if (typeof window.Sortable !== 'undefined') {
            new window.Sortable(listEl, {
                handle: '.handle',
                animation: 150,
                onEnd: function (evt) {
                    const dayKey = evt.from.id.replace('list-', '');
                    const movedItem = activePlan[dayKey].splice(evt.oldIndex, 1)[0];
                    activePlan[dayKey].splice(evt.newIndex, 0, movedItem);
                    if (isMapLoaded) updateMap();
                    pushSync();
                }
            });
        }
    });
}
