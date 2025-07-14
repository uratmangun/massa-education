import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StagewiseToolbar } from "@stagewise/toolbar-react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import "./index.css";

function CoursePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="w-full px-8 py-16">
        <div>
          {/* Header */}
          <div className="text-center mb-12">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="mb-6 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
            >
              ← Back to Home
            </Button>
            <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Massa Smart Contract Course
            </h1>
            <p className="text-xl text-gray-300">Master blockchain development with hands-on tutorials</p>
          </div>

          {/* Course Modules */}
          <div className="grid gap-6 mb-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    Introduction to Massa Blockchain
                  </span>
                  <span className="text-green-400 text-sm">✓ Completed</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">Learn the fundamentals of Massa blockchain and its unique features</p>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full w-full"></div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    Smart Contract Basics
                  </span>
                  <span className="text-blue-400 text-sm">📚 In Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">Understanding smart contracts, their structure and basic operations</p>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full w-3/4"></div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                    Building Your First Contract
                  </span>
                  <span className="text-gray-400 text-sm">🔒 Locked</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">Hands-on tutorial to create and deploy your first smart contract</p>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-gray-500 h-2 rounded-full w-0"></div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                    Advanced Contract Features
                  </span>
                  <span className="text-gray-400 text-sm">🔒 Locked</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">Explore advanced features like events, storage, and gas optimization</p>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-gray-500 h-2 rounded-full w-0"></div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Achievement Section */}
          <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border-purple-400/30">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">🎯 Course Progress</h3>
              <p className="text-gray-300 mb-6">Complete all modules to earn testnet tokens and certification</p>
              <div className="flex justify-center gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">1/4</div>
                  <div className="text-gray-300">Modules Complete</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-400">25%</div>
                  <div className="text-gray-300">Overall Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">🏆</div>
                  <div className="text-gray-300">Next Reward</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="w-full px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Massa Education
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Learn everything about massa smart contracts here and get massa testnet tokens
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/course">
              <Button 
                size="lg" 
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
              >
                Get Started
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-3"
              onClick={() => window.open('https://discord.com/channels/828270821042159636/1097797634065956915', '_blank')}
            >
              Get Testnet Tokens
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  📚
                </div>
                Learn Smart Contracts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Comprehensive tutorials and guides to help you master Massa smart contract development
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  🚀
                </div>
                Build & Deploy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Step-by-step instructions to build, test, and deploy your smart contracts on Massa
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  💰
                </div>
                Get Testnet Tokens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                get testnet token when you successfully complete the course
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border-purple-400/30">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Your Massa Journey?
            </h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Join thousands of developers building the future of decentralized applications on Massa blockchain
            </p>
            <Link to="/course">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3"
              >
                Start Learning Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <StagewiseToolbar config={{ plugins: [] }} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/course" element={<CoursePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
