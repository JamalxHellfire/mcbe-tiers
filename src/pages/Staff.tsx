import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Staff as StaffType } from '@/types';
import { fetchStaff } from '@/api/supabase';
import { StaffMemberCard } from '@/components/StaffMemberCard';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const Staff = () => {
  const [selectedMode, setSelectedMode] = useState('overall');
  const navigate = useNavigate();
  const [staffMembers, setStaffMembers] = useState<StaffType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadStaff = async () => {
      try {
        setIsLoading(true);
        const staffData = await fetchStaff();
        setStaffMembers(staffData);
      } catch (error) {
        console.error('Error fetching staff:', error);
        toast.error('Failed to load staff information');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStaff();
  }, []);
  
  const handleModeChange = (mode: string) => {
    setSelectedMode(mode);
  };

  // Group staff by role
  const founders = staffMembers.filter(member => member.role.toLowerCase().includes('founder'));
  const ceos = staffMembers.filter(member => member.role.toLowerCase().includes('ceo'));
  const directors = staffMembers.filter(member => 
    member.role.toLowerCase().includes('director') || 
    member.role.toLowerCase().includes('manager')
  );
  const other = staffMembers.filter(member => 
    !member.role.toLowerCase().includes('founder') && 
    !member.role.toLowerCase().includes('ceo') &&
    !member.role.toLowerCase().includes('director') && 
    !member.role.toLowerCase().includes('manager')
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
      }
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-dark">
      <Navbar 
        selectedMode={selectedMode} 
        onSelectMode={handleModeChange} 
        navigate={navigate} 
        activePage="staff" 
      />
      
      <main className="flex-grow">
        <div className="content-container py-8 md:py-12">
          <motion.h1 
            className="section-heading mb-8 md:mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Our Team
          </motion.h1>
          
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-dark-surface/30 rounded-lg p-4">
                  <Skeleton className="w-20 h-20 mx-auto rounded-full" />
                  <Skeleton className="h-4 w-2/3 mx-auto mt-4" />
                  <Skeleton className="h-3 w-1/2 mx-auto mt-2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-10">
              {/* Founders */}
              {founders.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-6 border-b border-white/10 pb-2">
                    Founders
                  </h2>
                  <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {founders.map((member) => (
                      <StaffMemberCard key={member.id} member={member} />
                    ))}
                  </motion.div>
                </div>
              )}
              
              {/* CEOs */}
              {ceos.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-6 border-b border-white/10 pb-2">
                    Leadership
                  </h2>
                  <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {ceos.map((member) => (
                      <StaffMemberCard key={member.id} member={member} />
                    ))}
                  </motion.div>
                </div>
              )}
              
              {/* Directors */}
              {directors.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-6 border-b border-white/10 pb-2">
                    Directors & Managers
                  </h2>
                  <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {directors.map((member) => (
                      <StaffMemberCard key={member.id} member={member} />
                    ))}
                  </motion.div>
                </div>
              )}
              
              {/* Other Staff */}
              {other.length > 0 && (
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-6 border-b border-white/10 pb-2">
                    Staff Team
                  </h2>
                  <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {other.map((member) => (
                      <StaffMemberCard key={member.id} member={member} />
                    ))}
                  </motion.div>
                </div>
              )}
              
              {staffMembers.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-white/60">No staff members found.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Staff;
