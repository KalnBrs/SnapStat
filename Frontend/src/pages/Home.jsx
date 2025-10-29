import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../index.css'

function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    "/Image-1.png",
    "/Image-2.png",
    "/Image-3.png",
    "/Image-4.png",
  ];
  const navigate = useNavigate();

  const scrollDownByPixels = () => {
    window.scrollBy({
      top: 400, // Scroll down by 500 pixels
      behavior: 'smooth',
    });
  };

  return (
    <div className='flex flex-col justify-self-center w-full mt-14'>
      <section className="flex flex-col items-center justify-center text-center py-20 bg-gradient-to-b from-[#141414] to-[#1f1f1f]">
        <h1 className="text-5xl font-bold text-white mb-4">
          Track Every Play. Win Every Game.
        </h1>
        <p className="text-gray-400 text-lg max-w-xl">
          Manage teams, record live football stats, and visualize game momentum — all in one platform built for coaches, players, and analysts.
        </p>
        <div className="mt-8 flex space-x-4">
          <button  className="bg-[#4A9F4A] hover:bg-[#5EB25E] text-white px-6 py-3 rounded-xl font-semibold transition">
            <a href="/login" style={{color: "white"}}>Get Started</a>
          </button>
          <button onClick={scrollDownByPixels} className="border border-gray-500 text-gray-300 px-6 py-3 rounded-xl hover:bg-[#2A2A2A] transition">
            Learn More
          </button>
        </div>
      </section>
      <section id='about' className="py-16 bg-[#1a1a1a] text-center">
        <h2 className="text-3xl font-bold text-white mb-10">Powerful Tools for Football Teams</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6">
          {[
            { icon: "🏈", title: "Live Stat Tracking", desc: "Record plays, drives, and player stats in real time." },
            { icon: "📊", title: "Game Analytics", desc: "Visualize momentum swings and performance trends." },
            { icon: "👥", title: "Team Management", desc: "Create rosters, edit lineups, and track player growth." },
            { icon: "🗓️", title: "Schedule & Results", desc: "Keep your season organized with easy game tracking." }
          ].map((f) => (
            <div key={f.title} className="bg-[#2a2a2a] p-6 rounded-xl shadow-md hover:scale-105 transition-transform">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-xl text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-[#121212] py-20 text-center">
        <h2 className="text-3xl font-bold text-white mb-6">See It in Action</h2>
        <p className="text-gray-400 mb-8">Track drives, visualize stats, and manage your team with a clean interface.</p>

        <div className="relative flex justify-center items-center w-full">
          {/* Left Arrow */}
          <button
            onClick={() => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
            className="relative left-0 bg-[#1a1a1a] p-2 h-100 rounded-full hover:bg-[#2a2a2a] transition z-10"
          >
            ◀
          </button>

          {/* Image */}
          <img
            src={images[currentIndex]}
            alt={`Preview ${currentIndex + 1}`}
            className="rounded-xl shadow-lg w-3/4 md:w-1/2 border border-gray-700"
          />

          {/* Right Arrow */}
          <button
            onClick={() => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
            className="relative right-0 bg-[#1a1a1a] p-2 rounded-full h-100 hover:bg-[#2a2a2a] transition z-10"
          >
            ▶
          </button>
        </div>
      </section>
      <section className="bg-[#121212] py-16 text-center text-white rounded-t-2xl">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Tracking?</h2>
        <p className="mb-6 text-lg">Join now to get access to real-time stat tracking and performance tools.</p>
        <button className="bg-[#121212] text-[#4A9F4A] px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition">
          Create Account
        </button>
      </section>
      <footer className="bg-[#101010] sticky text-gray-500 text-sm text-center py-6 w-full">
        © {new Date().getFullYear()} SnapStat — Built by Kaelan Brose 
      </footer>
    </div>
  )
}

export default Home