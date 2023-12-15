import React from "react";

const Pagination = ({ currentPage, handlePageChange, maxPage }) => {
	return (
		<div className="join ">
			<button
				className="join-item btn btn-outline"
				onClick={() => handlePageChange(currentPage - 1)}
				disabled={currentPage === 1}
			>
				Previous
			</button>
			<button className="join-item btn btn-outline ">{currentPage}</button>
			<button
				className="join-item btn btn-outline"
				onClick={() => handlePageChange(currentPage + 1)}
				disabled={currentPage === Math.ceil(maxPage)}
			>
				Next
			</button>
		</div>
	);
};

export default Pagination;
