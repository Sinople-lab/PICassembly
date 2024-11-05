// Martin Carballo november 03 / 2024

import { useState } from 'react';
import { BookOpen, Monitor, RotateCw, ChevronRight, ChevronLeft } from 'lucide-react';
import Navbar from './components/Navbar';
import CodeBlock from './components/CodeBlock';
import { tutorials } from './data/tutorials';

function App() {
  const [currentTutorial, setCurrentTutorial] = useState(0);

  const nextTutorial = () => {
    setCurrentTutorial((prev) => Math.min(prev + 1, tutorials.length - 1));
  };

  const prevTutorial = () => {
    setCurrentTutorial((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Contents
              </h2>
              <ul className="space-y-2">
                {tutorials.map((tutorial, index) => (
                  <li key={index}>
                    <button
                      onClick={() => setCurrentTutorial(index)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                        currentTutorial === index
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {tutorial.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="prose max-w-none">
                <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
                  {tutorials[currentTutorial].icon}
                  {tutorials[currentTutorial].title}
                </h1>
                
                <div className="mb-8">
                  {tutorials[currentTutorial].description}
                </div>

                <div className="my-8">
                  <h3 className="text-xl font-semibold mb-4">Example Code:</h3>
                  <CodeBlock code={tutorials[currentTutorial].code} />
                </div>

                {tutorials[currentTutorial].explanation}
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <button
                  onClick={prevTutorial}
                  disabled={currentTutorial === 0}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                    currentTutorial === 0
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </button>
                <button
                  onClick={nextTutorial}
                  disabled={currentTutorial === tutorials.length - 1}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                    currentTutorial === tutorials.length - 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;