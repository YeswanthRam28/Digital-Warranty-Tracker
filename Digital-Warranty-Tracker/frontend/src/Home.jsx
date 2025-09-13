import React from "react";

function Home({ onStart }) {
  return (
    <div className="home-container">
      <h1 className="home-title">🚀 Digital Warranty Tracker</h1>
      <p className="home-subtitle">
        Manage all your warranties in one place. Simple, smart, and reliable.
      </p>
      <button className="home-btn" onClick={onStart}>
        Get Started
      </button>
    </div>
  );
}

export default Home;
