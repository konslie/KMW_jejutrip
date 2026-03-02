// src/api/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDDdKzVQQpioYKFsIb29QADc4SAv8UISOM",
    authDomain: "kmw-jejutrip.firebaseapp.com",
    projectId: "kmw-jejutrip",
    storageBucket: "kmw-jejutrip.firebasestorage.app",
    messagingSenderId: "399281249046",
    appId: "1:399281249046:web:23bc9653791592936c4e37"
};

import { config } from '../data/config.js';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

let docRef = null;
function getDocRef() {
    if (!docRef && config) {
        docRef = doc(db, "trips", config.tripId);
    }
    return docRef;
}
let isInternalUpdate = false;

// Initialize or update the entire document, including adminPlan if it's the very first time.
export async function initializeFirestorePlan(activePlan, dayOptions) {
    try {
        isInternalUpdate = true;

        const ref = getDocRef();
        if (!ref) return;

        const docSnap = await getDoc(ref);
        let updateData = { activePlan, dayOptions };

        // If this is the absolute first time saving, also set the adminPlan as the baseline.
        if (!docSnap.exists() || !docSnap.data().adminPlan) {
            updateData.adminPlan = activePlan;
            updateData.adminDayOptions = dayOptions;
        }

        await setDoc(ref, updateData, { merge: true });

        setTimeout(() => { isInternalUpdate = false; }, 800);
    } catch (e) {
        console.error("Error initializing Firebase:", e);
    }
}

// Push only activePlan changes (day-to-day modifications)
export async function syncPlanToFirestore(activePlan, dayOptions) {
    try {
        isInternalUpdate = true;
        const ref = getDocRef();
        if (!ref) return;
        await setDoc(ref, { activePlan, dayOptions }, { merge: true });

        setTimeout(() => { isInternalUpdate = false; }, 800);
    } catch (e) {
        console.error("Error syncing to Firestore:", e);
    }
}

export async function loadPlanFromFirestore() {
    try {
        const ref = getDocRef();
        if (!ref) return null;
        const docSnap = await getDoc(ref);
        if (docSnap.exists()) {
            return docSnap.data();
        }
    } catch (e) {
        console.error("Error loading from Firestore:", e);
    }
    return null;
}

export function subscribeToPlanChanges(callback) {
    const ref = getDocRef();
    if (!ref) return;

    onSnapshot(ref, (docSnap) => {
        if (!isInternalUpdate && docSnap.exists()) {
            callback(docSnap.data());
        }
    });
}

// Restore activePlan to the saved adminPlan
export async function restoreAdminPlan() {
    const ref = getDocRef();
    if (!ref) return null;

    const docSnap = await getDoc(ref);
    if (docSnap.exists() && docSnap.data().adminPlan && docSnap.data().adminDayOptions) {
        const data = docSnap.data();
        await syncPlanToFirestore(data.adminPlan, data.adminDayOptions);
        return { activePlan: data.adminPlan, dayOptions: data.adminDayOptions };
    }
    return null;
}

// Force overwrite the admin baseline with a specific activePlan state.
export async function overwriteAdminPlan(activePlan, dayOptions) {
    const ref = getDocRef();
    if (!ref) return false;

    await setDoc(ref, {
        adminPlan: activePlan,
        adminDayOptions: dayOptions
    }, { merge: true });

    return true;
}
