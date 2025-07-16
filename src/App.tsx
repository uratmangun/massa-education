import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { HomePage } from "./components/HomePage";
import { CoursePage } from "./components/CoursePage";
import { CreateCoursePage } from "./components/CreateCoursePage";
import { CourseContentPage } from "./components/CourseContentPage";
import "./index.css";

export function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/course" element={<CoursePage />} />
        <Route path="/course/create" element={<CreateCoursePage />} />
        <Route path="/course/:moduleId" element={<CourseContentPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;