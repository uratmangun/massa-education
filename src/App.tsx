import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StagewiseToolbar } from "@stagewise/toolbar-react";
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import "./index.css";

function CourseContentPage() {
  const navigate = useNavigate();
  const { moduleId } = useParams();

  const mockLessons = {
    "1": {
      title: "Introduction to Massa Blockchain",
      lessons: [
        { id: 1, title: "What is Massa?", content: "Massa is a truly decentralized blockchain that solves the trilemma of scalability, security, and decentralization...", completed: true },
        { id: 2, title: "Key Features", content: "Learn about Massa's unique features like autonomous smart contracts, parallel execution, and proof-of-stake consensus...", completed: true },
        { id: 3, title: "Setting up Development Environment", content: "Install the necessary tools and configure your development environment for Massa development...", completed: false }
      ]
    },
    "2": {
      title: "Smart Contract Basics",
      lessons: [
        { id: 1, title: "Smart Contract Architecture", content: "Understanding the structure and components of Massa smart contracts...", completed: true },
        { id: 2, title: "AssemblyScript Basics", content: "Learn the fundamentals of AssemblyScript for writing Massa smart contracts...", completed: false },
        { id: 3, title: "Contract Deployment", content: "Step-by-step guide to deploying your first smart contract on Massa...", completed: false }
      ]
    }
  };

  const currentModule = mockLessons[moduleId as keyof typeof mockLessons];

  if (!currentModule) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Module Not Found</h1>
          <Button onClick={() => navigate('/course')} className="bg-purple-600 hover:bg-purple-700">
            Back to Course
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="w-full px-8 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="outline" 
              onClick={() => navigate('/course')}
              className="mb-6 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
            >
              ← Back to Course Overview
            </Button>
            <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Module {moduleId}: {currentModule.title}
            </h1>
          </div>

          {/* Progress Bar */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Module Progress</h3>
                <span className="text-purple-400 font-medium">
                  {currentModule.lessons.filter(l => l.completed).length}/{currentModule.lessons.length} Lessons
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(currentModule.lessons.filter(l => l.completed).length / currentModule.lessons.length) * 100}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>

          {/* Lessons List */}
          <div className="space-y-6">
            {currentModule.lessons.map((lesson, index) => (
              <Card key={lesson.id} className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        lesson.completed ? 'bg-green-500' : 'bg-gray-500'
                      }`}>
                        {index + 1}
                      </span>
                      {lesson.title}
                    </span>
                    <span className={`text-sm ${lesson.completed ? 'text-green-400' : 'text-gray-400'}`}>
                      {lesson.completed ? '✓ Completed' : '○ Not Started'}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">{lesson.content}</p>
                  <div className="flex gap-3">
                    <Button 
                      className={lesson.completed ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-600 hover:bg-purple-700'}
                      size="sm"
                    >
                      {lesson.completed ? 'Review Lesson' : 'Start Lesson'}
                    </Button>
                    {lesson.completed && (
                      <Button variant="outline" size="sm" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">
                        View Certificate
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Next Module Suggestion */}
          <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border-purple-400/30 mt-8">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold text-white mb-4">🎉 Great Progress!</h3>
              <p className="text-gray-300 mb-4">
                Complete all lessons in this module to unlock the next one and earn testnet tokens
              </p>
              <div className="flex justify-center gap-4">
                <Button 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  disabled={currentModule.lessons.some(l => !l.completed)}
                >
                  Continue to Next Module
                </Button>
                <Button variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">
                  Take Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function CoursePage() {
  const navigate = useNavigate();

  const modules = [
    { id: 1, title: "Introduction to Massa Blockchain", status: "completed", progress: 100 },
    { id: 2, title: "Smart Contract Basics", status: "in-progress", progress: 75 },
    { id: 3, title: "Building Your First Contract", status: "locked", progress: 0 },
    { id: 4, title: "Advanced Contract Features", status: "locked", progress: 0 }
  ];

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
            {modules.map((module) => (
              <Card key={module.id} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        module.status === 'completed' ? 'bg-green-500' : 
                        module.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-500'
                      }`}>
                        {module.id}
                      </span>
                      {module.title}
                    </span>
                    <span className={`text-sm ${
                      module.status === 'completed' ? 'text-green-400' : 
                      module.status === 'in-progress' ? 'text-blue-400' : 'text-gray-400'
                    }`}>
                      {module.status === 'completed' ? '✓ Completed' : 
                       module.status === 'in-progress' ? '📚 In Progress' : '🔒 Locked'}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    {module.id === 1 && "Learn the fundamentals of Massa blockchain and its unique features"}
                    {module.id === 2 && "Understanding smart contracts, their structure and basic operations"}
                    {module.id === 3 && "Hands-on tutorial to create and deploy your first smart contract"}
                    {module.id === 4 && "Explore advanced features like events, storage, and gas optimization"}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="w-full bg-gray-700 rounded-full h-2 mr-4">
                      <div 
                        className={`h-2 rounded-full ${
                          module.status === 'completed' ? 'bg-green-500' : 
                          module.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-500'
                        }`}
                        style={{ width: `${module.progress}%` }}
                      ></div>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => navigate(`/course/module/${module.id}`)}
                      disabled={module.status === 'locked'}
                      className={module.status === 'locked' ? 'opacity-50 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}
                    >
                      {module.status === 'completed' ? 'Review' : 
                       module.status === 'in-progress' ? 'Continue' : 'Locked'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-16">
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
        <Route path="/course/module/:moduleId" element={<CourseContentPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
