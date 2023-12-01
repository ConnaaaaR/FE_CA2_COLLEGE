import { useEffect, useState } from "react";
import axios from "../../config/api";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

import ConfirmationModal from "../../components/ConfirmationModal";
import { useAlert } from "../../contexts/AlertContext";
import AlertBanner from "../../components/AlertBanner";
import SkeletonRow from "../../components/SkeletonRow";

const Index = () => {
	const { alert, showAlert, closeAlert, modal, openModal, closeModal } =
		useAlert();
	const { authenticated } = useAuth();
	const [courses, setCourses] = useState([]);
	const [selectedCourses, setSelectedCourses] = useState([]);
	const [loading, setLoading] = useState(false);

	let token = localStorage.getItem("token");

	useEffect(() => {
		setLoading(true);
		axios
			.get("/courses")
			.then((response) => {
				setCourses(response.data.data);
				setLoading(false);
			})
			.catch((err) => {
				console.error(err.response.data.message);
				setLoading(false);
			});
	}, []);

	// debug useEffect for seeing deletion IDs
	useEffect(() => {
		console.log(selectedCourses);
	}, [selectedCourses]);

	const toggleCourseSelection = (courseId) => {
		setSelectedCourses((prevSelectedCourses) =>
			prevSelectedCourses.includes(courseId)
				? prevSelectedCourses.filter((id) => id !== courseId)
				: [...prevSelectedCourses, courseId]
		);
	};

	const deleteEnrollmentsAndCourse = async () => {
		// deletes enrollments, waits for it to complete and then deletes the course
		setLoading(true);
		try {
			for (const courseId of selectedCourses) {
				const course = courses.find((c) => c.id === courseId);
				for (const enrollment of course.enrolments) {
					await axios.delete(`/enrolments/${enrollment.id}`);
				}
				await axios.delete(`/courses/${courseId}`);
			}
			// update list
			setCourses(
				courses.filter((course) => !selectedCourses.includes(course.id))
			);
			setSelectedCourses([]);
			showAlert("success", "Entries Deleted Successfully!");
			setLoading(false);
		} catch (error) {
			setLoading(false);
			console.error("Deletion error:", error);
			showAlert("error", "Error occured while deleting!");
		}
	};

	const handleDeleteConfirmation = () => {
		closeModal();
		deleteEnrollmentsAndCourse();
	};

	const courseSkeletons = [...Array(15)].map((_, index) => (
		// value param is never used thus is named '_'
		<SkeletonRow key={index} />
	));

	if (!loading && courses.length === 0) return <h3>There are no courses!</h3>;
	const coursesList = courses.map((course) => {
		return (
			<>
				{authenticated ? (
					<>
						<tr key={course.id}>
							<th>
								<label>
									<input
										type="checkbox"
										className="checkbox opacity-50"
										checked={selectedCourses.includes(course.id)}
										onChange={() => toggleCourseSelection(course.id)}
									/>
								</label>
							</th>

							<td>
								<div className="flex items-center gap-3 ">
									<div>
										<div className="font-bold ">{course.title}</div>
										<div className="text-sm opacity-50">
											{course.code} | {course.id}
										</div>
									</div>
								</div>
							</td>
							<td className="">
								{course.description}
								<br />
								<span className="badge badge-base-100 badge-sm">
									<b>Points:&nbsp; </b>
									{course.points}
								</span>
							</td>
							<td className="">{course.level}</td>
							<th>
								<Link to={`/courses/${course.id}`}>
									<button className="btn btn-secondary btn-sm ">Details</button>
								</Link>
							</th>
							<th>
								<Link to={`/courses/${course.id}/edit`}>
									<button className="btn btn-warning btn-sm ">Edit</button>
								</Link>
							</th>
						</tr>
					</>
				) : (
					<p key={course.id}>
						<b>Title: </b> {course.title}
					</p>
				)}
			</>
		);
	});

	return (
		<>
			<main className="container mx-auto max-w-7xl my-5">
				{/* ################# ALERTS ################# */}
				<ConfirmationModal
					isOpen={modal.isModalOpen}
					onClose={closeModal}
					onConfirm={handleDeleteConfirmation}
					title="Are you sure you want to delete the selected courses?"
				>
					Courses with enrollments will have their enrollments deleted as well.
				</ConfirmationModal>
				<AlertBanner
					isOpen={alert.isOpen}
					onClose={closeAlert}
					status={alert.type}
					title={alert.message}
				/>
				{/* ############### ALERTS END ############### */}

				<section className=" bg-base-300 rounded-2xl my-2 p-5 ">
					<div className="flex justify-between">
						<h2 className="text-3xl">All Courses</h2>

						<div className="overflow-x-auto ">
							<div className="flex-none"></div>
							<button onClick={openModal} className="btn btn-error flex flex-1">
								Delete Selected
							</button>
						</div>
					</div>

					<div className="overflow-x-auto ">
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
							<tbody className="prose">
								{loading ? courseSkeletons : coursesList}
							</tbody>
						</table>
					</div>
				</section>
			</main>
		</>
	);
};

export default Index;
