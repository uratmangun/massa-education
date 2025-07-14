import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StagewiseToolbar } from "@stagewise/toolbar-react";
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import "./index.css";

function CourseContentPage() {
  const navigate = useNavigate();
  const { moduleId } = useParams();

  const mockCourses = {
    "1": {
      title: "Introduction to Massa Blockchain",
      duration: "45 min read",
      content: {
        introduction: "Welcome to the Massa blockchain course! In this comprehensive tutorial, you'll learn everything you need to know about Massa, a revolutionary blockchain platform that achieves true decentralization.",
        sections: [
          {
            title: "What is Massa?",
            content: "Massa is a truly decentralized blockchain that solves the blockchain trilemma by achieving scalability, security, and decentralization simultaneously. Unlike other blockchains, Massa uses a unique block-DAG architecture that allows for parallel block production."
          },
          {
            title: "Key Features",
            content: "Massa introduces several groundbreaking features:\n\n• **Autonomous Smart Contracts**: Self-executing contracts that can wake up and execute periodically\n• **Parallel Execution**: Multiple blocks can be produced simultaneously\n• **True Decentralization**: No delegation, every token holder can participate\n• **High Throughput**: Capable of processing thousands of transactions per second"
          },
          {
            title: "Architecture Overview",
            content: "Massa uses a block-DAG (Directed Acyclic Graph) structure instead of a linear blockchain. This allows for:\n\n1. **Parallel Block Production**: Multiple blocks can be created simultaneously\n2. **Better Finality**: Faster transaction confirmations\n3. **Increased Throughput**: Higher transaction processing capacity"
          }
        ],
        codeExample: {
          title: "Setting Up Massa Node",
          code: `// Install Massa node
curl -sSfL 'https://github.com/massalabs/massa/releases/download/MAIN.2.1/massa_MAIN.2.1_release_linux.tar.gz' | tar -xzv

// Start the node
cd massa/massa-node/
./massa-node

// Check node status
./massa-client get_status`
        },
        quiz: [
          { question: "What makes Massa different from other blockchains?", answer: "Block-DAG architecture enabling parallel execution" },
          { question: "What are Autonomous Smart Contracts?", answer: "Self-executing contracts that can wake up periodically" }
        ]
      }
    },
    "2": {
      title: "Smart Contract Basics",
      duration: "60 min read",
      content: {
        introduction: "Learn the fundamentals of writing smart contracts on Massa using AssemblyScript. This tutorial covers everything from basic syntax to deployment strategies.",
        sections: [
          {
            title: "Smart Contract Architecture",
            content: "Massa smart contracts are written in AssemblyScript and compiled to WebAssembly. They consist of:\n\n• **Entry Points**: Functions that can be called externally\n• **State Management**: Persistent storage for contract data\n• **Event Emission**: Communication with external systems"
          },
          {
            title: "AssemblyScript Basics",
            content: "AssemblyScript is a TypeScript-like language that compiles to WebAssembly. Key concepts:\n\n• **Strongly Typed**: All variables must have explicit types\n• **Memory Management**: Manual memory allocation and deallocation\n• **No Dynamic Features**: No eval, reflection, or dynamic typing"
          }
        ],
        codeExample: {
          title: "Hello World Contract",
          code: `import { generateEvent } from '@massalabs/massa-as-sdk';

export function main(): void {
  generateEvent("Hello, Massa!");
}

export function greet(name: string): string {
  return "Hello, " + name + "!";
}`
        },
        quiz: [
          { question: "What language are Massa smart contracts written in?", answer: "AssemblyScript" },
          { question: "What do smart contracts compile to?", answer: "WebAssembly" }
        ]
      }
    }
  };

  const currentCourse = mockCourses[moduleId as keyof typeof mockCourses];

  if (!currentCourse) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Course Not Found</h1>
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
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {currentCourse.title}
              </h1>
              <span className="text-purple-400 font-medium">{currentCourse.duration}</span>
            </div>
          </div>

          {/* Introduction */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Course Overview</h2>
              <div className="text-gray-300 leading-relaxed prose prose-invert max-w-none">
                <ReactMarkdown>{currentCourse.content.introduction}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>

          {/* Course Sections */}
          <div className="space-y-8">
            {currentCourse.content.sections.map((section, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <span className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-300 leading-relaxed prose prose-invert max-w-none">
                    <ReactMarkdown>{section.content}</ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Code Example */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <span className="text-2xl">💻</span>
                  {currentCourse.content.codeExample.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{currentCourse.content.codeExample.code}</code>
                </pre>
              </CardContent>
            </Card>

            {/* Quiz Section */}
            <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border-purple-400/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <span className="text-2xl">🧠</span>
                  Knowledge Check
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentCourse.content.quiz.map((item, index) => (
                    <div key={index} className="border-l-4 border-purple-400 pl-4">
                      <p className="text-white font-medium mb-2">Q{index + 1}: {item.question}</p>
                      <p className="text-gray-300">A: {item.answer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Course Completion */}
          <Card className="bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-sm border-green-400/30 mt-8">
            <CardContent className="p-6 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">🎯 Course Complete!</h3>
              <p className="text-gray-300 mb-6">
                Congratulations! You've completed this course. Continue to the next module to keep learning.
              </p>
              <div className="flex justify-center gap-4">
                <Button 
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                  onClick={() => navigate('/course')}
                >
                  Back to Course Overview
                </Button>
                <Button variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">
                  Download Certificate
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
            <div className="text-center">
              <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Massa Smart Contract Course
              </h1>
              <p className="text-xl text-gray-300 mb-6">Master blockchain development with hands-on tutorials</p>
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => {/* Add course functionality */}}
              >
                + Add Course
              </Button>
            </div>
          </div>

          {/* Course Modules */}
          <div className="grid gap-6 mb-8">
            {modules.map((module) => (
              <Card 
                key={module.id} 
                className={`bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all ${
                  module.status === 'locked' ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
                }`}
                onClick={() => module.status !== 'locked' && navigate(`/course/module/${module.id}`)}
              >
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
                  <p className="text-gray-300">
                    {module.id === 1 && "Learn the fundamentals of Massa blockchain and its unique features"}
                    {module.id === 2 && "Understanding smart contracts, their structure and basic operations"}
                    {module.id === 3 && "Hands-on tutorial to create and deploy your first smart contract"}
                    {module.id === 4 && "Explore advanced features like events, storage, and gas optimization"}
                  </p>
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
            Learn everything about massa smart contracts here
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
