import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "hanasushi-54d82.firebaseapp.com",
  projectId: "hanasushi-54d82"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// points
export async function addTransaction(phone, amount) {
  const ref = doc(db, "customers", phone);
  const snap = await getDoc(ref);

  const points = Math.floor(amount * 0.1);

  if (!snap.exists()) {
    await setDoc(ref, { points, totalSpent: amount });
  } else {
    const data = snap.data();
    await updateDoc(ref, {
      points: (data.points || 0) + points,
      totalSpent: (data.totalSpent || 0) + amount
    });
  }

  await addDoc(collection(ref, "transactions"), {
    amount,
    points,
    date: new Date()
  });
}

window.checkPoints = async function () {
  const phone = document.getElementById("checkPhone").value;
  const ref = doc(db, "customers", phone);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    document.getElementById("pointResult").innerText = "Points: 0";
  } else {
    document.getElementById("pointResult").innerText =
      "Points: " + snap.data().points;
  }
};