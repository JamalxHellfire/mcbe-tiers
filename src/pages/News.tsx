
import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { NewsArticleCard } from '../components/NewsArticleCard';
import { useNews } from '../hooks/useNews';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const News = () => {
  const navigate = useNavigate();
  const { articles, loading, error } = useNews();

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
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="text-white">Loading news...</div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-8">
              Error: {error}
            </div>
          ) : (
            <motion.div 
              className="grid gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {articles.map((article) => (
                <NewsArticleCard
                  key={article.id}
                  title={article.title}
                  content={article.content}
                  author={article.author}
                  category={article.category}
                  published_at={article.published_at}
                />
              ))}
            </motion.div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default News;
