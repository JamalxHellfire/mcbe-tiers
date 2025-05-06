import React, { useState, useEffect } from 'react';
import { fetchStaff } from '@/api/supabase';
import { Staff } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Search, Edit, Trash, Plus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';

export const StaffManagement = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const staffData = await fetchStaff();
        setStaff(staffData);
      } catch (error) {
        console.error('Error loading staff data:', error);
        toast.error('Failed to load staff data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
    
    // Subscribe to realtime changes
    const staffSubscription = supabase
      .channel('staff-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'staff' 
      }, () => {
        loadData();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(staffSubscription);
    };
  }, []);
  
  const filteredStaff = searchQuery 
    ? staff.filter(member => 
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : staff;
  
  const handleAdd = () => {
    // In a real implementation, this would open a modal for adding
    toast.info("Adding new staff member");
  };
  
  const handleEdit = (member: Staff) => {
    // In a real implementation, this would open a modal for editing
    toast.info(`Editing ${member.name}`);
  };
  
  const handleDelete = async (member: Staff) => {
    if (window.confirm(`Are you sure you want to remove ${member.name} from staff?`)) {
      try {
        await supabase
          .from("staff" as any)
          .delete()
          .eq('id', member.id);
          
        toast.success(`Removed ${member.name} from staff`);
        
        // Filter out the deleted staff member
        setStaff(staff.filter(s => s.id !== member.id));
      } catch (error) {
        console.error('Error deleting staff member:', error);
        toast.error('Failed to delete staff member');
      }
    }
  };
  
  const staffVariants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: {
        delay: i * 0.05,
      },
    }),
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Staff Management</h2>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-dark-surface/60 border-white/10"
            />
          </div>
          
          <Button 
            onClick={handleAdd}
            variant="default"
            className="flex items-center"
          >
            <Plus size={16} className="mr-1" />
            Add
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-dark-surface/40">
                <TableHead className="w-12"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Discord</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-white/60">
                    No staff members found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredStaff.map((member, i) => (
                  <motion.tr 
                    key={member.id}
                    custom={i}
                    variants={staffVariants}
                    initial="hidden"
                    animate="visible"
                    className="border-b border-white/5 hover:bg-white/5"
                  >
                    <TableCell>
                      <Avatar>
                        <AvatarImage 
                          src={member.avatar_url || 'https://crafthead.net/avatar/MHF_Steve'} 
                          alt={member.name} 
                        />
                        <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {member.name}
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 text-xs rounded bg-purple-900/30 text-purple-300">
                        {member.role}
                      </span>
                    </TableCell>
                    <TableCell>{member.discord || "N/A"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0" 
                          onClick={() => handleEdit(member)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-400 hover:bg-red-500/10" 
                          onClick={() => handleDelete(member)}
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
