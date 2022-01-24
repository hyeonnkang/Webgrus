import React, { Suspense } from 'react';
import { Route, Routes } from "react-router-dom";
import Auth from "../hoc/auth";
// pages for this product
import LandingPage from "./views/LandingPage/LandingPage.js";
import LoginPage from "./views/LoginPage/LoginPage.js";
import RegisterPage from "./views/RegisterPage/RegisterPage.js";
import NavBar from "./views/NavBar/NavBar";
import LecturePage from "./views/Lectures/LecturePage/LecturePage.js";
import LectureUploadPage from "./views/Lectures/LectureUploadPage/LectureUploadPage.js";
import LectureDetailPage from "./views/Lectures/LectureDetailPage/LectureDetailPage.js";
import LectureEditPage from "./views/Lectures/LectureEditPage/LectureEditPage";
import StudyGroupUploadPage from "./views/StudyGroups/StudyGroupUploadPage/StudyGroupUploadPage.js";
import StudyGroupPage from "./views/StudyGroups/StudyGroupPage/StudyGroupPage.js";
import StudyGroupDetailPage from "./views/StudyGroups/StudyGroupDetailPage/StudyGroupDetailPage.js";
import StudyGroupEditPage from "./views/StudyGroups/StudyGroupEditPage/StudyGroupEditPage";

//null   Anyone Can go inside
//true   only logged in user can go inside
//false  logged in user can't go inside

function App() {
  return (
    <div  id="grid_Main2">
      <Suspense fallback={(<div>Loading...</div>)} id="grid_Main1">
        <NavBar />
        <div>
          <Routes>
            <Route path="/" element={Auth(LandingPage, null)} />
            <Route path="/login" element={Auth(LoginPage, false)} />
            <Route path="/register" element={Auth(RegisterPage, false)} />
            <Route path="/lectures" element={Auth(LecturePage, true)} />
            <Route path="/lectures/register" element={Auth(LectureUploadPage, true)} />
            <Route path="/lectures/:lectureId" element={Auth(LectureDetailPage, true)} />
            <Route path="/lectures/:lectureId/edit" element={Auth(LectureEditPage, true)} />
            <Route path="/studygroups" element={Auth(StudyGroupPage, true)} />
            <Route path="/studygroups/register" element={Auth(StudyGroupUploadPage, true)} />
            <Route path="/studygroups/:studygroupId" element={Auth(StudyGroupDetailPage, true)} />
            <Route path="/studygroups/:studygroupId/edit" element={Auth(StudyGroupEditPage, true)} />
          </Routes>
        </div>
      </Suspense>
    </div>
  );
}

export default App;
