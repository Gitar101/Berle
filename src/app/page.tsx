"use client";
import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-GB'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-4 sm:p-8`}>
      {/* Top-left purple square with white vertical line */}
      <div className={`absolute top-8 left-8 rounded-2xl flex items-center justify-center ${styles['purple-square']}`}>
        <div className={`${styles['vertical-line']}`}></div>
      </div>

      {/* Header section */}
      <header className="flex flex-col items-center justify-center h-full">
        <p className={`text-4xl font-light mb-5 ${styles['glow-text']}`}>
          {time}
        </p>
        <h1 className={`text-6xl font-light mb-8 ${styles['glow-text']} text-center`}>
          The Gideon Project
        </h1>
        <div className="flex flex-col space-y-7 w-full max-w-md">
          <button className={`${styles['glow-button']} w-full`}>Home</button>
          <button className={`${styles['glow-button']} w-full`}>GidVox</button>
          <button className={`${styles['glow-button']} w-full`}>Terminal</button>
          <button className={`${styles['glow-button']} w-full`}>SSH</button>
          <button className={`${styles['glow-button']} w-full`}>About TGP</button>
        </div>
      </header>

      {/* Placeholder for main content - will be empty as per instructions */}
      <main className="flex items-center justify-center h-full">
        {/* No content here for now, as per instructions */}
      </main>
    </div>
  );
}
