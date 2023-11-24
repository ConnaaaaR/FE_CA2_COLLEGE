import { useEffect, useState } from "react";
import axios from "../../config/api";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

const Index = () => {
	const { authenticated } = useAuth();
	const [courses, setCourses] = useState([]);
	const [loading, setLoading] = useState(false);
	let token = localStorage.getItem("token");

	useEffect(() => {
		setLoading(true);
		axios
			.get("/courses", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((response) => {
				setCourses(response.data.data);
				setLoading(false);
			})
			.catch((err) => {
				console.error(err.response.data.message);
				setLoading(false);
			});
	}, []);

	const SkeletonRow = () => {
		return (
			<tr>
				<td>
					<div className="skeleton h-8 w-full"></div>
				</td>
				<td>
					<div className="skeleton h-8 w-1/4"></div>
				</td>
				<td>
					<div className="flex flex-col gap-4">
						<div className="skeleton h-8 w-1/2"></div>
						<div className="skeleton h-8 w-full"></div>
						<div className="skeleton h-8 w-full"></div>
					</div>
				</td>
				<td>
					<div className="skeleton h-8 w-1/4"></div>
				</td>
				<td>
					<div className="flex gap-2">
						<div className="skeleton h-8 w-20"></div>
						<div className="skeleton h-8 w-20"></div>
					</div>
				</td>
			</tr>
		);
	};

	const courseSkeletons = [...Array(15)].map((_, index) => (
		<SkeletonRow key={index} />
	));

	// if (loading) return <h3>Loading courses...</h3>;
	if (!loading && courses.length === 0) return <h3>There are no courses!</h3>;
	const coursesList = courses.map((course) => {
		return (
			<>
				{authenticated ? (
					<>
						<tr key={course._id}>
							<th>
								<label>
									<input type="radio" className="radio radio-info" />
								</label>
							</th>

							<td>
								<div className="flex items-center gap-3 ">
									<div>
										<div className="font-bold ">{course.title}</div>
										<div className="text-sm opacity-50">
											{course.code} | {course.id}
										</div>
									</div>
								</div>
							</td>
							<td className="">
								{course.description}
								<br />
								<span className="badge badge-base-100 badge-sm">
									<b>Points:&nbsp; </b>
									{course.points}
								</span>
							</td>
							<td className="">{course.level}</td>
							<th>
								<Link to={`/courses/${course.id}`}>
									<button className="btn btn-square btn-ghost btn-sm ">
										details
									</button>
								</Link>
							</th>
							<th>
								<Link to={`/courses/${course.id}/edit`}>
									<button className="btn btn-warning btn-sm ">edit</button>
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
			<main className="container mx-auto max-w-7xl my-5">
				<section className=" bg-base-300 rounded-2xl p-5 ">
					<h2 className="text-3xl">All Courses</h2>

					<div className="overflow-x-auto ">
						<table className="table ">
							<thead>
								<tr>
									<th>Select</th>
									<th>Name</th>
									<th>Description</th>
									<th>Level</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody className="prose">
								{loading ? courseSkeletons : coursesList}
							</tbody>
						</table>
					</div>
				</section>
			</main>
		</>
	);
};

export default Index;
