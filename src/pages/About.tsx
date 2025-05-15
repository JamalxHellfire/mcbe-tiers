
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GithubIcon, InstagramIcon, LinkedinIcon, TwitterIcon } from 'lucide-react';
import { motion } from 'framer-motion';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const About = () => {
  // Create empty props for Navbar to satisfy TypeScript
  const navbarProps = {
    selectedMode: '',
    onSelectMode: () => {},
    navigate: () => {}
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navbar {...navbarProps} />
      
      <motion.div 
        className="container mx-auto py-12 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mb-10">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">About MCBE Tiers</CardTitle>
            <CardDescription className="text-center text-lg">
              A platform for recognizing top players in the Minecraft Bedrock Edition community
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Our Mission</h2>
              <p className="text-muted-foreground">
                MCBE Tiers aims to create a standardized ranking system for competitive Minecraft Bedrock Edition players across various game modes. By establishing clear tiers and recognition, we hope to foster growth in the competitive scene and highlight talented players who might otherwise go unnoticed.
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">How It Works</h2>
              <p className="text-muted-foreground">
                Players are evaluated based on their skills in specific game modes and placed into appropriate tiers ranging from Tier 5 (beginner competitive) to Tier 1 (professional level). Evaluations are conducted by experienced players and community leaders to ensure fair and accurate placements.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Tier Evaluation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Players are evaluated based on mechanical skill, game sense, tournament performance, and consistency. Each game mode has specific criteria tailored to its unique mechanics and meta.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Community Input</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      We regularly seek input from the community and other tier-ranked players to ensure our evaluations remain accurate and fair. The tier system evolves with the game and competitive scene.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Our Team</h2>
              <p className="text-muted-foreground">
                This project is being developed by Azreal Jamal — a solo developer, researcher, and young entrepreneur.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Contact & Support</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Have questions or want to get involved with MCBE Tiers? Reach out to us through any of our social media channels or via email.
            </p>
            <div className="flex space-x-4 justify-center">
              <TwitterIcon className="h-6 w-6 text-muted-foreground hover:text-primary cursor-pointer" />
              <InstagramIcon className="h-6 w-6 text-muted-foreground hover:text-primary cursor-pointer" />
              <GithubIcon className="h-6 w-6 text-muted-foreground hover:text-primary cursor-pointer" />
              <LinkedinIcon className="h-6 w-6 text-muted-foreground hover:text-primary cursor-pointer" />
            </div>
          </CardContent>
          <CardFooter className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} MCBE Tiers. All rights reserved.
          </CardFooter>
        </Card>
      </motion.div>
      
      <Footer />
    </div>
  );
};

export default About;
