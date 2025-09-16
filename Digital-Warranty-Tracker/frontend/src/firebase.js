// src/firebase.js
import { initializeApp } from "firebase/app"
import { getMessaging, getToken, onMessage } from "firebase/messaging"
import { getAnalytics } from "firebase/analytics"

// 🔹 Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyBXggQ3vC5or71FqnFp2_pvs9_h6qe6FSk",
  authDomain: "digital-warranty-tracker.firebaseapp.com",
  projectId: "digital-warranty-tracker",
  storageBucket: "digital-warranty-tracker.firebasestorage.app",
  messagingSenderId: "542788865970",
  appId: "1:542788865970:web:910e20df3c28a6d8825eab",
  measurementId: "G-GH5LXKQY0Y"
}

// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig)
getAnalytics(app)

// 🔹 Messaging instance
const messaging = getMessaging(app)

/**
 * Request FCM token for push notifications
 */
export const requestForToken = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: "BEqX3SFRK2CFkITWei-WCTW4DRSQTs4zXpDDZMFTwCu9AygYq2BhlLGukkGbz3eL_jsV2ZPTIq3dHJxdRr7SJYg", // Replace with real VAPID key
    })

    if (token) {
      console.log("🔑 FCM Token:", token)
      return token
    } else {
      console.log("⚠️ No registration token available. Request permission to generate one.")
    }
  } catch (error) {
    console.error("❌ Error getting FCM token:", error)
  }
}

/**
 * Listener for foreground messages
 */
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("📩 Foreground message received:", payload)
      resolve(payload)
    })
  })
