import { useEffect, useState } from "react";
import axios from "../../config/api";
import { useAuth } from "../../contexts/AuthContext";
import { useAlert } from "../../contexts/AlertContext";
import { Link } from "react-router-dom";

import ConfirmationModal from "../../components/ConfirmationModal";
import SkeletonRow from "../../components/SkeletonRow";
import AlertBanner from "../../components/AlertBanner";
import Pagination from "../../components/Pagination";

const Index = () => {
	const { alert, closeAlert } = useAlert();
	const [enrolments, setEnrolments] = useState([]);
	const [selectedEnrolments, setSelectedEnrolments] = useState([]);
	const [loading, setLoading] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	const openModal = () => setIsModalOpen(true);
	const closeModal = () => setIsModalOpen(false);

	useEffect(() => {
		setLoading(true);
		axios
			.get("/enrolments")
			.then((response) => {
				setEnrolments(response.data.data);
				setLoading(false);
			})
			.catch((err) => {
				console.error(err.response);
				setLoading(false);
			});
	}, []);

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

	const handleSortOrderChange = (order) => {
		setEnrolments((prevEnrolments) => {
			return [...prevEnrolments].sort((a, b) => {
				if (order === "asc") {
					return a.lecturer.name.localeCompare(b.lecturer.name);
				} else {
					return b.lecturer.name.localeCompare(a.lecturer.name);
				}
			});
		});
	};

	const toggleEnrolmentSelection = (enrolmentId) => {
		setSelectedEnrolments((prevSelectedEnrolments) =>
			prevSelectedEnrolments.includes(enrolmentId)
				? prevSelectedEnrolments.filter((id) => id !== enrolmentId)
				: [...prevSelectedEnrolments, enrolmentId]
		);
	};

	const courseSkeletons = [...Array(15)].map((_, index) => (
		// value param is never used thus is named '_'
		<SkeletonRow key={index} />
	));

	const deleteSelectedEnrolments = async () => {
		let token = localStorage.getItem("token");
		try {
			for (const enrolmentId of selectedEnrolments) {
				await axios.delete(`/enrolments/${enrolmentId}`);
			}

			setEnrolments(
				enrolments.filter(
					(enrolment) => !selectedEnrolments.includes(enrolment.id)
				)
			);
			setSelectedEnrolments([]);
		} catch (error) {
			console.error("Deletion error:", error);
		}
	};

	const handleDeleteConfirmation = () => {
		closeModal();
		deleteSelectedEnrolments();
	};

	if (!loading && enrolments.length === 0)
		return <h3>There are no enrolments!</h3>;
	const enrolmentList = enrolments
		.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
		.map(({ id, course, lecturer, status }) => {
			// destructuring the enrolment object heck yeah
			return (
				<tr className="hover:bg-base-200" key={id}>
					<th>
						<label>
							<input
								type="checkbox"
								className="checkbox checkbox-info"
								checked={selectedEnrolments.includes(id)}
								onChange={() => toggleEnrolmentSelection(id)}
							/>
						</label>
					</th>
					<td>{course.title}</td>
					<td>{lecturer.name}</td>
					<td>{status}</td>
					<td>
						<Link to={`/enrolment/${id}`}>
							<button className="btn btn-secondary btn-sm ">details</button>
						</Link>
					</td>
					<td>
						<Link to={`/enrolment/${id}/edit`}>
							<button className="btn btn-warning btn-sm ">edit</button>
						</Link>
					</td>
				</tr>
			);
		});

	return (
		<>
			<main className="container mx-auto max-w-7xl my-5">
				<ConfirmationModal
					isOpen={isModalOpen}
					onClose={closeModal}
					onConfirm={handleDeleteConfirmation}
					title="Are you sure you want to delete the selected enrolments?"
				/>
				<AlertBanner
					isOpen={alert.isOpen}
					onClose={closeAlert}
					status={alert.type}
					title={alert.message}
				/>
				<section className="bg-base-300 rounded-2xl p-5">
					<h2 className="text-3xl">All Enrolments</h2>
					<div className="overflow-x-auto">
						<button onClick={openModal} className="btn btn-error">
							Delete Selected
						</button>
						<div className="dropdown">
							<div tabIndex={0} role="button" className="btn m-1">
								Sort by Lecturer Name
							</div>
							<ul
								tabIndex={0}
								className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
							>
								<li>
									<a onClick={() => handleSortOrderChange("asc")}>
										Sort Ascending
									</a>
								</li>
								<li>
									<a onClick={() => handleSortOrderChange("desc")}>
										Sort Descending
									</a>
								</li>
							</ul>
						</div>
						<table className="table">
							<thead>
								<tr>
									<th>Select</th>
									<th>Course Title</th>
									<th>Lecturer Name</th>
									<th>Status</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody className="prose">
								{loading ? courseSkeletons : enrolmentList}
							</tbody>
						</table>
					</div>
					<Pagination currentPage={currentPage} handlePageChange={handlePageChange}  maxPage={enrolments.length / itemsPerPage} />
				</section>
			</main>
			
		</>
	);
	
};

export default Index;
