import React from "react";

const SkeletonRow = () => {
	return (
		<tr>
			<td>
				<div className="skeleton h-10 w-full"></div>
			</td>
			<td>
				<div className="skeleton h-10 w-1/4"></div>
			</td>
			<td>
				<div className="flex flex-col gap-4">
					<div className="skeleton h-10 w-1/2"></div>
				</div>
			</td>
			<td>
				<div className="skeleton h-10 w-1/4"></div>
			</td>
			<td>
				<div className="flex gap-2">
					<div className="skeleton h-10 w-20"></div>
					<div className="skeleton h-10 w-20"></div>
				</div>
			</td>
		</tr>
	);
};

export default SkeletonRow;
