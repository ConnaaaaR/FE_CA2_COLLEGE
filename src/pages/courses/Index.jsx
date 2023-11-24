import { useEffect, useState } from "react";
import axios from "../../config/api";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

const Index = () => {
	const { authenticated } = useAuth();
	const [courses, setCourses] = useState([]);
	console.log(authenticated);
	let token = localStorage.getItem("token");

	console.log(localStorage);

	useEffect(() => {
		axios
			.get("/courses", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((response) => {
				setCourses(response.data.data);
			})
			.catch((err) => {
				console.error(err.response.data.message);
			});
	}, []);

	if (courses.length === 0) return <h3>There are no courses!</h3>;
	console.log(courses);
	const coursesList = courses.map((course) => {
		return (
			<>
				{authenticated ? (
					<>
						{/* row 1 */}
						<tr key={course._id}>
							<th>
								<label>
									<input type="radio" className="radio radio-info" />
								</label>
							</th>
							<td>
								<div className="flex items-center gap-3">
									<div>
										<div className="font-bold">{course.title}</div>
										<div className="text-sm opacity-50">{course.code}</div>
									</div>
								</div>
							</td>
							<td>
								{course.description}
								<br />
								<span className="badge badge-ghost badge-sm">
									<b>Points:&nbsp; </b>
									{course.points}
								</span>
							</td>
							<td>{course.level}</td>
							<th>
								<Link to={`/courses/${course.id}`}>
									<button className="btn btn-ghost btn-xs">details</button>
								</Link>
							</th>
						</tr>
					</>
				) : (
					<p>
						<b>Title: </b> {course.title}
					</p>
				)}
			</>
		);
	});

	return (
		<>
			<h2>All courses</h2>

			<main className="container mx-auto max-w-7xl my-5  ">
				<section className="flex parent flex-col justify-self-center py-48 sm:flex-col  justify-evenly gap-2 bg-primary rounded-2xl p-5 items-center  ">
					<h2 className="text-3xl">All Courses</h2>

					<div className="overflow-x-auto ">
						<table className="table ">
							<thead>
								<tr>
									<th>Name</th>
									<th>Description</th>
									<th>Level</th>
									<th></th>
								</tr>
							</thead>
							<tbody className="prose">{coursesList}</tbody>
						</table>
					</div>
				</section>
			</main>
		</>
	);
};

export default Index;
