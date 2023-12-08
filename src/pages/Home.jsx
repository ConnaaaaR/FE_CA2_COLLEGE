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

	const enrollmentsChange = () => {
		let newEnrol = countEnrollments(enrollments);
		let totEnrol = enrollments.length;

		return (newEnrol / totEnrol) * 100;
	};

	const fetchData = () => {
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
	};

	useEffect(() => {
		fetchData();
	}, []);

	if (loading)
		return <span className="loading loading-spinner loading-lg"></span>;

	return (
		<>
			{!authenticated ? (
				<LoginForm />
			) : (
				<main className="mx-auto gap-1 max-w-7xl my-5">
					<h1 className="">Data Statistics</h1>
					<div className="stats stats-vertical lg:stats-horizontal shadow">
						<div className="stat place-items-center bg-base-300 hover:bg-base-200">
							<div className="stat-body">
								<div className="stat-title">Number of courses</div>
								{courses ? (
									<>
										<div className="stat-value  text-primary hover:text-neutral">
											{courses.length}
										</div>
										<div className="stat-desc">Total</div>
									</>
								) : (
									<span className="loading loading-spinner loading-lg"></span>
								)}
							</div>
						</div>
						<div className="stat place-items-center bg-base-300 hover:bg-base-200">
							<div className="stat-body">
								<div className="stat-title">Number of Lecturers</div>
								{lecturers ? (
									<>
										<div className="stat-value  text-primary hover:text-neutral">
											{lecturers.length}
										</div>
										<div className="stat-desc">Total</div>
									</>
								) : (
									<span className="loading loading-spinner loading-lg"></span>
								)}
							</div>
						</div>
						<div className="stat place-items-center bg-base-300 hover:bg-base-200">
							<div className="stat-body">
								<div className="stat-title">Active Enrollments</div>
								{enrollments ? (
									<>
										<div className="stat-value mx-auto text-primary hover:text-neutral">
											{countEnrollments(enrollments)}
										</div>
										<div className="stat-desc">Created in last 10 days</div>
									</>
								) : (
									<span className="loading loading-spinner loading-lg"></span>
								)}
							</div>
						</div>
						<div className="stat place-items-center bg-base-300 hover:bg-base-200">
							<div className="stat-body">
								<div className="stat-title">Enrollments Percentage</div>
								{enrollments ? (
									<>
										<div
											className="radial-progress text-primary hover:text-neutral"
											style={{ "--value": Math.round(enrollmentsChange()) }}
											role="progressbar"
										>
											{Math.round(enrollmentsChange())}%
										</div>
										<div className="stat-desc">
											percent of total created in last 10 days
										</div>
									</>
								) : (
									<span className="loading loading-spinner loading-lg"></span>
								)}
							</div>
						</div>
					</div>
				</main>
			)}
		</>
	);
};

export default Home;
