import { Transition } from '@headlessui/react';
import { useEffect, useState } from 'react';

export default function Deadend({ message = 'Ended' }) {
	const [show, setShow] = useState(false);
	useEffect(() => setShow(true));

	return (
		<Transition
			show={show}
			enter="transition-transform ease-in-out duration-300 transform"
			enterFrom="opacity-0 scale-50 rotate-6"
			enterTo="opacity-100 scale-100 rotate-0"
			leave="transition-transform ease-in-out duration-300 transform"
			leaveFrom="opacity-100 scale-100 rotate-0"
			leaveTo="opacity-0 scale-0 -rotate-6"
		>
			<div className="w-full mx-auto max-w-md">
				<div className="p-8 bg-white border border-blue-100 shadow-sm rounded-2xl" role="alert">
					<div className="items-center sm:flex">
						<span className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-600 bg-pink-200 rounded-full">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 fill-pink-200"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth={2}
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
								/>
							</svg>
						</span>

						<p className="mt-3 text-lg font-medium sm:mt-0 sm:ml-3">Oops! we've got nothing for you</p>
					</div>

					<div className="text-left text-md mt-4">
						<h2 className="text-gray-00 mb-2">{message}</h2>
						<p className="text-gray-500">If you made a mistake in your answers feel free to go back and change them</p>
					</div>
				</div>
			</div>
		</Transition>
	);
}
