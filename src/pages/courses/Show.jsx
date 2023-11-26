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
					<td>{enrolment.course.title}</td>
					<td className="text-secondary">{enrolment.course.code}</td>
					<td>{enrolment.status}</td>
				</>
			)}
		</tr>
	);
};

const Show = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [lecturer, setLecturer] = useState(null);
	const token = localStorage.getItem("token");
	const { authenticated } = useAuth();

	useEffect(() => {
		axios
			.get(`/lecturers/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((response) => {
				setLecturer(response.data.data);
			})
			.catch((err) => {
				console.error(err.response?.data?.message || "Error fetching data");
			});
	}, [id, token]);

	if (!lecturer) return <h3>Lecturer Not Found</h3>;

	return (
		<div className="container mx-auto p-4">
			<div className="card lg:card-side bg-base-100 shadow-xl">
				<div className="card-body">
					<h2 className="card-title">{lecturer.name}</h2>
					<p>{lecturer.address}</p>
					<div className="badge badge-outline badge-secondary">
						{lecturer.email}
					</div>
					<div className="badge badge-secondary">{lecturer.phone}</div>
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
								<th>Course Title</th>
								<th>Code</th>
								<th>Status</th>
							</tr>
						</thead>
						<tbody>
							{lecturer.enrolments.map((enrolment) => (
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
