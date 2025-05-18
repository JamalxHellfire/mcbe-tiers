
import { useState } from 'react';
import { useQuery, RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { NewsArticle } from '@/integrations/supabase/client';

export function useNews() {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  // Fetch news articles from Supabase
  const { data: newsArticles = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          throw new Error(error.message);
        }
        
        return data as NewsArticle[];
      } catch (err: any) {
        console.error('Error fetching news:', err);
        throw new Error(err.message || 'Failed to load news');
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Function to open a specific article
  const openArticle = (article: NewsArticle) => {
    setSelectedArticle(article);
  };
  
  // Function to close the selected article
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
