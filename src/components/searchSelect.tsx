'use client';

import { useRef, useState } from 'react';
import useOutsideClickListener from './useOutsideClickListener';

type Option = {
	text: string;
	disabled?: boolean;
};

export type SearchSelectOptions = { [key: string]: Option };

type SearchSelectProps = {
	options: SearchSelectOptions;
	value?: string;
	// eslint-disable-next-line no-unused-vars
	onInputChange: (newValue: string) => void;
	// eslint-disable-next-line no-unused-vars
	onSelectChange: (newValue: string) => void;
};

export default function SearchSelect({
	options,
	value = '',
	onInputChange,
	onSelectChange,
}: SearchSelectProps) {
	const [isExpanded, setIsExpanded] = useState(false);

	const wrapperRef = useRef(null);
	useOutsideClickListener(wrapperRef, () => {
		setIsExpanded(false);
	});

	function onInternalSelectChange(v: string) {
		setIsExpanded(false);
		onSelectChange(v);
	}

	return (
		<div ref={wrapperRef} className="relative w-full">
			<input
				name="location"
				placeholder="Add an address"
				className="mt-1 p-2 border rounded-md w-full"
				style={{ border: 'none', outline: '2px solid silver' }}
				value={value}
				onChange={e => onInputChange(e.target.value)}
				onFocus={() => setIsExpanded(true)}
			/>
			<div
				onBlur={() => setIsExpanded(false)}
				id="dropdown"
				className={`absolute ${
					isExpanded && Object.keys(options).length > 0 ? '' : 'hidden'
				} w-full z-10 bg-white divide-y divide-gray-100 rounded-lg shadow block`}
				data-popper-placement="bottom"
			>
				<ul className="py-2 text-sm text-gray-700" aria-labelledby="dropdownDefaultButton">
					{Object.entries(options).map(([i, o]) => (
						<li key={i}>
							<button
								disabled={o.disabled}
								type="button"
								className={`inline-flex w-full px-4 py-2 ${o.disabled ? '' : 'hover:bg-gray-100'}`}
								onClick={() => onInternalSelectChange(i)}
							>
								{o.text}
							</button>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
