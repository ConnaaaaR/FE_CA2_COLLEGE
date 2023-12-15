import React from "react";

const SortOrderSelector = (handleSortOrderChange) => {
	return (
		<details className="dropdown">
			<summary className="m-1 btn">Sort By Lecturer Name</summary>
			<ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
				<li onClick={() => handleSortOrderChange("asc")}>
					<a>Ascending</a>
				</li>
				<li onClick={() => handleSortOrderChange("desc")}>
					<a>Descending</a>
				</li>
			</ul>
		</details>
	);
};

export default SortOrderSelector;
