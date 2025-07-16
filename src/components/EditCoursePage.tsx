import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/clerk-react";
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

export function EditCoursePage() {
    const navigate = useNavigate();
    const { courseId } = useParams();
    const { user } = useUser();
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [courseTitle, setCourseTitle] = useState('');
    const [sections, setSections] = useState([{ title: '', content: '' }]);
    const [goals, setGoals] = useState('');
    const [authorizationHeader, setAuthorizationHeader] = useState('');
    const [instructions, setInstructions] = useState('');
    const [goalsStatus, setGoalsStatus] = useState<{ status: 'success' | 'error' | null; message: string }>({ status: null, message: '' });
    const [testMessage, setTestMessage] = useState('');
    const [testingGoals, setTestingGoals] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        if (courseId) {
            fetchCourse(courseId);
        }
    }, [courseId]);

    const fetchCourse = async (id: string) => {
        try {
            const { data, error } = await supabase
                .from('courses')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching course:', error);
                navigate('/course');
                return;
            }

            if (data) {
                setCourse(data);
                setCourseTitle(data.title);
                setSections(data.sections.length > 0 ? data.sections : [{ title: '', content: '' }]);
                setGoals(data.goals || '');
                setInstructions(data.instructions || '');
                setAuthorizationHeader(data.authorization_header || '');
            }
        } catch (error) {
            console.error('Error fetching course:', error);
            navigate('/course');
        } finally {
            setLoading(false);
        }
    };

    const addSection = () => {
        setSections([...sections, { title: '', content: '' }]);
    };

    const handleSectionChange = (index: number, field: string, value: string) => {
        const newSections = [...sections];
        newSections[index][field] = value;
        setSections(newSections);
    };

    const removeSection = (index: number) => {
        const newSections = sections.filter((_, i) => i !== index);
        setSections(newSections);
    };

    const testGoalsLink = async () => {
        if (!goals.trim()) {
            setGoalsStatus({ status: 'error', message: 'Please enter a goals URL first' });
            return;
        }

        setTestingGoals(true);
        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };

            // Add authorization header if provided
            if (authorizationHeader.trim()) {
                headers['Authorization'] = "Bearer " + authorizationHeader.trim();
            }

            // Use test message if provided, otherwise fall back to course title or default
            const messageToSend = testMessage.trim() || courseTitle || 'Test course goals';

            const response = await fetch(goals.trim(), {
                method: 'POST',
                headers,
                body: JSON.stringify({ message: messageToSend })
            });

            const data = await response.json();

            if (response.ok && data.status === 'success') {
                setGoalsStatus({ status: 'success', message: data.message || 'Goals link is working correctly!' });
            } else {
                setGoalsStatus({ status: 'error', message: data.message || 'Goals link returned an error' });
            }
        } catch (error) {
            setGoalsStatus({ status: 'error', message: 'Failed to connect to goals link. Please check the URL.' });
        } finally {
            setTestingGoals(false);
        }
    };

    const updateCourse = async () => {
        if (!user || !courseTitle.trim() || !course) {
            alert('Please enter a course title');
            return;
        }

        // Check if user is the owner
        if (user.id !== course.user_id) {
            alert('You are not authorized to edit this course');
            return;
        }

        // Filter out empty sections
        const validSections = sections.filter(section =>
            section.title.trim() || section.content.trim()
        );

        if (validSections.length === 0) {
            alert('Please add at least one section with content');
            return;
        }

        setIsLoading(true);
        try {
            const { error } = await supabase
                .from('courses')
                .update({
                    title: courseTitle.trim(),
                    sections: validSections,
                    goals: goals.trim() || null,
                    instructions: instructions.trim() || null,
                    authorization_header: authorizationHeader.trim() || null
                })
                .eq('id', course.id);

            if (error) {
                console.error('Error updating course:', error);
                alert('Failed to update course. Please try again.');
            } else {
                alert('Course updated successfully!');
                navigate(`/course/${course.id}`);
            }
        } catch (error) {
            console.error('Error updating course:', error);
            alert('Failed to update course. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const deleteCourse = async () => {
        if (!course || !user) return;

        if (user.id !== course.user_id) {
            alert('You are not authorized to delete this course');
            return;
        }

        if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
            return;
        }

        setIsLoading(true);
        try {
            const { error } = await supabase
                .from('courses')
                .delete()
                .eq('id', course.id);

            if (error) {
                console.error('Error deleting course:', error);
                alert('Failed to delete course. Please try again.');
            } else {
                alert('Course deleted successfully!');
                navigate('/course');
            }
        } catch (error) {
            console.error('Error deleting course:', error);
            alert('Failed to delete course. Please try again.');
        } finally {
            setIsLoading(false);
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
                        Back to Courses
                    </Button>
                </div>
            </div>
        );
    }

    // Check if user is authorized to edit
    if (user?.id !== course.user_id) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Unauthorized</h1>
                    <p className="text-white mb-8">You are not authorized to edit this course.</p>
                    <Button onClick={() => navigate('/course')} className="bg-purple-600 hover:bg-purple-700">
                        Back to Courses
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <>
            <SignedIn>
                <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8 pt-20">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div className="bg-white/10 backdrop-blur-sm border-white/20 rounded-lg w-full max-w-2xl mx-auto p-8">
                            <h1 className="text-3xl font-bold text-white mb-8 text-center">Edit Course</h1>

                            <div className="mb-8">
                                <Label htmlFor="courseTitle" className="text-white mb-2 block">Course Title</Label>
                                <Input
                                    id="courseTitle"
                                    placeholder="Enter course title"
                                    value={courseTitle}
                                    onChange={(e) => setCourseTitle(e.target.value)}
                                    className="bg-transparent text-white placeholder:text-gray-400"
                                />
                            </div>

                            <div className="mb-8">
                                <h2 className="text-xl font-semibold text-white mb-4">Sections</h2>
                                <div className="space-y-6">
                                    {sections.map((section, index) => (
                                        <div key={index} className="bg-white/5 p-4 rounded-lg relative">
                                            <div className="mb-4">
                                                <Label htmlFor={`sectionTitle-${index}`} className="text-white mb-2 block">Section Title</Label>
                                                <Input
                                                    id={`sectionTitle-${index}`}
                                                    placeholder="Enter section title"
                                                    value={section.title}
                                                    onChange={(e) => handleSectionChange(index, 'title', e.target.value)}
                                                    className="bg-transparent text-white placeholder:text-gray-400"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor={`sectionContent-${index}`} className="text-white mb-2 block">Content</Label>
                                                <Textarea
                                                    id={`sectionContent-${index}`}
                                                    placeholder="Enter section content (Markdown supported)"
                                                    value={section.content}
                                                    onChange={(e) => handleSectionChange(index, 'content', e.target.value)}
                                                    className="bg-transparent text-white placeholder:text-gray-400"
                                                />
                                            </div>
                                            {sections.length > 1 && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeSection(index)}
                                                    className="absolute top-2 right-2 text-red-400 hover:bg-red-400/10 hover:text-red-300"
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <Button onClick={addSection} className="mt-4 w-full bg-purple-600 hover:bg-purple-700">+ Add Section</Button>
                            </div>

                            <div className="mb-8">
                                <h2 className="text-xl font-semibold text-white mb-4">Goals (Optional)</h2>
                                <p className="text-gray-300 text-sm mb-4">
                                    Connect your course to an external API endpoint (optional). If provided, students will need to send a message to this endpoint to complete the course.
                                </p>
                                <div className="bg-white/5 p-4 rounded-lg">
                                    <div className="mb-4">
                                        <Label htmlFor="goals" className="text-white mb-2 block">Goals Web Link</Label>
                                        <Input
                                            id="goals"
                                            placeholder="https://your-goals-api.com/endpoint"
                                            value={goals}
                                            onChange={(e) => {
                                                setGoals(e.target.value);
                                                setGoalsStatus({ status: null, message: '' });
                                            }}
                                            className="bg-transparent text-white placeholder:text-gray-400"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <Label htmlFor="instructions" className="text-white mb-2 block">Instructions for Students</Label>
                                        <Textarea
                                            id="instructions"
                                            placeholder="Tell students what message they need to send to complete this course"
                                            value={instructions}
                                            onChange={(e) => setInstructions(e.target.value)}
                                            className="bg-transparent text-white placeholder:text-gray-400"
                                            rows={3}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <Label htmlFor="authorizationHeader" className="text-white mb-2 block">Authorization Header (Optional)</Label>
                                        <Input
                                            id="authorizationHeader"
                                            placeholder="Authorization token"
                                            value={authorizationHeader}
                                            onChange={(e) => setAuthorizationHeader(e.target.value)}
                                            className="bg-transparent text-white placeholder:text-gray-400"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <Label htmlFor="testMessage" className="text-white mb-2 block">Test Message</Label>
                                        <Input
                                            id="testMessage"
                                            placeholder="Enter message to test server response"
                                            value={testMessage}
                                            onChange={(e) => setTestMessage(e.target.value)}
                                            className="bg-transparent text-white placeholder:text-gray-400"
                                        />
                                    </div>

                                    <div className="flex gap-2 items-center">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={testGoalsLink}
                                            disabled={!goals.trim()}
                                            className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
                                        >
                                            Test Link
                                        </Button>
                                        {goalsStatus.status && (
                                            <div className={`text-sm px-3 py-1 rounded ${goalsStatus.status === 'success'
                                                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                                : 'bg-red-500/20 text-red-300 border border-red-500/30'
                                                }`}>
                                                {goalsStatus.message}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mt-8">
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                                        onClick={() => navigate(`/course/${course.id}`)}
                                    >
                                        ← Back to Course
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                                        onClick={deleteCourse}
                                        disabled={isLoading}
                                    >
                                        🗑️ Delete Course
                                    </Button>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
                                        onClick={() => setShowPreview(!showPreview)}
                                    >
                                        {showPreview ? 'Hide Preview' : 'Show Preview'}
                                    </Button>
                                    <Button
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        onClick={updateCourse}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Updating...' : 'Update Course'}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Course Preview */}
                        {showPreview && (
                            <div className="bg-white/10 backdrop-blur-sm border-white/20 rounded-lg w-full p-8">
                                <h2 className="text-2xl font-bold text-white mb-6 text-center">Course Preview</h2>

                                {courseTitle && (
                                    <div className="mb-8">
                                        <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent text-center mb-4">
                                            {courseTitle}
                                        </h1>
                                    </div>
                                )}

                                {goals.trim() && (
                                    <div className="mb-8">
                                        <div className="bg-white/5 backdrop-blur-sm border-white/20 rounded-lg p-4">
                                            <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                                                <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-sm">🎯</span>
                                                Goals Integration
                                            </h3>
                                            <div className="text-gray-300 text-sm space-y-3">
                                                {instructions.trim() && (
                                                    <div>
                                                        <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
                                                            <div className="text-yellow-300 font-medium mb-1">Student Instructions:</div>
                                                            <div className="text-gray-200">{instructions}</div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {sections.filter(section => section.title.trim() || section.content.trim()).length > 0 && (
                                    <div className="space-y-6">
                                        {sections
                                            .filter(section => section.title.trim() || section.content.trim())
                                            .map((section, index) => (
                                                <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20">
                                                    <CardHeader>
                                                        <CardTitle className="text-white flex items-center gap-3">
                                                            <span className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm font-bold">
                                                                {index + 1}
                                                            </span>
                                                            {section.title || `Section ${index + 1}`}
                                                        </CardTitle>
                                                    </CardHeader>
                                                    {section.content && (
                                                        <CardContent>
                                                            <div className="text-gray-300 leading-relaxed prose prose-invert max-w-none">
                                                                <ReactMarkdown>{section.content}</ReactMarkdown>
                                                            </div>
                                                        </CardContent>
                                                    )}
                                                </Card>
                                            ))}
                                    </div>
                                )}
                            </div>
                        )}
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