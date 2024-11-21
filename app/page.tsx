"use client";
import { useRouter } from 'next/navigation';
import {routes} from '@/util/constants';

export default function WelcomePage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push(routes.auth.path); 
  };

  return (
    <section className="welcome-container">
      <div className="welcome-wrapper">
        <p  className="text-7xl font-bold mb-4">Welcome to Anime Zone!</p>
        <h1>Anime Zone is a application that blah blah blah blah blah....</h1>
        <h3>Click the button below to get started!</h3>
        <button className="auth-button" onClick={handleGetStarted}>Get Started</button>
      </div>
    </section>
  );
}
