import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/clerk-react";
import { supabase } from "../lib/supabase";
import { Eye, EyeOff } from "lucide-react";

export function CreateCoursePage() {
    const navigate = useNavigate();
    const { user } = useUser();
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
    const [showPassword, setShowPassword] = useState(false);

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

        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };

            // Add authorization header if provided
            if (authorizationHeader.trim()) {
                headers['Authorization'] = "Bearer " + authorizationHeader.trim();
            }

            const response = await fetch(goals.trim(), {
                method: 'POST',
                headers,
                body: JSON.stringify({ message: testMessage || '' })
            });

            const data = await response.json();

            if (response.ok && data.status === 'success') {
                setGoalsStatus({ status: 'success', message: JSON.stringify(data, null, 2) });
            } else {
                setGoalsStatus({ status: 'error', message: JSON.stringify(data, null, 2) });
            }
        } catch (error) {
            setGoalsStatus({ status: 'error', message: 'Failed to connect to goals link. Please check the URL.' });
        }
    };

    const handleTestGoalsAPI = async () => {
        if (!goals.trim() || !testMessage.trim()) {
            setGoalsStatus({ status: 'error', message: 'Please enter both a goals URL and test message' });
            return;
        }

        setTestingGoals(true);
        try {
            const response = await fetch(goals.trim(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: testMessage })
            });

            const data = await response.json();

            if (response.ok && data.status === 'success') {
                setGoalsStatus({ status: 'success', message: data.message || 'Test message sent successfully!' });
            } else {
                setGoalsStatus({ status: 'error', message: data.message || 'Goals API returned an error' });
            }
        } catch (error) {
            setGoalsStatus({ status: 'error', message: 'Failed to connect to goals API. Please check the URL.' });
        } finally {
            setTestingGoals(false);
        }
    };

    const saveCourse = async () => {
        if (!user || !courseTitle.trim()) {
            alert('Please enter a course title');
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
                .insert([
                    {
                        title: courseTitle.trim(),
                        user_id: user.id,
                        sections: validSections,
                        goals: goals.trim() || null,
                        instructions: instructions.trim() || null,
                        authorization_header: authorizationHeader.trim() || 'VITE_SUPABASE_ANON_KEY'
                    }
                ])
                .select();

            if (error) {
                console.error('Error saving course:', error);
                alert('Failed to save course. Please try again.');
            } else {
                alert('Course saved successfully!');
                navigate('/course');
            }
        } catch (error) {
            console.error('Error saving course:', error);
            alert('Failed to save course. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <SignedIn>
                <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8 pt-20">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div className="bg-white/10 backdrop-blur-sm border-white/20 rounded-lg w-full max-w-2xl mx-auto p-8">
                            <h1 className="text-3xl font-bold text-white mb-8 text-center">Create Course</h1>

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
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeSection(index)}
                                                className="absolute top-2 right-2 text-red-400 hover:bg-red-400/10 hover:text-red-300"
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                                <Button onClick={addSection} className="mt-4 w-full bg-purple-600 hover:bg-purple-700">+ Add Section</Button>
                            </div>

                            <div className="mb-8">
                                <h2 className="text-xl font-semibold text-white mb-4">Goals (Optional)</h2>
                                <p className="text-gray-300 text-sm mb-4">
Connect your course to an external API endpoint (optional). If provided, students will need to send a message to this endpoint to complete the course. If left empty, students can proceed to the next course without this verification step.
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
                                            placeholder="Tell students what message they need to send to complete this course (e.g., 'Send your name to complete the course')"
                                            value={instructions}
                                            onChange={(e) => setInstructions(e.target.value)}
                                            className="bg-transparent text-white placeholder:text-gray-400"
                                            rows={3}
                                        />
                                        <p className="text-gray-400 text-xs mt-1">
                                            These instructions will be shown to students. When they send the correct message and your API returns success: true, the course will be marked as complete.
                                        </p>
                                    </div>

                                    <div className="mb-4">
                                        <Label htmlFor="authorizationHeader" className="text-white mb-2 block">Authorization Header (Optional)</Label>
                                        <div className="relative">
                                            <Input
                                                id="authorizationHeader"
                                                placeholder=""
                                                type={showPassword ? "text" : "password"}
                                                value={authorizationHeader}
                                                onChange={(e) => setAuthorizationHeader(e.target.value)}
                                                className="bg-transparent text-white placeholder:text-gray-400 pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                        <p className="text-gray-400 text-xs mt-1">
                                            Authorization header to use for goals API calls. we will save this on database to call your URL later.
                                        </p>
                                    </div>

                                    <div className="mb-4">
                                        <Label htmlFor="testMessage" className="text-white mb-2 block">Test Message</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="testMessage"
                                                placeholder="Enter test message to send to goals API"
                                                value={testMessage}
                                                onChange={(e) => setTestMessage(e.target.value)}
                                                className="bg-transparent text-white placeholder:text-gray-400 flex-1"
                                            />

                                        </div>
                                    </div>
                                    {goalsStatus.status && (
                                        <div className="mb-4">
                                            <div className={`px-3 py-2 rounded ${goalsStatus.status === 'success'
                                                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                                : 'bg-red-500/20 text-red-300 border border-red-500/30'
                                                }`}>
                                                <div className="font-semibold mb-2">Server Response:</div>
                                                <pre className="text-xs font-mono bg-black/20 p-2 rounded overflow-x-auto">
                                                    <code>{goalsStatus.message}</code>
                                                </pre>
                                            </div>
                                        </div>
                                    )}
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

                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mt-8">
                                <Button variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white" onClick={() => navigate('/course')}>← Back to Course</Button>
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
                                        onClick={saveCourse}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Saving...' : 'Save Course'}
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
                                                <div className="p-2 bg-white/5 rounded border border-white/10">
                                                    <code className="text-green-300">
                                                        {JSON.stringify({ message: "Student's input will be sent here" }, null, 2)}
                                                    </code>
                                                </div>
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

                                {!courseTitle && sections.filter(section => section.title.trim() || section.content.trim()).length === 0 && (
                                    <div className="text-center text-gray-400 py-8">
                                        <p>Start adding a course title and sections to see the preview</p>
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