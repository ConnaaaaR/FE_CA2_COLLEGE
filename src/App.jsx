import { useState, useEffect } from "react";
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
			</>
		);
	}
	return (
		<Router>
			<Navbar />
			<Routes>
				{/* Drawer will act as a layout component for these routes */}

				<Route path="register" element={<RegisterForm />} />
				<Route path="/" element={<Drawer />}>
					<Route path="courses" element={<CoursesIndex />} />
					<Route index element={<Home />} />
					{protectedRoutes}
					{/* Catch-all route for undefined paths */}
					<Route path="*" element={<PageNotFound />} />
				</Route>
			</Routes>
		</Router>
	);
}

export default App;
