
import { useState } from 'react';
import { useQuery, RefetchOptions } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { NewsArticle } from '@/integrations/supabase/client';

export interface NewsArticleWithRequiredId extends NewsArticle {
  id: string; // Making id required
  created_at: string; // Ensuring created_at is required
}

export function useNews() {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticleWithRequiredId | null>(null);
  
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
          .order('created_at', { ascending: false });
          
        if (error) {
          throw new Error(error.message);
        }
        
        // Ensure all articles have an id
        return data.map(article => ({
          ...article,
          id: article.id || `news-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
        })) as NewsArticleWithRequiredId[];
      } catch (err) {
        console.error('Error fetching news:', err);
        throw err;
      }
    },
    staleTime: 60000 // 1 minute
  });
  
  const openArticle = (article: NewsArticleWithRequiredId) => {
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
