import { useEffect, useState } from "react";
import axios from "../../config/api";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useParams, Link } from "react-router-dom";

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
				console.log(response.data.data);
				setLecturer(response.data.data);
			})
			.catch((err) => {
				console.error(err.response.data.message);
			});
	}, [id]);

	if (!lecturer) return <h3>lecturer Not found!</h3>;

	const enrolmentList = lecturer.enrolments.map((enrollment) => {
		return (
			<>
				{authenticated ? (
					<div key={enrollment.id}>
						<tr>
							<th>
								<label>
									<input type="checkbox" className="checkbox checkbox-info" />
								</label>
							</th>

							<td>
								<div className="flex items-center gap-3 ">
									<div>
										<div className="font-bold ">{enrollment.status} </div>
										<div className="text-sm opacity-50">{enrollment.id}</div>
									</div>
								</div>
							</td>
						</tr>
					</div>
				) : (
					<p>
						<b>Title: </b> {lecturer.title}
					</p>
				)}
			</>
		);
	});

	return (
		<div>
			<main className="container mx-auto max-w-7xl my-5  ">
				<section className="flex  sm:flex-col  justify-evenly gap-2 bg-primary rounded-2xl p-5 items-center  ">
					<div className="card w-96 bg-base-100 shadow-xl">
						<div className="card-body">
							<h2 className="card-title">{lecturer.name}</h2>
							<div className="badge badge-outline badge-secondary">
								{lecturer.email}
							</div>
							<p>{lecturer.address}</p>
							<div className="badge badge-secondary">{lecturer.phone}</div>

							<div className="card-actions justify-end">
								<button className="btn btn-error">Delete</button>
								<button className="btn  btn-warning">
									<Link to={`/lecturers/${id}/edit`}>Edit</Link>
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
