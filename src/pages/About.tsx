
import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  bio: string;
  category: 'founders' | 'ceos' | 'directors';
}

const About = () => {
  const [selectedMode, setSelectedMode] = useState('overall');
  const navigate = useNavigate();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  
  const teamMembers: TeamMember[] = [
    // Founders
    { 
      name: 'Ace Jamal', 
      role: 'Main Founder', 
      avatar: 'https://crafthead.net/avatar/MHF_Steve',
      bio: 'Founded MCBE TIERS with a vision to create the definitive ranking system for Minecraft Bedrock players.',
      category: 'founders'
    },
    { 
      name: 'Nednoxx', 
      role: '2nd Main Founder', 
      avatar: 'https://crafthead.net/avatar/MHF_Steve1',
      bio: 'Co-founded MCBE TIERS and helped develop the initial ranking methodology.',
      category: 'founders'
    },
    { 
      name: 'Ziya', 
      role: 'Co-Founder', 
      avatar: 'https://crafthead.net/avatar/MHF_Steve2',
      bio: 'Joined early in development and contributed to establishing the tier system.',
      category: 'founders'
    },
    
    // CEOs
    { 
      name: 'Sabuj', 
      role: 'CEO', 
      avatar: 'https://crafthead.net/avatar/MHF_Steve3',
      bio: 'Oversees all operations and strategic direction of MCBE TIERS.',
      category: 'ceos'
    },
    { 
      name: 'Zyric', 
      role: 'CEO', 
      avatar: 'https://crafthead.net/avatar/MHF_Steve4',
      bio: 'Manages partnerships and business development for the platform.',
      category: 'ceos'
    },
    
    // Directors
    { 
      name: 'Lightning Gamer', 
      role: 'Head Director', 
      avatar: 'https://crafthead.net/avatar/MHF_Steve5',
      bio: 'Leads the overall direction and quality of the ranking system.',
      category: 'directors'
    },
    { 
      name: 'Alpha Hade', 
      role: 'Managing Director', 
      avatar: 'https://crafthead.net/avatar/MHF_Steve6',
      bio: 'Manages day-to-day operations and team coordination.',
      category: 'directors'
    },
    { 
      name: 'Donkischan', 
      role: 'Security Director', 
      avatar: 'https://crafthead.net/avatar/MHF_Steve7',
      bio: 'Ensures platform security and data protection.',
      category: 'directors'
    },
    { 
      name: 'Shinobu', 
      role: 'Events Director', 
      avatar: 'https://crafthead.net/avatar/MHF_Steve8',
      bio: 'Organizes and oversees community events and tournaments.',
      category: 'directors'
    },
    { 
      name: 'Ghost2Freaky', 
      role: 'Partnership Director', 
      avatar: 'https://crafthead.net/avatar/MHF_Steve9',
      bio: 'Manages partnerships with other Minecraft communities and brands.',
      category: 'directors'
    },
  ];
  
  const founders = teamMembers.filter(member => member.category === 'founders');
  const ceos = teamMembers.filter(member => member.category === 'ceos');
  const directors = teamMembers.filter(member => member.category === 'directors');
  
  const handleModeChange = (mode: string) => {
    setSelectedMode(mode);
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-dark">
      <div className="pt-6 pb-2 px-4 md:px-8">
        <Navbar selectedMode={selectedMode} onSelectMode={handleModeChange} navigate={navigate} activePage="about" />
      </div>
      
      <main className="flex-grow">
        <div className="content-container py-8 md:py-12">
          <h1 className="section-heading mb-8 md:mb-10">About MCBE TIERS</h1>
          
          <div className="max-w-4xl mx-auto bg-dark-surface/40 backdrop-blur-md rounded-xl p-6 md:p-8 border border-white/5 mb-12">
            <p className="text-white/80 leading-relaxed">
              MCBE TIERS is the premier ranking system for Minecraft Bedrock Edition players. We provide comprehensive rankings across various game modes, helping players understand where they stand in the competitive scene.
            </p>
            <p className="text-white/80 leading-relaxed mt-4">
              Our mission is to create a fair, transparent, and accurate ranking system that motivates players to improve their skills while fostering a competitive yet supportive community.
            </p>
          </div>
          
          <h2 className="text-xl md:text-2xl font-bold text-center text-white mb-8">Meet Our Team</h2>
          
          {/* Founders */}
          <div className="mb-12">
            <h3 className="text-lg font-medium text-white/90 mb-4 border-b border-white/10 pb-2">Founders</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {founders.map((member) => (
                <div 
                  key={member.name}
                  onClick={() => setSelectedMember(member)} 
                  className="bg-dark-surface/30 backdrop-blur-sm border border-white/5 rounded-lg p-4 flex flex-col items-center cursor-pointer hover:bg-dark-surface/50 transition-all duration-300"
                >
                  <Avatar className="h-16 w-16 border-2 border-white/10">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <h4 className="mt-3 font-medium text-white">{member.name}</h4>
                  <p className="text-white/60 text-sm">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* CEOs */}
          <div className="mb-12">
            <h3 className="text-lg font-medium text-white/90 mb-4 border-b border-white/10 pb-2">CEOs</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {ceos.map((member) => (
                <div 
                  key={member.name}
                  onClick={() => setSelectedMember(member)} 
                  className="bg-dark-surface/30 backdrop-blur-sm border border-white/5 rounded-lg p-4 flex flex-col items-center cursor-pointer hover:bg-dark-surface/50 transition-all duration-300"
                >
                  <Avatar className="h-16 w-16 border-2 border-white/10">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <h4 className="mt-3 font-medium text-white">{member.name}</h4>
                  <p className="text-white/60 text-sm">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Directors */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-white/90 mb-4 border-b border-white/10 pb-2">Directors</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {directors.map((member) => (
                <div 
                  key={member.name}
                  onClick={() => setSelectedMember(member)} 
                  className="bg-dark-surface/30 backdrop-blur-sm border border-white/5 rounded-lg p-4 flex flex-col items-center cursor-pointer hover:bg-dark-surface/50 transition-all duration-300"
                >
                  <Avatar className="h-14 w-14 border-2 border-white/10">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <h4 className="mt-2 font-medium text-white text-center">{member.name}</h4>
                  <p className="text-white/60 text-xs text-center">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Team Member Dialog */}
      {selectedMember && (
        <Dialog open={!!selectedMember} onOpenChange={(open) => !open && setSelectedMember(null)}>
          <DialogContent className="bg-[#0B0B0F] border-white/10">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">{selectedMember.name}</DialogTitle>
            </DialogHeader>
            
            <div className="flex flex-col items-center pt-2">
              <Avatar className="h-24 w-24 border-2 border-white/10">
                <AvatarImage src={selectedMember.avatar} alt={selectedMember.name} />
                <AvatarFallback>{selectedMember.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              
              <h2 className="text-xl font-bold mt-3">{selectedMember.name}</h2>
              <p className="text-white/60">{selectedMember.role}</p>
              
              <div className="mt-4 text-white/80 text-center">
                {selectedMember.bio}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default About;
