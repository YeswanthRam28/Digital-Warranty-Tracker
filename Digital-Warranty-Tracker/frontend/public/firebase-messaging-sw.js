// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

// Same config as in firebase.js
const firebaseConfig = {
  apiKey: "AIzaSyBXggQ3vC5or71FqnFp2_pvs9_h6qe6FSk",
  authDomain: "digital-warranty-tracker.firebaseapp.com",
  projectId: "digital-warranty-tracker",
  storageBucket: "digital-warranty-tracker.firebasestorage.app",
  messagingSenderId: "542788865970",
  appId: "1:542788865970:web:910e20df3c28a6d8825eab",
  measurementId: "G-GH5LXKQY0Y"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("📩 Received background message ", payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo192.png" // optional
  });
});
