import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { TeamMemberCard } from '@/components/TeamMemberCard';

export default function About() {
  const [selectedMode, setSelectedMode] = useState('overall');
  const navigate = useNavigate();

  const teamMembers = [
    {
      name: "Alex Chen",
      role: "Lead Developer",
      bio: "Passionate about creating seamless user experiences and optimizing performance.",
      avatar: "/api/placeholder/150/150",
      skills: ["React", "Node.js", "MongoDB"]
    },
    {
      name: "Sarah Johnson", 
      role: "UI/UX Designer",
      bio: "Focuses on intuitive design and user-centered interfaces.",
      avatar: "/api/placeholder/150/150",
      skills: ["Figma", "Design Systems", "User Research"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-primary">
      <Navbar 
        selectedMode={selectedMode} 
        onSelectMode={setSelectedMode}
        navigate={navigate}
      />
      
      <main className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white text-center mb-6">Our Mission</h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            At MCLeaderboards, our mission is to provide Minecraft players with a comprehensive and accurate ranking system. We aim to foster a competitive yet friendly environment where players can track their progress, compare stats, and celebrate achievements.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white text-center mb-6">Meet the Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teamMembers.map((member, index) => (
              <TeamMemberCard key={index} member={member} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-white text-center mb-6">Contact Us</h2>
          <p className="text-lg text-gray-300 text-center">
            Have questions or suggestions? Reach out to us at <a href="mailto:support@mcleaderboards.com" className="text-blue-500 hover:underline">support@mcleaderboards.com</a>.
          </p>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
