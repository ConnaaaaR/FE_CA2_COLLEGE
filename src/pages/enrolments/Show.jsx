import { useEffect, useState } from "react";
import axios from "../../config/api";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useParams, Link } from "react-router-dom";
import ConfirmationModal from "../../components/ConfirmationModal";
import { useAlert } from "../../contexts/AlertContext";
import AlertBanner from "../../components/AlertBanner";

const Show = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [enrolment, setEnrolment] = useState(null);
	const token = localStorage.getItem("token");
	const { authenticated } = useAuth();
	const { alert, showAlert, closeAlert, modal, openModal, closeModal } =
		useAlert();

	useEffect(() => {
		axios
			.get(`/enrolments/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((response) => {
				setEnrolment(response.data.data);
			})
			.catch((err) => {
				console.error(err.response?.data?.message || "Error fetching data");
			});
	}, [id, token]);

	const handleDeleteConfirmation = () => {
		closeModal();
		deleteEnrollmentsAndCourse();
	};

	if (!enrolment) return <h3>Lecturer Not Found</h3>;

	return (
		<div>
			<AlertBanner
				isOpen={alert.isOpen}
				onClose={closeAlert}
				status={alert.type}
				title={alert.message}
			/>
			<ConfirmationModal
				isOpen={modal.isModalOpen}
				onClose={closeModal}
				onConfirm={handleDeleteConfirmation}
				title="Are you sure you want to delete the selected enrolment?"
			></ConfirmationModal>
			{authenticated && (
				<main className="my-5">
					<section className="bg-primary rounded-2xl p-5">
						<div className="card w-96 bg-base-100 shadow-xl mx-auto">
							<div className="card-body">
								<h2 className="card-title">{enrolment.status}</h2>
								<div className="badge badge-outline badge-secondary">
									{enrolment.id}
								</div>
								<p>{"Created : " + enrolment.date + ", " + enrolment.time}</p>

								<div className="card-actions justify-end">
									<button className="btn btn-error" onClick={openModal}>
										Delete
									</button>
									<button className="btn btn-warning">
										<Link to={`/enrolment/${id}/edit`}>Edit</Link>
									</button>
								</div>
							</div>
						</div>
					</section>
				</main>
			)}
		</div>
	);
};

export default Show;
