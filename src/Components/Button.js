import clsx from 'clsx';
import { memo } from 'react';

function Button({ children, onClick, addClass = null, disabled = false }) {
	return (
		<button
			onClick={onClick}
			disabled={disabled}
			type="button"
			className={clsx(
				addClass && addClass,
				'w-full flex items-center justify-center shadow sm:mt-0 px-8 py-2 border border-transparent text-base font-medium rounded-md md:text-lg md:px-10'
			)}
		>
			{children}
		</button>
	);
}

export default memo(Button);
