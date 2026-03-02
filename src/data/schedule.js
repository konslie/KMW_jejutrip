// src/data/schedule.js

export const dayColors = {
    day1: '#FF8C00', day2: '#228B22', day3: '#0077BE', day4: '#800080',
    day5: '#E53E3E', day6: '#D69E2E', day7: '#38A169', day8: '#3182CE', day9: '#805AD5', day10: '#D53F8C'
};

import { config } from './config.js';

import { initializeFirestorePlan, syncPlanToFirestore, loadPlanFromFirestore, subscribeToPlanChanges } from '../api/firebase.js';

// Application State
export let activePlan = {};
export let dayOptions = {};

// Keep setter functions for main.js to update local state after Firebase restores it
export function setLocalPlanData(newPlan, newOptions) {
    activePlan = newPlan;
    dayOptions = newOptions;
}

export async function initData(renderCallback, updateMapCallback) {
    if (!config) return;

    // Initialize state objects based on totalDays
    for (let i = 1; i <= config.totalDays; i++) {
        const d = `day${i}`;
        if (!activePlan[d]) activePlan[d] = [];
        if (!dayOptions[d]) dayOptions[d] = 'A';
    }

    const savedData = await loadPlanFromFirestore();
    let isNew = false;

    if (savedData && savedData.activePlan && savedData.dayOptions) {
        activePlan = savedData.activePlan;
        dayOptions = savedData.dayOptions;
    } else {
        for (let i = 1; i <= config.totalDays; i++) {
            const d = `day${i}`;
            const currentOpt = dayOptions[d];

            // Filter rawData flat array
            const dailyItems = config.rawData.filter(item => item.day === d);
            const commonList = dailyItems.filter(item => !item.hasAlt);
            const optionList = dailyItems.filter(item => item.hasAlt && item.altOption === currentOpt);

            // Add custom elements logic
            let userAdded = (activePlan[d] || []).filter(item => item.desc === "사용자 추가 일정");
            activePlan[d] = [...commonList, ...optionList, ...userAdded];
        }
        isNew = true;
    }

    if (renderCallback) renderCallback();
    if (updateMapCallback) updateMapCallback();

    if (isNew) {
        initializeFirestorePlan(activePlan, dayOptions);
    }

    // Subscribe to changes from others
    subscribeToPlanChanges((newData) => {
        if (newData && newData.activePlan && newData.dayOptions) {
            activePlan = newData.activePlan;
            dayOptions = newData.dayOptions;
            if (renderCallback) renderCallback();
            if (updateMapCallback) updateMapCallback();
        }
    });
}

export function pushSync() {
    syncPlanToFirestore(activePlan, dayOptions);
}

export function changeDayOption(day, opt, renderCallback, updateMapCallback) {
    dayOptions[day] = opt;

    if (config) {
        const dailyItems = config.rawData.filter(item => item.day === day);
        const commonList = dailyItems.filter(item => !item.hasAlt);
        const optionList = dailyItems.filter(item => item.hasAlt && item.altOption === opt);

        let userAdded = (activePlan[day] || []).filter(item => item.desc === "사용자 추가 일정");
        activePlan[day] = [...commonList, ...optionList, ...userAdded];
    }

    if (renderCallback) renderCallback();
    if (updateMapCallback) updateMapCallback();
    pushSync();
}

export function updateTime(day, index, newTime, renderCallback, updateMapCallback) {
    activePlan[day][index].time = newTime;
    if (renderCallback) renderCallback();
    if (updateMapCallback) updateMapCallback();
    pushSync();
}

export function deleteItem(day, index, renderCallback, updateMapCallback) {
    activePlan[day].splice(index, 1);
    if (renderCallback) renderCallback();
    if (updateMapCallback) updateMapCallback();
    pushSync();
}

export function addToList(targetDay, time, name, renderCallback, updateMapCallback) {
    activePlan[targetDay].push({ name: name, searchName: name, time: time || "12:00", desc: "사용자 추가 일정", tips: "" });
    if (renderCallback) renderCallback();
    if (updateMapCallback) updateMapCallback();
    pushSync();
}


