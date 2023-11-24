import React from "react";
import { Link, Outlet } from "react-router-dom";

const Drawer = () => {
	return (
		<div className="drawer lg:drawer-open ">
			<input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
			<div className="drawer-content flex flex-col items-center justify-center">
				<Outlet />
				<label
					htmlFor="my-drawer-2"
					className="btn btn-primary drawer-button lg:hidden"
				>
					Open drawer
				</label>
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
					<h2 className="menu-title">Courses</h2>
					<li>
						<Link to="/courses">View All Courses</Link>
					</li>
					<li>
						<Link to="/courses/create">Create New Course</Link>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default Drawer;
