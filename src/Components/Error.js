import { memo } from 'react';
import ExclamationCircleFilled from './Svg/ExclamationCircleFilled';

export default memo(() => (
	<div className="bg-yellow-50 max-w-md mx-auto p-2 rounded-md">
		<div className="flex justify-center items-center">
			<div className="flex-shrink-0">
				<ExclamationCircleFilled />
			</div>
			<div className="ml-3">
				<h3 className="text-sm font-medium text-yellow-800">Incorrect input !</h3>
			</div>
		</div>
	</div>
));
