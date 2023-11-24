import { useEffect, useState } from "react";
import axios from "../../config/api";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useParams, Link } from "react-router-dom";

const Show = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [course, setCourse] = useState(null);
	const token = localStorage.getItem("token");
	const { authenticated } = useAuth();

	useEffect(() => {
		axios
			.get(`/courses/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((response) => {
				console.log(response.data.data);
				setCourse(response.data.data);
			})
			.catch((err) => {
				console.error(err.response.data.message);
			});
	}, [id]);

	if (!course) return <h3>Course Not found!</h3>;

	return (
		<div>
			<main className="container mx-auto max-w-7xl my-5  ">
				<section className="flex parent flex-col justify-self-center py-48 sm:flex-col  justify-evenly gap-2 bg-primary rounded-2xl p-5 items-center  ">
					<h2 className="text-3xl">{course.title}</h2>
					<button className="btn btn-outline">
						<Link to={`/courses/${id}/edit`}>Edit</Link>
					</button>
				</section>
			</main>
		</div>
	);
};

export default Show;
