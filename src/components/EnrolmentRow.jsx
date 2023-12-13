import React from "react";
import { Link } from "react-router-dom";
import { useAlert } from "../contexts/AlertContext";
import ConfirmationModal from "./ConfirmationModal";

const EnrolmentRow = React.memo(
	({ enrolment, isAuthenticated, deleteEnrolment }) => {
		const { modal, openModal, closeModal } = useAlert();
		const deleteEnrollment = deleteEnrolment;
		const handleDeleteConfirmation = () => {
			closeModal();
			deleteEnrollment(enrolment.id);
		};
		if (!isAuthenticated) return null;

		return (
			<>
				<ConfirmationModal
					isOpen={modal.isModalOpen}
					onClose={closeModal}
					onConfirm={handleDeleteConfirmation}
					title="Are you sure you want to delete the selected enrolment?"
				></ConfirmationModal>
				<tr>
					<td>{enrolment.id}</td>
					<td>
						{new Date(enrolment.created_at).toLocaleDateString(undefined, {
							dateStyle: "medium",
						})}
						{", " + enrolment.time}
					</td>
					<td>{enrolment.status}</td>
					<td className="flex gap-2">
						<button className="btn btn-warning btn-circle">
							<Link to={`/enrolment/${enrolment.id}/edit`}>
								<img src="/editIcon.svg" className="m-0" alt="edit icon" />
							</Link>
						</button>

						<button onClick={openModal} className="btn btn-circle btn-error">
							<img src="/deleteIcon.svg" className="m-0" alt="delete icon" />
						</button>
					</td>
				</tr>
			</>
		);
	}
);

export default EnrolmentRow;
