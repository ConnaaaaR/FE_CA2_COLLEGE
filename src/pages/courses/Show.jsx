import { useEffect, useState } from "react";
import axios from "../../config/api";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useParams, Link } from "react-router-dom";
import ConfirmationModal from "../../components/ConfirmationModal";
import { useAlert } from "../../contexts/AlertContext";

const Show = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const { showAlert } = useAlert();

	const [course, setCourse] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const token = localStorage.getItem("token");
	const { authenticated } = useAuth();

	const openModal = () => setIsModalOpen(true);
	const closeModal = () => setIsModalOpen(false);

	// const { showAlert } = useAlert();

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

	const deleteEnrollmentsAndCourse = async () => {
		// deletes enrollments, waits for it to complete and then deletes the course
		try {
			if (course.enrolments.length > 0) {
				for (const enrollment of course.enrolments) {
					await axios.delete(`/enrolments/${enrollment.id}`, {
						headers: { Authorization: `Bearer ${token}` },
					});
				}
			}

			await axios.delete(`/courses/${course.id}`, {
				headers: { Authorization: `Bearer ${token}` },
			});

			showAlert("success", "Course Deleted Successfully!");
			navigate("/courses");
		} catch (error) {
			console.error("Deletion error:", error);
			showAlert("error", "Error occurred while deleting!");
		}
	};

	const handleDeleteConfirmation = () => {
		closeModal();
		deleteEnrollmentsAndCourse();
	};

	if (!course) return navigate("/");

	return (
		<div className="container mx-auto rounded-2xl bg-base-200 p-4">
			{/* ################# MODAL ################# */}
			<ConfirmationModal
				isOpen={isModalOpen}
				onClose={closeModal}
				onConfirm={handleDeleteConfirmation}
				title="Are you sure you want to delete the selected courses?"
			>
				Courses with enrollments will have their enrollments deleted as well.
			</ConfirmationModal>
			<div className="card lg:card-side bg-base-300  shadow-xl">
				<div className="card-body">
					<h2 className="card-title">{course.title}</h2>
					<p>{course.description}</p>
					<div className="badge badge-outline badge-secondary">
						{course.code}
					</div>
					<div className="badge badge-secondary">{course.points}</div>
					<div className="card-actions justify-end">
						<button
							className="btn btn-error"
							onClick={handleDeleteConfirmation}
						>
							Delete
						</button>
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
