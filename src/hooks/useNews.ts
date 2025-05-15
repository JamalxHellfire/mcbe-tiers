
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Export the NewsArticle type properly
export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  author: string;
  created_at: string;
  updated_at?: string | null;
}

export function useNews() {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  
  const {
    data: newsArticles = [],
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .order('created_at', { ascending: false }) as any;
          
        if (error) throw error;
        return data as NewsArticle[] || [];
      } catch (err: any) {
        console.error('Error fetching news:', err);
        throw new Error(err.message || 'Failed to load news');
      }
    },
    staleTime: 60000, // 1 minute
  });
  
  const openArticle = (article: NewsArticle) => {
    setSelectedArticle(article);
  };
  
  const closeArticle = () => {
    setSelectedArticle(null);
  };
  
  return {
    newsArticles,
    loading,
    error: error ? (error as Error).message : null,
    selectedArticle,
    openArticle,
    closeArticle,
    refetch
  };
}
