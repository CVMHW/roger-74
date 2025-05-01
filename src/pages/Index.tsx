
import React from 'react';
import Header from '../components/Header';
import ChatInterface from '../components/ChatInterface';
import CrisisResources from '../components/CrisisResources';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-roger-dark mb-2">Welcome to Roger.AI</h2>
            <p className="text-gray-600">
              I'm Roger, your peer support companion at Cuyahoga Valley Mindful Health and Wellness. 
              I'm here to chat with you while you wait for your therapist. I'm not a licensed professional, 
              but I can provide a listening ear and supportive perspective.
            </p>
            <div className="flex items-center mt-4 p-3 bg-blue-50 rounded-md border border-blue-100">
              <div className="rounded-full bg-roger h-10 w-10 flex items-center justify-center mr-3">
                <span className="text-white font-bold">R</span>
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Remember:</span> Our conversation is meant to provide peer support only. 
                If you need immediate assistance, please use the crisis resources below.
              </p>
            </div>
          </div>
          
          <ChatInterface />
          
          <CrisisResources />
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-roger-dark mb-2">About Cuyahoga Valley Mindful Health and Wellness</h2>
            <p className="text-gray-600">
              We are dedicated to supporting your mental health journey through mindful, 
              evidence-based approaches. Our team of licensed professionals works 
              together to provide personalized care and guidance.
            </p>
            <p className="text-gray-600 mt-2">
              While Roger.AI is here to provide additional support, your relationship with 
              your therapist remains at the center of your care.
            </p>
          </div>
        </div>
      </main>
      
      <footer className="bg-white shadow-md mt-8">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-600 text-sm">
            <p>© {new Date().getFullYear()} Cuyahoga Valley Mindful Health and Wellness</p>
            <p className="mt-1">Roger.AI is a peer support companion and is not a substitute for professional mental health services.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
