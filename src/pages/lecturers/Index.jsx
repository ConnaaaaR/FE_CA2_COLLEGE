import { useEffect, useState } from "react";
import axios from "../../config/api";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

import ConfirmationModal from "../../components/ConfirmationModal";

const Index = () => {
	const { authenticated } = useAuth();
	const [lecturers, setLecturers] = useState([]);
	const [selectedLecturers, setSelectedLecturers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const openModal = () => setIsModalOpen(true);
	const closeModal = () => setIsModalOpen(false);
	let token = localStorage.getItem("token");

	useEffect(() => {
		setLoading(true);
		axios
			.get("/lecturers", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((response) => {
				setLecturers(response.data.data);
				setLoading(false);
			})
			.catch((err) => {
				console.error(err.response.data.message);
				setLoading(false);
			});
	}, []);

	// debug useEffect for seeing deletion IDs
	useEffect(() => {
		console.log(selectedLecturers);
	}, [selectedLecturers]);

	const toggleLecturerSelection = (lecturerId) => {
		setSelectedLecturers((prevSelectedLecturers) =>
			prevSelectedLecturers.includes(lecturerId)
				? prevSelectedLecturers.filter((id) => id !== lecturerId)
				: [...prevSelectedLecturers, lecturerId]
		);
	};

	const deleteEnrollmentsAndLecturer = async () => {
		let token = localStorage.getItem("token");
		// deletes enrollments, waits for it to complete and then deletes the lecturer
		try {
			for (const lecturerId of selectedLecturers) {
				const lecturer = lecturers.find((c) => c.id === lecturerId);
				for (const enrollment of lecturer.enrolments) {
					await axios.delete(`/enrolments/${enrollment.id}`, {
						headers: { Authorization: `Bearer ${token}` },
					});
				}
				await axios
					.delete(`/lecturers/${lecturerId}`, {
						headers: { Authorization: `Bearer ${token}` },
					})
					.catch((err) => {
						console.log(err.response.data);
					});
			}

			setLecturers(
				lecturers.filter((lecturer) => !selectedLecturers.includes(lecturer.id))
			);
			setSelectedLecturers([]);
		} catch (error) {
			console.error("Deletion error:", error);
		}
	};

	const handleDeleteConfirmation = () => {
		closeModal();
		deleteEnrollmentsAndLecturer();
	};

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
		// value param is never used thus is named '_'
		<SkeletonRow key={index} />
	));

	if (!loading && lecturers.length === 0) return <h3>There are no courses!</h3>;
	const lecturerList = lecturers.map((lecturer) => {
		return (
			<>
				{authenticated ? (
					<>
						<tr key={lecturer.id}>
							<th>
								<label>
									<input
										type="checkbox"
										className="checkbox checkbox-info"
										checked={selectedLecturers.includes(lecturer.id)}
										onChange={() => toggleLecturerSelection(lecturer.id)}
									/>
								</label>
							</th>

							<td>
								<div className="flex items-center gap-3 ">
									<div>
										<div className="font-bold ">{lecturer.name}</div>
									</div>
								</div>
							</td>
							<td>
								{lecturer.email}
								<br />
								<span className="badge badge-base-100 badge-sm">
									<b>id:&nbsp; </b>
									{lecturer.id}
								</span>
							</td>
							<td>
								{lecturer.phone}

								<br />
								<span className="badge badge-base-100 badge-sm">
									<b>id:&nbsp; </b>
									{lecturer.id}
								</span>
							</td>

							<th>
								<Link to={`/lecturer/${lecturer.id}`}>
									<button className="btn btn-square btn-ghost btn-sm ">
										details
									</button>
								</Link>
							</th>
							<th>
								<Link to={`/lecturer/${lecturer.id}/edit`}>
									<button className="btn btn-warning btn-sm ">edit</button>
								</Link>
							</th>
						</tr>
					</>
				) : (
					<p>
						<b>Title: </b> {lecturer.name}
					</p>
				)}
			</>
		);
	});

	return (
		<>
			<main className="container mx-auto max-w-7xl my-5">
				{/* ################# MODAL ################# */}
				<ConfirmationModal
					isOpen={isModalOpen}
					onClose={closeModal}
					onConfirm={handleDeleteConfirmation}
					title="Are you sure you want to delete the selected lecturers?"
				>
					lecturers with enrollments will have their enrollments deleted as
					well.
				</ConfirmationModal>
				{/* ############### MODAL END ############### */}

				<section className=" bg-base-300 rounded-2xl p-5 ">
					<h2 className="text-3xl">All Courses</h2>

					<div className="overflow-x-auto ">
						<div className="flex-none"></div>
						<button onClick={openModal} className="btn btn-error flex flex-1">
							Delete Selected
						</button>
						<table className="table ">
							<thead>
								<tr>
									<th>Select</th>
									<th>Name</th>
									<th>Email</th>
									<th>Phone</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody className="prose">
								{loading ? courseSkeletons : lecturerList}
							</tbody>
						</table>
					</div>
				</section>
			</main>
		</>
	);
};

export default Index;