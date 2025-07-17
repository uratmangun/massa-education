import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import { ArrowLeft } from "lucide-react";

export function Header() {
  const location = useLocation();
  const isCreateCoursePage = location.pathname === '/course/create';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4 bg-white/10 backdrop-blur-sm flex justify-between items-center">
      <div className="flex items-center gap-4">
        {isCreateCoursePage && (
          <Link to="/course" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
            <ArrowLeft size={16} />
            <span>Back to Course</span>
          </Link>
        )}
        <Link to="/" className="text-white font-bold text-xl">
          Massa Education
        </Link>
      </div>
      <div>
        <SignedOut>
          <SignInButton mode="modal">
            <Button variant="outline" className="mr-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">Sign In</Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">Sign Up</Button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </header>
  );
}