
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
import { getAvatarUrl, handleAvatarError } from '@/utils/avatarUtils';

interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  bio: string;
  category: 'founders' | 'ceos' | 'directors' | 'admins' | 'testers';
}

const About = () => {
  const [selectedMode, setSelectedMode] = useState('overall');
  const navigate = useNavigate();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  
  const teamMembers: TeamMember[] = [
    // Founders
    { 
      name: 'Mian Muhammad Jamal Hussain', 
      role: 'Founder', 
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
    
    // Admins
    { 
      name: 'Frost', 
      role: 'Admin', 
      avatar: 'https://crafthead.net/avatar/MHF_Steve10',
      bio: 'Handles day-to-day moderation and player ranking decisions.',
      category: 'admins'
    },
    { 
      name: 'Nova', 
      role: 'Moderator', 
      avatar: 'https://crafthead.net/avatar/MHF_Steve11',
      bio: 'Enforces community guidelines and resolves disputes.',
      category: 'admins'
    },
    
    // Testers
    { 
      name: 'Zenith', 
      role: 'Verified Tester', 
      avatar: 'https://crafthead.net/avatar/MHF_Steve12',
      bio: 'Conducts official player testing and skill verification.',
      category: 'testers'
    },
    { 
      name: 'Eclipse', 
      role: 'Jr. Tester', 
      avatar: 'https://crafthead.net/avatar/MHF_Steve13',
      bio: 'Assists with preliminary player evaluations and testing.',
      category: 'testers'
    },
  ];
  
  const founders = teamMembers.filter(member => member.category === 'founders');
  const ceos = teamMembers.filter(member => member.category === 'ceos');
  const directors = teamMembers.filter(member => member.category === 'directors');
  const admins = teamMembers.filter(member => member.category === 'admins');
  const testers = teamMembers.filter(member => member.category === 'testers');
  
  const handleModeChange = (mode: string) => {
    setSelectedMode(mode);
    navigate('/');
  };

  const faqItems = [
    {
      question: "What is MCBE TIERS?",
      answer: "A competitive ranking system for Minecraft Bedrock Edition players across SMP, Mace, and Bedwars."
    },
    {
      question: "How are tiers assigned?",
      answer: "Through staff reviews, verified tests, and player performance tracking."
    },
    {
      question: "What gets you banned?",
      answer: "Cheating, banned emotes, impersonation, doxxing, lying to staff, false news, hate speech, and religious phobia."
    },
    {
      question: "Can I re-test for a higher tier?",
      answer: "Yes, re-tests are offered through official staff and can help you move up."
    },
    {
      question: "What if I'm unranked?",
      answer: "You remain in the database but will not appear in public rankings until tested or assigned."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-dark">
      <div className="pt-6 pb-2 px-4 md:px-8">
        <Navbar selectedMode={selectedMode} onSelectMode={handleModeChange} navigate={navigate} activePage="about" />
      </div>
      
      <main className="flex-grow">
        <div className="content-container py-8 md:py-12">
          <h1 className="section-heading mb-8 md:mb-10">About MCBE TIERS</h1>
          
          {/* Section 1: What is MCBE TIERS? */}
          <div className="max-w-4xl mx-auto bg-dark-surface/40 backdrop-blur-md rounded-xl p-6 md:p-8 border border-white/5 mb-12">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">What is MCBE TIERS?</h2>
            <p className="text-white/80 leading-relaxed">
              MCBE TIERS is the official skill-based ranking system for Minecraft Bedrock Edition combat players. It supports competitive gamemodes such as SMP, Mace, and Bedwars. This system recognizes the best players through structured tier assignments and strict moderation to ensure competitive fairness.
            </p>
          </div>
          
          {/* Section 2: Our Purpose */}
          <div className="max-w-4xl mx-auto bg-dark-surface/40 backdrop-blur-md rounded-xl p-6 md:p-8 border border-white/5 mb-12">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Our Purpose</h2>
            <p className="text-white/80 leading-relaxed">
              Our mission is to provide a credible, fair, and secure platform that accurately represents player skill across the Minecraft Bedrock competitive scene. We ensure transparency and uphold high standards of integrity through consistent moderation and thorough testing.
            </p>
          </div>
          
          {/* Section 3: Rules of the Tier List */}
          <div className="max-w-4xl mx-auto bg-dark-surface/40 backdrop-blur-md rounded-xl p-6 md:p-8 border border-white/5 mb-12">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Tier List Rules & Ban Reasons</h2>
            <ul className="list-disc pl-6 text-white/80 space-y-2">
              <li>The tier list is <span className="font-bold">strictly for Minecraft Bedrock Edition</span> only.</li>
              <li><span className="font-bold">Banned emotes</span>, cheat clients, autoclickers, or exploit abuse is <span className="font-bold">not tolerated</span>.</li>
              <li><span className="font-bold">DDoSing, doxxing, impersonation</span>, or involvement in <span className="font-bold">false propaganda or fake news</span> will result in immediate bans.</li>
              <li><span className="font-bold">Lying to staff</span>, spreading misinformation, or attempting to deceive officials will lead to permanent disqualification.</li>
              <li><span className="font-bold">Religious extremism</span>, hate speech, or displaying <span className="font-bold">phobia against religions</span> such as <span className="font-bold">Islam</span>, <span className="font-bold">Christianity</span>, or <span className="font-bold">Judaism</span> is grounds for a <span className="font-bold">permanent ban</span>.</li>
              <li><span className="font-bold">Toxicity</span>, disrespect toward other players or staff, and repeated violations of decorum will result in tier penalties or full bans.</li>
              <li>All users must respect the <span className="font-bold">integrity</span> of the system; anyone attempting to <span className="font-bold">manipulate rankings or create confusion</span> may be removed from the platform.</li>
            </ul>
          </div>
          
          {/* Section 4: Staff Team */}
          <div className="max-w-4xl mx-auto bg-dark-surface/40 backdrop-blur-md rounded-xl p-6 md:p-8 border border-white/5 mb-12">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6 text-center">Our Team</h2>
            
            {/* Founders */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-white/90 mb-4 border-b border-white/10 pb-2">Founders</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {founders.map((member) => (
                  <div 
                    key={member.name}
                    onClick={() => setSelectedMember(member)} 
                    className="bg-dark-surface/30 backdrop-blur-sm border border-white/5 rounded-lg p-4 flex flex-col items-center cursor-pointer hover:bg-dark-surface/50 transition-all duration-300"
                  >
                    <Avatar className="h-16 w-16 border-2 border-white/10">
                      <AvatarImage 
                        src={getAvatarUrl(member.avatar)} 
                        alt={member.name} 
                        onError={handleAvatarError} 
                      />
                      <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <h4 className="mt-3 font-medium text-white">{member.name}</h4>
                    <p className="text-white/60 text-sm">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* CEOs */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-white/90 mb-4 border-b border-white/10 pb-2">CEOs</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {ceos.map((member) => (
                  <div 
                    key={member.name}
                    onClick={() => setSelectedMember(member)} 
                    className="bg-dark-surface/30 backdrop-blur-sm border border-white/5 rounded-lg p-4 flex flex-col items-center cursor-pointer hover:bg-dark-surface/50 transition-all duration-300"
                  >
                    <Avatar className="h-16 w-16 border-2 border-white/10">
                      <AvatarImage 
                        src={getAvatarUrl(member.avatar)} 
                        alt={member.name} 
                        onError={handleAvatarError} 
                      />
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
                      <AvatarImage 
                        src={getAvatarUrl(member.avatar)} 
                        alt={member.name} 
                        onError={handleAvatarError}
                      />
                      <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <h4 className="mt-2 font-medium text-white text-center">{member.name}</h4>
                    <p className="text-white/60 text-xs text-center">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Admins */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-white/90 mb-4 border-b border-white/10 pb-2">Admins & Moderators</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {admins.map((member) => (
                  <div 
                    key={member.name}
                    onClick={() => setSelectedMember(member)} 
                    className="bg-dark-surface/30 backdrop-blur-sm border border-white/5 rounded-lg p-4 flex flex-col items-center cursor-pointer hover:bg-dark-surface/50 transition-all duration-300"
                  >
                    <Avatar className="h-14 w-14 border-2 border-white/10">
                      <AvatarImage 
                        src={getAvatarUrl(member.avatar)} 
                        alt={member.name} 
                        onError={handleAvatarError}
                      />
                      <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <h4 className="mt-2 font-medium text-white text-center">{member.name}</h4>
                    <p className="text-white/60 text-xs text-center">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Testers */}
            <div className="mb-4">
              <h3 className="text-lg font-medium text-white/90 mb-4 border-b border-white/10 pb-2">Verified Testers</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {testers.map((member) => (
                  <div 
                    key={member.name}
                    onClick={() => setSelectedMember(member)} 
                    className="bg-dark-surface/30 backdrop-blur-sm border border-white/5 rounded-lg p-4 flex flex-col items-center cursor-pointer hover:bg-dark-surface/50 transition-all duration-300"
                  >
                    <Avatar className="h-14 w-14 border-2 border-white/10">
                      <AvatarImage 
                        src={getAvatarUrl(member.avatar)} 
                        alt={member.name} 
                        onError={handleAvatarError}
                      />
                      <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <h4 className="mt-2 font-medium text-white text-center">{member.name}</h4>
                    <p className="text-white/60 text-xs text-center">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Section 5: FAQ */}
          <div className="max-w-4xl mx-auto bg-dark-surface/40 backdrop-blur-md rounded-xl p-6 md:p-8 border border-white/5 mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              {faqItems.map((item, index) => (
                <div key={index} className="border-b border-white/10 pb-4 last:border-b-0 last:pb-0">
                  <h3 className="text-lg font-medium text-white mb-2">{item.question}</h3>
                  <p className="text-white/70">{item.answer}</p>
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
                <AvatarImage 
                  src={getAvatarUrl(selectedMember.avatar)} 
                  alt={selectedMember.name}
                  onError={handleAvatarError}
                />
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
