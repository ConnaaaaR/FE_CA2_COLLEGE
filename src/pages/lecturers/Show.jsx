import { useEffect, useState } from "react";
import axios from "../../config/api";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAlert } from "../../contexts/AlertContext";
import AlertBanner from "../../components/AlertBanner";
import ConfirmationModal from "../../components/ConfirmationModal";
import EnrolmentRow from "../../components/EnrolmentRow";

const Show = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const { alert, showAlert, closeAlert, modal, openModal, closeModal } =
		useAlert();

	const [lecturer, setLecturer] = useState(null);

	const token = localStorage.getItem("token");
	const { authenticated } = useAuth();

	const deleteEnrollmentsAndCourse = async () => {
		// deletes enrollments, waits for it to complete and then deletes the lecturer
		try {
			if (lecturer.enrolments.length > 0) {
				for (const enrollment of lecturer.enrolments) {
					await axios.delete(`/enrolments/${enrollment.id}`);
				}
			}

			await axios.delete(`/lecturers/${lecturer.id}`);

			showAlert("success", "Lecturer Deleted Successfully!");
			navigate("/lecturers");
		} catch (error) {
			console.error("Deletion error:", error);
			showAlert("error", "Error occurred while deleting!");
		}
	};

	const deleteEnrolment = async (enrolmentId) => {
		try {
			await axios.delete(`/enrolments/${enrolmentId}`);
			showAlert("success", "Enrolment deleted successfully!");

			setLecturer((prevLecturer) => ({
				...prevLecturer,
				enrolments: prevLecturer.enrolments.filter(
					(enrolment) => enrolment.id !== enrolmentId
				),
			}));
		} catch (error) {
			console.error("Deletion error:", error);
			showAlert("error", "Error occurred while deleting enrolment!");
		}
	};

	const handleDeleteConfirmation = () => {
		closeModal();
		deleteEnrollmentsAndCourse();
	};

	useEffect(() => {
		axios
			.get(`/lecturers/${id}`)
			.then((response) => {
				setLecturer(response.data.data);
			})
			.catch((err) => {
				console.error(err.response?.data?.message || "Error fetching data");
			});
	}, [id, token]);

	if (!lecturer) return <h3>Lecturer Not Found</h3>;

	return (
		<div>
			<main className="my-5">
				<ConfirmationModal
					isOpen={modal.isModalOpen}
					onClose={closeModal}
					onConfirm={handleDeleteConfirmation}
					title="Are you sure you want to delete the selected lecturers?"
				>
					Lecturers with enrollments will have their enrollments deleted as
					well.
				</ConfirmationModal>
				<AlertBanner
					isOpen={alert.isOpen}
					onClose={closeAlert}
					status={alert.type}
					title={alert.message}
				/>
				<section className="bg-primary w-full  mt-2 rounded-2xl p-3">
					<div className="card w-full  bg-base-100 shadow-xl mx-auto">
						<div className="card-body ">
							<h2 className="card-title">{lecturer.name}</h2>
							<div className="badge badge-outline badge-secondary">
								{lecturer.email}
							</div>
							<p>{lecturer.address}</p>
							<div className="badge badge-secondary">{lecturer.phone}</div>

							<div className="card-actions justify-end">
								<button className="btn btn-error" onClick={openModal}>
									Delete
								</button>

								<Link to={`/lecturer/${lecturer.id}/edit`}>
									<button className="btn btn-warning">Edit</button>
								</Link>
							</div>
						</div>
					</div>
					{authenticated && lecturer.enrolments.length > 0 && (
						<table className="table">
							<thead>
								<tr>
									<th>Points</th>
									<th>Created At</th>
									<th>Status</th>
								</tr>
							</thead>
							<tbody className="prose">
								{lecturer.enrolments.map((enrolment) => (
									<EnrolmentRow
										key={enrolment.id}
										enrolment={enrolment}
										isAuthenticated={authenticated}
										deleteEnrolment={deleteEnrolment}
									/>
								))}
							</tbody>
						</table>
					)}
				</section>
			</main>
		</div>
	);
};

export default Show;
