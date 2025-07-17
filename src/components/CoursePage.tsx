import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Search, Trash2 } from "lucide-react";

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
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchCompletedCourses();
    }
  }, [user?.id]);

  // Search courses with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchCourses(searchQuery);
      } else {
        fetchCourses();
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: true });

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

  const searchCourses = async (query: string) => {
    setSearching(true);
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .or(`title.ilike.%${query}%,instructions.ilike.%${query}%`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error searching courses:', error);
      } else {
        // Also search in sections content
        const allCourses = data || [];
        const filteredByContent = allCourses.filter(course => {
          return course.sections.some((section: any) => 
            section.title.toLowerCase().includes(query.toLowerCase()) ||
            section.content.toLowerCase().includes(query.toLowerCase())
          );
        });
        
        // Combine results and remove duplicates
        const combinedResults = [...allCourses];
        filteredByContent.forEach(course => {
          if (!combinedResults.find(c => c.id === course.id)) {
            combinedResults.push(course);
          }
        });
        
        setCourses(combinedResults);
      }
    } catch (error) {
      console.error('Error searching courses:', error);
    } finally {
      setSearching(false);
    }
  };

  const deleteCourse = async (courseId: string, courseTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${courseTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId)
        .eq('user_id', user?.id); // Extra security check

      if (error) {
        console.error('Error deleting course:', error);
        alert('Failed to delete course. Please try again.');
      } else {
        // Refresh courses list
        if (searchQuery.trim()) {
          searchCourses(searchQuery);
        } else {
          fetchCourses();
        }
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course. Please try again.');
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

              {/* Search Input */}
              <div className="max-w-md mx-auto mb-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    type="text"
                    placeholder="Search courses by title, content, or goals..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400"
                  />
                </div>
              </div>

              {/* Courses */}
              <div className="grid gap-6 mb-8">
                {(loading || searching) ? (
                  <div className="text-center text-white py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
                    <p>{searching ? 'Searching courses...' : 'Loading courses...'}</p>
                  </div>
                ) : courses.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    {searchQuery ? (
                      <>
                        <p className="text-xl mb-4">No courses found</p>
                        <p>Try adjusting your search terms</p>
                      </>
                    ) : (
                      <>
                        <p className="text-xl mb-4">No courses available yet</p>
                        <p>Create your first course to get started!</p>
                      </>
                    )}
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
                              <>
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/course/edit/${course.id}`);
                                  }}
                                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 h-auto"
                                >
                                  ✏️ Edit
                                </Button>
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteCourse(course.id, course.title);
                                  }}
                                  className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 h-auto"
                                >
                                  <Trash2 size={12} />
                                </Button>
                              </>
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
                        <div className="mt-3 text-xs text-gray-500 flex items-center justify-between">
                          <span>Created {new Date(course.created_at).toLocaleDateString()}</span>
                          <span className="text-gray-400">
                            {course.user_id === user?.id ? (
                              <span className="text-blue-400 font-medium">Created by You</span>
                            ) : (
                              <span>Created by {course.user_id.slice(0, 8)}...</span>
                            )}
                          </span>
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
                      <div className="text-3xl font-bold text-purple-400">
                        {(() => {
                          // Filter out user's own courses for progress calculation
                          const otherCourses = courses.filter(course => course.user_id !== user?.id);
                          const completedOtherCourses = otherCourses.filter(course => completedCourses.has(course.id));
                          return `${completedOtherCourses.length}/${otherCourses.length}`;
                        })()}
                      </div>
                      <div className="text-gray-300">Modules Complete</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-pink-400">
                        {(() => {
                          // Filter out user's own courses for progress calculation
                          const otherCourses = courses.filter(course => course.user_id !== user?.id);
                          const completedOtherCourses = otherCourses.filter(course => completedCourses.has(course.id));
                          return otherCourses.length > 0 ? Math.round((completedOtherCourses.length / otherCourses.length) * 100) : 0;
                        })()}%
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