// src/ui/render.js

import { activePlan, dayOptions, dayColors, changeDayOption, updateTime, deleteItem } from '../data/schedule.js';
import { updateMap, isMapLoaded } from '../api/map.js';

export function renderList() {
    const container = document.getElementById('itinerary-container');
    if (!container) return;
    container.innerHTML = "";

    ['day1', 'day2', 'day3', 'day4'].forEach((day, dIdx) => {
        const section = document.createElement('div');
        section.className = 'day-section';

        let dayColor = dayColors[day];
        let optA_active = dayOptions[day] === 'A' ? 'active' : '';
        let optB_active = dayOptions[day] === 'B' ? 'active' : '';

        section.innerHTML = `
            <div class="day-header-wrap">
                <div class="day-title" style="color: ${dayColor}; border-left-color: ${dayColor};">
                    ${dIdx + 1}일차 일정
                </div>
                <div class="day-tabs">
                    <button class="day-tab-btn ${optA_active}" data-day="${day}" data-opt="A" style="--theme-color: ${dayColor}">A안</button>
                    <button class="day-tab-btn ${optB_active}" data-day="${day}" data-opt="B" style="--theme-color: ${dayColor}">B안</button>
                </div>
            </div>
            <ul id="list-${day}" class="schedule-list"></ul>`;

        container.appendChild(section);

        // Add Event Listeners for tabs
        section.querySelectorAll('.day-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetDay = e.target.getAttribute('data-day');
                const targetOpt = e.target.getAttribute('data-opt');
                changeDayOption(targetDay, targetOpt, renderList, updateMap);
            });
        });

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

            const altBadgeHtml = item.hasAlt ? `<span class="alt-badge">(대안 존재)</span>` : '';

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
                }
            });
        }
    });
}
