
import React, { useState, useEffect } from 'react';
import { fetchNewsPosts } from '@/api/supabase';
import { NewsPost } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Search, Edit, Trash, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

export const NewsManagement = () => {
  const [news, setNews] = useState<NewsPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const newsData = await fetchNewsPosts();
        setNews(newsData);
      } catch (error) {
        console.error('Error loading news data:', error);
        toast.error('Failed to load news data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
    
    // Subscribe to realtime changes
    const newsSubscription = supabase
      .channel('news-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'news_posts' 
      }, () => {
        loadData();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(newsSubscription);
    };
  }, []);
  
  const filteredNews = searchQuery 
    ? news.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      )
    : news;
  
  const handleAdd = () => {
    // In a real implementation, this would open a modal for adding
    toast.info("Adding new news post");
  };
  
  const handleEdit = (post: NewsPost) => {
    // In a real implementation, this would open a modal for editing
    toast.info(`Editing ${post.title}`);
  };
  
  const handleDelete = async (post: NewsPost) => {
    if (window.confirm(`Are you sure you want to delete the post: ${post.title}?`)) {
      try {
        await supabase
          .from('news_posts')
          .delete()
          .eq('id', post.id);
          
        toast.success(`Deleted post: ${post.title}`);
        
        // Filter out the deleted news post
        setNews(news.filter(n => n.id !== post.id));
      } catch (error) {
        console.error('Error deleting news post:', error);
        toast.error('Failed to delete news post');
      }
    }
  };
  
  const newsVariants = {
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
        <h2 className="text-xl font-semibold text-white">News Management</h2>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search news..."
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
            <div key={i} className="space-y-2">
              <Skeleton className="h-6 w-[300px]" />
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-dark-surface/40">
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-white/60">
                    No news posts found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredNews.map((post, i) => (
                  <motion.tr 
                    key={post.id}
                    custom={i}
                    variants={newsVariants}
                    initial="hidden"
                    animate="visible"
                    className="border-b border-white/5 hover:bg-white/5"
                  >
                    <TableCell className="font-semibold">
                      <div>
                        <div>{post.title}</div>
                        <div className="text-xs text-white/60 truncate max-w-md">
                          {post.content.slice(0, 100)}...
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(post.created_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {post.tags && post.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="bg-blue-900/20 text-blue-300 border-blue-500/30">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0" 
                          onClick={() => handleEdit(post)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-400 hover:bg-red-500/10" 
                          onClick={() => handleDelete(post)}
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
