import { Outlet } from "react-router-dom";
import { ParticleBackground } from "./ParticleBackground";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function Layout() {
  return (
    <div className="min-h-screen relative flex flex-col bg-grid-pattern">
      <ParticleBackground />
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

