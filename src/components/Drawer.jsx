import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Drawer = () => {
	const { authenticated } = useAuth();
	return (
		<div className="drawer lg:drawer-open ">
			<input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
			<div className="drawer-content flex flex-col items-center justify-center">
				
				<Outlet />
			</div>

			<div className="drawer-side">
				<label
					htmlFor="my-drawer-2"
					aria-label="Close sidebar"
					className="drawer-overlay"
				></label>
				<ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
					<h2 className="menu-title">Navigation</h2>

					<li>
						<Link to="/">Home</Link>
					</li>
					{authenticated ? (
						<>
							<h2 className="menu-title">Courses</h2>
							<li>
								<Link to="/courses">View All Courses</Link>
							</li>
							<li>
								<Link to="/courses/create">Create New Course</Link>
							</li>
							<h2 className="menu-title">Lecturers</h2>
							<li>
								<Link to="/lecturers">View All Lecturers</Link>
							</li>
							<li>
								<Link to="/lecturer/create">Create New Lecturer</Link>
							</li>
							<h2 className="menu-title">Enrolments</h2>
							<li>
								<Link to="/enrolments">View All Enrolments</Link>
							</li>
							<li>
								<Link to="/enrolment/create">Create New Enrolment</Link>
							</li>
						</>
					) : null}
				</ul>
			</div>
		</div>
	);
};

export default Drawer;
