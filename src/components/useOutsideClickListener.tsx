import { useEffect, RefObject } from 'react';

/**
 * Hook that alerts clicks outside of the passed  and execute the passed function
 */
export default function useOutsideClickListener(
	ref: RefObject<HTMLElement>,
	onOutsideClick: () => void,
) {
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (ref.current && !ref.current.contains(event.target as Node | null)) {
				onOutsideClick();
			}
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [onOutsideClick, ref]);
}
