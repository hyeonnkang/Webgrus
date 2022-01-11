import React, { Suspense } from 'react';
import { Route, Switch } from "react-router-dom";
import Auth from "../hoc/auth";
// pages for this product
import LandingPage from "./views/LandingPage/LandingPage.js";
import LoginPage from "./views/LoginPage/LoginPage.js";
import RegisterPage from "./views/RegisterPage/RegisterPage.js";
import NavBar from "./views/NavBar/NavBar";
import Footers from "./views/Footer/Footer"
import LectureUploadPage from "./views/LectureUploadPage/LectureUploadPage.js";
import LecturePage from "./views/LecturePage/LecturePage.js";
import LectureDetailPage from "./views/LectureDetailPage/LectureDetailPage.js";
import LectureEditPage from "./views/LectureEditPage/LectureEditPage";

//null   Anyone Can go inside
//true   only logged in user can go inside
//false  logged in user can't go inside

function App() {
  return (
    <div  id="grid_Main2">
      <Suspense fallback={(<div>Loading...</div>)} id="grid_Main1">
        <NavBar />
        <div>
          <Switch>
            <Route exact path="/" component={Auth(LandingPage, null)} />
            <Route exact path="/login" component={Auth(LoginPage, false)} />
            <Route exact path="/register" component={Auth(RegisterPage, false)} />
            <Route exact path="/lectures" component={Auth(LecturePage, true)} />
            <Route exact path="/lectures/register" component={Auth(LectureUploadPage, true)} />
            <Route exact path="/lectures/:lectureId" component={Auth(LectureDetailPage, true)} />
            <Route exact path="/lectures/:lectureId/edit" component={Auth(LectureEditPage, true)} />
          </Switch>
          <Footers />
        </div>
      </Suspense>
    </div>
  );
}

export default App;
