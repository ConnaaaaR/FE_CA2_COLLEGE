import { useEffect, useState } from "react";
import axios from "../../config/api";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useParams, Link } from "react-router-dom";

const Show = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [course, setCourse] = useState(null);
	const token = localStorage.getItem("token");
	const { authenticated } = useAuth();

	useEffect(() => {
		axios
			.get(`/courses/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((response) => {
				console.log(response.data.data);
				setCourse(response.data.data);
			})
			.catch((err) => {
				console.error(err.response.data.message);
			});
	}, [id]);

	if (!course) return <h3>Course Not found!</h3>;

	const enrolmentList = course.enrolments.map((person) => {
		return (
			<>
				{authenticated ? (
					<div key={person.id}>
						<tr>
							<th>
								<label>
									<input type="checkbox" className="checkbox checkbox-info" />
								</label>
							</th>

							<td>
								<div className="flex items-center gap-3 ">
									<div>
										<div className="font-bold ">{person.status} </div>
										<div className="text-sm opacity-50">{person.id}</div>
									</div>
								</div>
							</td>
							<td>
								<div className="flex items-center gap-3 ">
									<div>
										<div className="font-bold ">{person.lecturer.name}</div>
									</div>
								</div>
							</td>
						</tr>
					</div>
				) : (
					<p>
						<b>Title: </b> {course.title}
					</p>
				)}
			</>
		);
	});

	return (
		<div>
			<main className="container mx-auto max-w-7xl my-5">
				<section className="bg-base-300 rounded-2xl p-5">
					<div className="card w-96 bg-base-100 shadow-xl">
						<div className="card-body">
							<h2 className="card-title">{course.title}</h2>
							<div className="badge badge-outline badge-secondary">
								{course.code}
							</div>
							<p>{course.description}</p>
							<div className="badge badge-secondary">
								Points: {course.points}
							</div>

							<div className="card-actions justify-end">
								<button className="btn btn-error">Delete</button>
								<button className="btn  btn-warning">
									<Link to={`/courses/${id}/edit`}>Edit</Link>
								</button>
							</div>
						</div>
					</div>
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
						<tbody className="prose">{enrolmentList}</tbody>
					</table>
				</section>
			</main>
		</div>
	);
};

export default Show;
