import { memo } from 'react';

const Progress = ({ currentIndex, total }) => {
	const percent = currentIndex === 0 ? 0 : Math.ceil((100 / total) * (currentIndex + 1));

	return (
		<>
			<p className="text-left text-xs font-medium text-gray-500">
				{currentIndex + 1}/{total} - {percent}% completed
			</p>

			<div className="mt-4 overflow-hidden bg-gray-200 rounded-full">
				<div className="transition-width ease-in duration-500 h-1.5 bg-indigo-400 rounded-full" style={{ width: percent + '%' }}></div>
			</div>
		</>
	);
};

export default memo(Progress);
