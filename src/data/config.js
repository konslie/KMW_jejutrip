// src/data/config.js

export let config = null;

export async function loadConfig() {
    const urlParams = new URLSearchParams(window.location.search);
    const tripId = urlParams.get('trip') || 'jeju24'; // Default to jeju24

    try {
        // Fetch from the public trips directory
        const response = await fetch(`./public/trips/${tripId}.json`);
        if (!response.ok) {
            throw new Error(`Trip config not found: ${tripId}`);
        }
        config = await response.json();
    } catch (e) {
        console.error("Failed to load trip config. Falling back to default.");
        // If fetch fails (maybe local open), fallback to basic skeleton or alert
        alert("여행 설정 파일을 불러오지 못했습니다. URL을 확인해주세요.");
    }
}
