import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import "./App.css";

import Home from "./pages/Home";
import CoursesIndex from "./pages/courses/Index";
import CoursesEdit from "./pages/courses/Edit";
import CoursesShow from "./pages/courses/Show";
import CoursesCreate from "./pages/courses/Create";

import LecturerIndex from "./pages/lecturers/Index";
import LecturerEdit from "./pages/lecturers/Edit";
import LecturerShow from "./pages/lecturers/Show";
import LecturerCreate from "./pages/lecturers/Create";

import EnrolmentIndex from "./pages/enrolments/Index";
import EnrolmentEdit from "./pages/enrolments/Edit";
import EnrolmentShow from "./pages/enrolments/Show";
import EnrolmentCreate from "./pages/enrolments/Create";

import PageNotFound from "./pages/PageNotFound";
import RegisterForm from "./components/RegisterForm";
import Navbar from "./components/Navbar";
import Drawer from "./components/Drawer";

function App() {
	const { authenticated, onAuthenticated } = useAuth();
	let protectedRoutes;

	useEffect(() => {
		if (localStorage.getItem("token")) {
			onAuthenticated(true);
		}
	}, []);

	if (authenticated) {
		protectedRoutes = (
			<>
				<Route path="/courses/create" element={<CoursesCreate />} />
				<Route path="/courses/:id/edit" element={<CoursesEdit />} />
				<Route path="/courses/:id" element={<CoursesShow />} />

				<Route path="/lecturers/" element={<LecturerIndex />} />
				<Route path="/lecturer/create" element={<LecturerCreate />} />
				<Route path="/lecturer/:id/edit" element={<LecturerEdit />} />
				<Route path="/lecturer/:id" element={<LecturerShow />} />

				<Route path="/enrolments/" element={<EnrolmentIndex />} />
				<Route path="/enrolment/create" element={<EnrolmentCreate />} />
				<Route path="/enrolment/:id/edit" element={<EnrolmentEdit />} />
				<Route path="/enrolment/:id" element={<EnrolmentShow />} />
			</>
		);
	}
	return (
		<Router>
			<Navbar />
			<Routes>
				<Route path="register" element={<RegisterForm />} />
				<Route path="/" element={<Drawer />}>
					<Route path="courses" element={<CoursesIndex />} />
					<Route index element={<Home />} />
					{protectedRoutes}
					<Route path="*" element={<PageNotFound />} />
				</Route>
			</Routes>
		</Router>
	);
}

export default App;
