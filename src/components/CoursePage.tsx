import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

interface Course {
  id: string;
  title: string;
  sections: Array<{ title: string; content: string }>;
  goals: string | null;
  instructions: string | null;
  created_at: string;
  user_id: string;
}

export function CoursePage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedCourses, setCompletedCourses] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchCompletedCourses();
    }
  }, [user?.id]);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching courses:', error);
      } else {
        setCourses(data || []);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompletedCourses = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('user_course_completions')
        .select('course_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching completed courses:', error);
      } else {
        const completedIds = new Set(data?.map(item => item.course_id) || []);
        setCompletedCourses(completedIds);
      }
    } catch (error) {
      console.error('Error fetching completed courses:', error);
    }
  };

  return (
    <>
      <SignedIn>
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pt-20">
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
                    onClick={() => navigate('/course/create')}
                  >
                    + Add Course
                  </Button>
                </div>
              </div>

              {/* Courses */}
              <div className="grid gap-6 mb-8">
                {loading ? (
                  <div className="text-center text-white py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
                    <p>Loading courses...</p>
                  </div>
                ) : courses.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    <p className="text-xl mb-4">No courses available yet</p>
                    <p>Create your first course to get started!</p>
                  </div>
                ) : (
                  courses.map((course, index) => (
                    <Card
                      key={course.id}
                      className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all cursor-pointer"
                      onClick={() => navigate(`/course/${course.id}`)}
                    >
                      <CardHeader>
                        <CardTitle className="text-white flex items-center justify-between">
                          <span className="flex items-center gap-3">
                            <span className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </span>
                            {course.title}
                          </span>
                          <div className="flex items-center gap-2">
                            {course.goals && (
                              <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                                🎯 Interactive
                              </span>
                            )}
                            <span className="text-sm text-gray-400">
                              {completedCourses.has(course.id) ? (
                                <span className="text-green-400 font-semibold flex items-center gap-1">
                                  ✓ Completed
                                </span>
                              ) : (
                                `${course.sections.length} section${course.sections.length !== 1 ? 's' : ''}`
                              )}
                            </span>
                            {user?.id === course.user_id && (
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/course/edit/${course.id}`);
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 h-auto"
                              >
                                ✏️ Edit
                              </Button>
                            )}
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-gray-300 mb-3">
                          {course.sections.length > 0 ? (
                            <p>{course.sections[0].content.substring(0, 150)}...</p>
                          ) : (
                            <p>No content available</p>
                          )}
                        </div>
                        {course.instructions && (
                          <div className="mt-3 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded">
                            <p className="text-yellow-300 text-sm">
                              <strong>Goal:</strong> {course.instructions}
                            </p>
                          </div>
                        )}
                        <div className="mt-3 text-xs text-gray-500">
                          Created {new Date(course.created_at).toLocaleDateString()}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              {/* Achievement Section */}
              <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border-purple-400/30">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-white mb-4">🎯 Course Progress</h3>
                  <div className="flex justify-center gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-400">{completedCourses.size}/{courses.length}</div>
                      <div className="text-gray-300">Modules Complete</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-pink-400">
                        {courses.length > 0 ? Math.round((completedCourses.size / courses.length) * 100) : 0}%
                      </div>
                      <div className="text-gray-300">Overall Progress</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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