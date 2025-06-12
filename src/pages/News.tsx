
import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { NewsArticleCard } from '../components/NewsArticleCard';
import { useNews } from '../hooks/useNews';

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  author: string;
  created_at: string;
  updated_at: string;
}

const News = () => {
  const { articles, loading, error } = useNews();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-dark">
      <Navbar />
      
      <main className="flex-grow">
        <div className="content-container py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Latest News</h1>
            <p className="text-slate-400 text-lg">Stay updated with the latest announcements and updates</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="text-white">Loading news...</div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-8">
              Error loading news: {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article: NewsArticle) => (
                <NewsArticleCard 
                  key={article.id}
                  title={article.title}
                  content={article.content}
                  author={article.author}
                  createdAt={article.created_at}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default News;
