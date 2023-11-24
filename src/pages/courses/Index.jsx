import { useEffect, useState } from "react";
import axios from "../../config/api";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

const Index = () => {
	const { authenticated } = useAuth();
	const [courses, setCourses] = useState([]);
	const [selectedCourses, setSelectedCourses] = useState([]);
	const [loading, setLoading] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [courseHasEnrollments, setCourseHasEnrollments] = useState(false);

	const openModal = () => setIsModalOpen(true);
	const closeModal = () => setIsModalOpen(false);
	let token = localStorage.getItem("token");

	useEffect(() => {
		setLoading(true);
		axios
			.get("/courses", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
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
		let token = localStorage.getItem("token");
		// deletes enrollments, waits for it to complete and then deletes the course
		try {
			for (const courseId of selectedCourses) {
				const course = courses.find((c) => c.id === courseId);
				for (const enrollment of course.enrolments) {
					await axios.delete(`/enrolments/${enrollment.id}`, {
						headers: { Authorization: `Bearer ${token}` },
					});
				}
				await axios.delete(`/courses/${courseId}`, {
					headers: { Authorization: `Bearer ${token}` },
				});
			}
			// Update the UI after successful deletion
			setCourses(
				courses.filter((course) => !selectedCourses.includes(course.id))
			);
			setSelectedCourses([]);
		} catch (error) {
			console.error("Deletion error:", error);
		}
	};

	const handleDeleteConfirmation = () => {
		closeModal();
		deleteEnrollmentsAndCourse();
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
										className="checkbox checkbox-info"
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
									<button className="btn btn-square btn-ghost btn-sm ">
										details
									</button>
								</Link>
							</th>
							<th>
								<Link to={`/courses/${course.id}/edit`}>
									<button className="btn btn-warning btn-sm ">edit</button>
								</Link>
							</th>
						</tr>
					</>
				) : (
					<p>
						<b>Title: </b> {course.title}
					</p>
				)}
			</>
		);
	});

	return (
		<>
			<main className="container mx-auto max-w-7xl my-5">
				<div className={`modal ${isModalOpen ? "modal-open" : ""}`}>
					<div className="modal-box">
						<h3 className="font-bold text-lg">
							Are you sure you want to delete the selected courses?
						</h3>

						<p className="py-4">
							Courses with enrollments will have their enrollments deleted as
							well.
						</p>

						<div className="modal-action">
							<button
								onClick={handleDeleteConfirmation}
								className="btn btn-error"
							>
								Yes, Delete
							</button>
							<button onClick={closeModal} className="btn btn-outline">
								Cancel
							</button>
						</div>
					</div>
				</div>
				<section className=" bg-base-300 rounded-2xl p-5 ">
					<h2 className="text-3xl">All Courses</h2>

					<div className="overflow-x-auto ">
						<button onClick={openModal} className="btn btn-error flex-end">
							Delete Selected
						</button>
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
