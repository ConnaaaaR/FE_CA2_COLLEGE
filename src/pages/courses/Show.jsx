import { useEffect, useState } from "react";
import axios from "../../config/api";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useParams, Link } from "react-router-dom";

const EnrolmentRow = ({ enrolment, isAuthenticated }) => {
	return (
		<tr key={enrolment.id}>
			{isAuthenticated && (
				<>
					<td>
						<label>
							<input type="checkbox" className="checkbox checkbox-primary" />
						</label>
					</td>
					<td>{enrolment.id}</td>
					<td className="text-secondary">
						{new Date(enrolment.created_at).toLocaleDateString(undefined, {
							dateStyle: "medium",
						})}
						{" " + enrolment.time}
					</td>
					<td>{enrolment.status}</td>
				</>
			)}
		</tr>
	);
};

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
				setCourse(response.data.data);
			})
			.catch((err) => {
				console.error(err.response?.data?.message || "Error fetching data");
			});
	}, [id, token]);

	if (!course) return <h3>Course Not Found</h3>;

	return (
		<div className="container mx-auto p-4">
			<div className="card lg:card-side bg-base-100 shadow-xl">
				<div className="card-body">
					<h2 className="card-title">{course.title}</h2>
					<p>{course.description}</p>
					<div className="badge badge-outline badge-secondary">
						{course.code}
					</div>
					<div className="badge badge-secondary">{course.points}</div>
					<div className="card-actions justify-end">
						<button className="btn btn-error">Delete</button>
						<button className="btn btn-warning">
							<Link to={`/lecturers/${id}/edit`}>Edit</Link>
						</button>
					</div>
				</div>
			</div>
			{authenticated && (
				<div className="overflow-x-auto mt-5">
					<table className="table w-full">
						<thead>
							<tr>
								<th>Select</th>
								<th>Enrolment Id</th>
								<th>Created At</th>
								<th>Status</th>
							</tr>
						</thead>
						<tbody>
							{course.enrolments.map((enrolment) => (
								<EnrolmentRow
									enrolment={enrolment}
									isAuthenticated={authenticated}
								/>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default Show;
