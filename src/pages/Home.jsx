import axios from "../config/api";
import LoginForm from "../components/LoginForm";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";

const Home = () => {
	const { authenticated } = useAuth();
	const [courses, setCourses] = useState();
	const [lecturers, setLecturers] = useState();
	const [enrollments, setEnrolments] = useState();
	const [loading, setLoading] = useState(false);

	const countEnrollments = (arr) => {
		const timeCutOff = new Date();
		timeCutOff.setDate(timeCutOff.getDate() - 10);

		let i = 0;
		arr.forEach((enrolment) => {
			const createdAt = new Date(enrolment.created_at);
			if (createdAt > timeCutOff) {
				i++;
			}
		});
		return i;
	};

	useEffect(() => {
		setLoading(true);
		axios
			.get("/courses")
			.then((response) => {
				setCourses(response.data.data);
			})
			.catch((err) => {
				console.error("there was an error: ", err);
			});
		axios
			.get("/lecturers")
			.then((response) => {
				setLecturers(response.data.data);
			})
			.catch((err) => {
				console.error("there was an error: ", err);
			});
		axios
			.get("/enrolments")
			.then((response) => {
				setEnrolments(response.data.data);
			})
			.catch((err) => {
				console.error("there was an error: ", err);
			});
		setLoading(false);
	}, []);

	if (loading)
		return <span className="loading loading-spinner loading-lg"></span>;

	return (
		<>
			{!authenticated ? (
				<LoginForm />
			) : (
				<main className="mx-auto flex gap-1 max-w-7xl my-5">
					<div className="card rounded-xl bg-base-300 hover:bg-base-200">
						<div className="card-body">
							<div className="card-title">Number of courses</div>
							{courses?.length}
						</div>
					</div>
					<div className="card rounded-xl bg-base-300 hover:bg-base-200">
						<div className="card-body">
							<div className="card-title">Number of Lecturers</div>
							{lecturers?.length}
						</div>
					</div>
					<div className="card rounded-xl bg-base-300 hover:bg-base-200">
						<div className="card-body">
							<div className="card-title">
								Number of Active Enrollments Created in the last 10 days
							</div>
							{enrollments ? countEnrollments(enrollments) : ""}
						</div>
					</div>
				</main>
			)}
		</>
	);
};

export default Home;
