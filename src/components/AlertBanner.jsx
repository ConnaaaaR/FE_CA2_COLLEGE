import { useEffect } from "react";

const AlertBanner = ({ isOpen, onClose, status, title, children }) => {
	const alertClass = status === "success" ? "alert-success" : "alert-error";
	const iconPath =
		status === "success"
			? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" // success icon
			: "M6 18L18 6M6 6l12 12"; // error icon

	useEffect(() => {
		let timeout;
		if (isOpen) {
			timeout = setTimeout(() => {
				onClose();
			}, 5000);
		}

		return () => clearTimeout(timeout);
	}, [isOpen, onClose]);

	return (
		<div
			role="alert"
			className={`alert ${alertClass} ${isOpen ? "" : "hidden"}`}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="stroke-current shrink-0 h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="2"
					d={iconPath}
				/>
			</svg>
			<span>{title}</span>
			<button onClick={onClose} className="btn btn-outline">
				Close
			</button>
			{children}
		</div>
	);
};

export default AlertBanner;
