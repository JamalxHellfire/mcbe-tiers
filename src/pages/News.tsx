
import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { useNews } from '@/hooks/useNews';
import { NewsArticleCard } from '@/components/NewsArticleCard';
import { motion } from 'framer-motion';

const News = () => {
  const navigate = useNavigate();
  const { articles, loading, error } = useNews();

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-dark">
        <Navbar 
          selectedMode="overall" 
          onSelectMode={() => {}} 
          navigate={navigate} 
        />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-white">Loading news...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-dark">
        <Navbar 
          selectedMode="overall" 
          onSelectMode={() => {}} 
          navigate={navigate} 
        />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-red-500">Error loading news: {error}</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-dark">
      <Navbar 
        selectedMode="overall" 
        onSelectMode={() => {}} 
        navigate={navigate} 
      />
      
      <main className="flex-grow">
        <div className="content-container py-6">
          <motion.h1 
            className="section-heading mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Latest News
          </motion.h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <NewsArticleCard
                  headline={article.title}
                  summary={article.description || article.content.substring(0, 150) + '...'}
                  byline={article.author}
                  publishDate={new Date(article.published_at).toLocaleDateString()}
                  category={article.category}
                />
              </motion.div>
            ))}
          </div>
          
          {articles.length === 0 && (
            <div className="text-center text-gray-400 py-12">
              No news articles found.
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default News;
