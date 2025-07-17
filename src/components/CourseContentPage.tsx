import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

interface Course {
  id: string;
  title: string;
  sections: Array<{ title: string; content: string }>;
  goals: string | null;
  instructions: string | null;
  authorization_header: string | null;
  created_at: string;
  user_id: string;
}

export function CourseContentPage() {
  const navigate = useNavigate();
  const { moduleId } = useParams();
  const { user } = useUser();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [userMessage, setUserMessage] = useState('');
  const [goalStatus, setGoalStatus] = useState<{ status: 'success' | 'error' | null; message: string }>({ status: null, message: '' });
  const [submittingGoal, setSubmittingGoal] = useState(false);
  const [courseCompleted, setCourseCompleted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completingCourse, setCompletingCourse] = useState(false);

  useEffect(() => {
    if (moduleId) {
      fetchCourse(moduleId);
    }
  }, [moduleId]);

  useEffect(() => {
    if (moduleId && user?.id) {
      checkCourseCompletion(moduleId, user.id);
    }
  }, [moduleId, user?.id]);

  const fetchCourse = async (courseId: string) => {
    console.log('Fetching course with ID:', courseId);
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      console.log('Course data:', data);
      console.log('Course error:', error);

      if (error) {
        console.error('Error fetching course:', error);
      } else {
        setCourse(data);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkCourseCompletion = async (courseId: string, userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_course_completions')
        .select('*')
        .eq('course_id', courseId)
        .eq('user_id', userId)
        .single();

      if (data && !error) {
        setIsCompleted(true);
      }
    } catch (error) {
      // No completion record found, which is fine
      console.log('No completion record found');
    }
  };

  const handleCourseCompletion = async () => {
    if (!moduleId || !user?.id) {
      return;
    }

    setCompletingCourse(true);
    try {
      const { error } = await supabase
        .from('user_course_completions')
        .insert({
          user_id: user.id,
          course_id: moduleId
        });

      if (error) {
        console.error('Error marking course as completed:', error);
        alert('Failed to mark course as completed. Please try again.');
      } else {
        setIsCompleted(true);
        alert('Congratulations! Course marked as completed!');
      }
    } catch (error) {
      console.error('Error marking course as completed:', error);
      alert('Failed to mark course as completed. Please try again.');
    } finally {
      setCompletingCourse(false);
    }
  };

  const handleStartOver = async () => {
    if (!moduleId || !user?.id) {
      return;
    }

    const confirmReset = window.confirm('Are you sure you want to start over? This will remove your completion status for this course.');
    if (!confirmReset) {
      return;
    }

    setCompletingCourse(true);
    try {
      const { error } = await supabase
        .from('user_course_completions')
        .delete()
        .eq('user_id', user.id)
        .eq('course_id', moduleId);

      if (error) {
        console.error('Error resetting course completion:', error);
        alert('Failed to reset course completion. Please try again.');
      } else {
        setIsCompleted(false);
        setCourseCompleted(false);
        setGoalStatus({ status: null, message: '' });
        alert('Course completion status has been reset. You can now complete it again!');
      }
    } catch (error) {
      console.error('Error resetting course completion:', error);
      alert('Failed to reset course completion. Please try again.');
    } finally {
      setCompletingCourse(false);
    }
  };

  const handleGoalSubmission = async () => {
    if (!course?.goals || !userMessage.trim()) {
      setGoalStatus({ status: 'error', message: 'Please enter a message' });
      return;
    }

    setSubmittingGoal(true);
    try {
      // Get the Supabase anon key from environment
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321';
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseKey) {
        throw new Error('Supabase key not found');
      }

      // Call the new course-message-handler Supabase function
      const response = await fetch(`${supabaseUrl}/functions/v1/course-message-handler`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({ 
          message: userMessage.trim(),
          courseId: moduleId
        })
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        // Check if the goals endpoint returned a success status
        const goalsResponse = data.data;
        if (goalsResponse && goalsResponse.status === 'success') {
          setGoalStatus({ status: 'success', message: goalsResponse.message || 'Congratulations! You completed the course!' });
          setCourseCompleted(true);
          // Also mark course as completed in database
          if (moduleId && user?.id) {
            try {
              const { error: completionError } = await supabase
                .from('user_course_completions')
                .insert({
                  user_id: user.id,
                  course_id: moduleId
                });
              
              if (!completionError) {
                setIsCompleted(true);
              }
            } catch (error) {
              console.error('Error marking course as completed:', error);
            }
          }
        } else {
          setGoalStatus({ status: 'error', message: goalsResponse?.message || 'Incorrect answer. Please try again.' });
        }
      } else {
        setGoalStatus({ status: 'error', message: data.message || 'Failed to submit. Please try again.' });
      }
    } catch (error) {
      console.error('Error submitting goal:', error);
      setGoalStatus({ status: 'error', message: 'Failed to submit. Please check your connection and try again.' });
    } finally {
      setSubmittingGoal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p>Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
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
    <>
      <SignedIn>
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pt-20">
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
                  <div>
                    <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      {course.title}
                    </h1>
                    <div className="mt-2 text-sm text-gray-400">
                      {course.user_id === user?.id ? (
                        <span className="text-blue-400 font-medium">Created by You</span>
                      ) : (
                        <span>Created by {course.user_id.slice(0, 8)}...</span>
                      )}
                      <span className="mx-2">•</span>
                      <span>Created {new Date(course.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-purple-400 font-medium">
                      {isCompleted ? (
                        <span className="text-green-400 font-semibold flex items-center gap-1">
                          ✓ Completed
                        </span>
                      ) : (
                        `${course.sections.length} section${course.sections.length !== 1 ? 's' : ''}`
                      )}
                    </span>
                    {user?.id === course.user_id && (
                      <Button
                        onClick={() => navigate(`/course/edit/${course.id}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        ✏️ Edit Course
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Course Sections */}
              <div className="space-y-8">
                {course.sections.map((section, index) => (
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

                {/* Goals Section - Interactive Quiz/Completion - Only show to non-owners */}
                {course.goals && course.instructions && !courseCompleted && user?.id !== course.user_id && (
                  <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border-blue-400/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <span className="text-2xl">🎯</span>
                        Complete the Course
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded">
                          <p className="text-yellow-300 font-medium mb-2">Instructions:</p>
                          <p className="text-gray-200">{course.instructions}</p>
                        </div>
                        
                        <div className="flex gap-2">
                          <Input
                            placeholder="Enter your answer here..."
                            value={userMessage}
                            onChange={(e) => setUserMessage(e.target.value)}
                            className="bg-transparent text-white placeholder:text-gray-400 flex-1"
                            onKeyPress={(e) => e.key === 'Enter' && handleGoalSubmission()}
                          />
                          <Button
                            onClick={handleGoalSubmission}
                            disabled={submittingGoal || !userMessage.trim()}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            {submittingGoal ? 'Submitting...' : 'Submit'}
                          </Button>
                        </div>

                        {goalStatus.status && (
                          <div className={`p-3 rounded border ${
                            goalStatus.status === 'success'
                              ? 'bg-green-500/20 text-green-300 border-green-500/30'
                              : 'bg-red-500/20 text-red-300 border-red-500/30'
                          }`}>
                            {goalStatus.message}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Course Completion Success */}
                {courseCompleted && (
                  <Card className="bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-sm border-green-400/30">
                    <CardContent className="p-6 text-center">
                      <h3 className="text-2xl font-bold text-white mb-4">🎉 Course Complete!</h3>
                      <p className="text-gray-300 mb-6">
                        {goalStatus.message || 'Congratulations! You have successfully completed this course.'}
                      </p>
                      <div className="flex justify-center gap-4">
                        <Button
                          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                          onClick={() => navigate('/course')}
                        >
                          Back to Course Overview
                        </Button>
                        <Button variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">
                          View More Courses
                        </Button>
                        <Button 
                          variant="outline" 
                          className="border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white"
                          onClick={handleStartOver}
                          disabled={completingCourse}
                        >
                          {completingCourse ? 'Resetting...' : '🔄 Start Over Again'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Course Completion Button (for courses without goals) */}
                {!course.goals && !isCompleted && (
                  <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border-blue-400/30">
                    <CardContent className="p-6 text-center">
                      <h3 className="text-xl font-bold text-white mb-4">Ready to Complete?</h3>
                      <p className="text-gray-300 mb-6">
                        Mark this course as completed to track your progress.
                      </p>
                      <Button
                        onClick={handleCourseCompletion}
                        disabled={completingCourse}
                        className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold px-8 py-3"
                      >
                        {completingCourse ? 'Completing...' : '✓ Mark as Complete'}
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Static Course Completion (for courses without goals) */}
                {!course.goals && isCompleted && (
                  <Card className="bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-sm border-green-400/30">
                    <CardContent className="p-6 text-center">
                      <h3 className="text-2xl font-bold text-white mb-4">🎉 Course Completed!</h3>
                      <p className="text-gray-300 mb-6">
                        You've successfully completed this course. Great job!
                      </p>
                      <div className="flex justify-center gap-4">
                        <Button
                          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                          onClick={() => navigate('/course')}
                        >
                          Back to Course Overview
                        </Button>
                        <Button variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">
                          View More Courses
                        </Button>
                        <Button 
                          variant="outline" 
                          className="border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white"
                          onClick={handleStartOver}
                          disabled={completingCourse}
                        >
                          {completingCourse ? 'Resetting...' : '🔄 Start Over Again'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pt-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Please Sign In</h1>
            <p className="text-white mb-8">You must be signed in to view this page.</p>
            <SignInButton mode="modal">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">Sign In</Button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>
    </>
  );
}