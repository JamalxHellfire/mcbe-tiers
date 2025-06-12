
import React from 'react';
import { useNews } from '@/hooks/useNews';
import { NewsArticleCard } from '@/components/NewsArticleCard';

export function News() {
  const { articles, loading, error } = useNews();

  // Mock news articles for display
  const mockArticles = [
    {
      id: '1',
      title: 'New Tier System Updates',
      content: 'We have implemented exciting new tier system updates that will enhance your gaming experience...',
      author: 'Admin Team',
      created_at: new Date().toISOString(),
      excerpt: 'Major updates to the tier ranking system',
      image_url: undefined
    },
    {
      id: '2', 
      title: 'Leaderboard Improvements',
      content: 'Our leaderboard system has been upgraded with better performance and new features...',
      author: 'Development Team',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      excerpt: 'Enhanced leaderboard functionality',
      image_url: undefined
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-primary flex items-center justify-center">
        <div className="text-white">Loading news...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-primary flex items-center justify-center">
        <div className="text-red-400">Error loading news: {error}</div>
      </div>
    );
  }

  const displayArticles = articles.length > 0 ? articles : mockArticles;

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-primary py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Latest News</h1>
        
        <div className="space-y-6">
          {displayArticles.map((article) => (
            <NewsArticleCard
              key={article.id}
              title={article.title}
              excerpt={article.excerpt || article.content.substring(0, 150) + '...'}
              author={article.author}
              publishedAt={article.created_at}
              imageUrl={article.image_url}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
