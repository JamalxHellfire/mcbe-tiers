import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NewsPost } from '@/types';
import { fetchNewsPosts, fetchNewsByTag } from '@/api/supabase';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const News = () => {
  const [selectedMode, setSelectedMode] = useState('overall');
  const [newsPosts, setNewsPosts] = useState<NewsPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<NewsPost | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadNews = async () => {
      try {
        setIsLoading(true);
        
        // If a tag is selected, filter by that tag
        const posts = selectedTag 
          ? await fetchNewsByTag(selectedTag)
          : await fetchNewsPosts();
          
        setNewsPosts(posts);
      } catch (error) {
        console.error('Error fetching news:', error);
        toast.error('Failed to load news');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadNews();
    
    // Subscribe to realtime changes
    const newsSubscription = supabase
      .channel('news-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'news_posts' 
      }, () => {
        loadNews();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(newsSubscription);
    };
  }, [selectedTag]);
  
  const handleModeChange = (mode: string) => {
    setSelectedMode(mode);
    navigate('/');
  };
  
  const handlePostClick = (post: NewsPost) => {
    setSelectedPost(post);
  };
  
  // Collect all unique tags
  const allTags = newsPosts.reduce<string[]>((tags, post) => {
    if (post.tags) {
      post.tags.forEach(tag => {
        if (!tags.includes(tag)) {
          tags.push(tag);
        }
      });
    }
    return tags;
  }, []);
  
  const handleTagClick = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null); // Clear filter if clicking the same tag
    } else {
      setSelectedTag(tag);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-dark">
      <div className="pt-4 px-4 md:px-8">
        <Navbar selectedMode={selectedMode} onSelectMode={handleModeChange} navigate={navigate} activePage="news" />
      </div>
      
      <main className="flex-grow">
        <div className="content-container py-8 md:py-12">
          <motion.h1 
            className="section-heading mb-6 md:mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            News & Updates
          </motion.h1>
          
          {/* Tags filter */}
          {allTags.length > 0 && (
            <motion.div 
              className="mb-6 flex flex-wrap gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="text-white/60 text-sm">Filter by:</span>
              {allTags.map(tag => (
                <Badge 
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"} 
                  className={cn(
                    "cursor-pointer",
                    selectedTag === tag 
                      ? "bg-blue-600 hover:bg-blue-700" 
                      : "bg-dark-surface/40 hover:bg-dark-surface/60 text-white/80"
                  )}
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </Badge>
              ))}
              {selectedTag && (
                <Badge 
                  variant="outline" 
                  className="cursor-pointer bg-red-900/20 text-red-400 hover:bg-red-900/30"
                  onClick={() => setSelectedTag(null)}
                >
                  Clear filter <X size={14} className="ml-1" />
                </Badge>
              )}
            </motion.div>
          )}
          
          <div className="max-w-4xl mx-auto">
            {isLoading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="p-4 bg-dark-surface/40 backdrop-blur-md border border-white/5">
                    <div className="space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : newsPosts.length === 0 ? (
              <Card className="glass p-6 animate-fade-in border border-white/10 bg-dark-surface/40 backdrop-blur-md">
                <h2 className="text-xl font-bold text-white mb-2">No News Available</h2>
                <p className="text-white/70">
                  {selectedTag 
                    ? `No news posts found with the tag "${selectedTag}".` 
                    : "There are currently no news posts. Check back later for announcements, updates, and event information!"}
                </p>
              </Card>
            ) : (
              <motion.div 
                className="grid gap-6"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.1 } }
                }}
              >
                {newsPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    onClick={() => handlePostClick(post)}
                    className="cursor-pointer"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="p-6 bg-dark-surface/40 backdrop-blur-md border border-white/5 hover:border-white/20 transition-all duration-300">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start flex-wrap gap-2">
                          <h2 className="text-xl font-bold text-white">{post.title}</h2>
                          <span className="text-white/50 text-sm">
                            {format(new Date(post.created_at), 'MMM d, yyyy')}
                          </span>
                        </div>
                        
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag, i) => (
                              <Badge key={i} variant="outline" className="bg-blue-900/20 text-blue-300 border-blue-500/30">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        <p className="text-white/70 line-clamp-3">
                          {post.content}
                        </p>
                        
                        <p className="text-blue-400 text-sm">Read more</p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* News Post Dialog */}
      <Dialog open={!!selectedPost} onOpenChange={(open) => !open && setSelectedPost(null)}>
        <DialogContent className="bg-dark-surface/90 backdrop-blur-md border-white/10 max-w-2xl">
          {selectedPost && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">{selectedPost.title}</h2>
                <div className="flex justify-between items-center">
                  <div className="flex flex-wrap gap-2">
                    {selectedPost.tags && selectedPost.tags.map((tag, i) => (
                      <Badge key={i} variant="outline" className="bg-blue-900/20 text-blue-300 border-blue-500/30">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <span className="text-white/50 text-sm">
                    {format(new Date(selectedPost.created_at), 'MMMM d, yyyy')}
                  </span>
                </div>
              </div>
              
              {selectedPost.image_url && (
                <div className="w-full">
                  <img 
                    src={selectedPost.image_url} 
                    alt={selectedPost.title}
                    className="w-full h-48 md:h-64 object-cover rounded-md" 
                  />
                </div>
              )}
              
              <div className="text-white/80 leading-relaxed whitespace-pre-wrap">
                {selectedPost.content}
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default News;
