
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { NewsArticleCard } from '@/components/NewsArticleCard';
import { GameMode } from '@/services/playerService';

const News = () => {
  const dummyNavProps = {
    selectedMode: 'Crystal' as GameMode,
    onSelectMode: () => {},
    navigate: () => {}
  };

  const newsArticles = [
    {
      id: '1',
      title: 'New Tournament Announced',
      description: 'Exciting tournament coming soon...',
      author: 'Admin',
      published_at: '2024-01-15',
      content: 'Full article content here...'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar {...dummyNavProps} />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Latest News</h1>
        
        <div className="grid gap-6">
          {newsArticles.map((article) => (
            <NewsArticleCard
              key={article.id}
              title={article.title}
              description={article.description}
              author={article.author}
              publishedAt={article.published_at}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default News;
