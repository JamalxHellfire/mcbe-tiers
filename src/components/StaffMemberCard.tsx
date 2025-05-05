
import React, { useState } from 'react';
import { Staff } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Copy, ExternalLink } from 'lucide-react';

interface StaffMemberCardProps {
  member: Staff;
}

export const StaffMemberCard = ({ member }: StaffMemberCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const copyDiscord = () => {
    if (member.discord) {
      navigator.clipboard.writeText(member.discord);
      toast.success(`Copied ${member.discord} to clipboard!`);
    }
  };
  
  return (
    <motion.div
      className="bg-dark-surface/30 backdrop-blur-sm border border-white/5 rounded-lg p-5 flex flex-col items-center relative overflow-hidden group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Avatar className="h-24 w-24 border-2 border-white/10 mb-4 group-hover:border-white/30 transition-all duration-300">
        <AvatarImage 
          src={member.avatar_url || 'https://crafthead.net/avatar/MHF_Steve'} 
          alt={member.name} 
        />
        <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
      </Avatar>
      
      <h3 className="text-lg font-bold text-white">{member.name}</h3>
      <p className="text-sm text-white/60 mt-1">{member.role}</p>
      
      {member.bio && (
        <p className="text-sm text-white/70 text-center mt-3 line-clamp-2">
          {member.bio}
        </p>
      )}
      
      {member.discord && (
        <motion.div 
          className="mt-4 w-full"
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: isHovered ? 1 : 0, 
            height: isHovered ? 'auto' : 0 
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col space-y-2">
            <p className="text-xs text-white/40 text-center">Socials</p>
            <div className="flex justify-center">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs flex items-center bg-dark-surface/50 hover:bg-dark-surface/70" 
                onClick={copyDiscord}
              >
                <Copy size={14} className="mr-1" />
                {member.discord}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
      
      <motion.div 
        className="absolute inset-0 bg-gradient-to-t from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};
