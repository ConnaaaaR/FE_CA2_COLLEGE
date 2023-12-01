import { useLocation, Link } from "react-router-dom";

const PageNotFound = () => {
	let location = useLocation();

	return (
		<main className=" md:container-lg max-w-lg mx-auto">
			<section className="px-5 prose flex flex-col justify-center items-center h-3/4">
				<img
					src="/404 Error-rafiki.svg"
					alt="Astronaut, distant planets, a rocketship and large 404 numbers"
				/>
				<h1 className="text-center text-neutral-content">
					Error 404. Sorry, the page '{location.pathname}' was not found
				</h1>

				<Link to="/">
					<button className="btn btn-primary text-primary-content">
						Take me back!
					</button>
				</Link>
			</section>
		</main>
	);
};

export default PageNotFound;
