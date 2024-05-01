import React from 'react';

const BackArrow = ({ className }) => {
	return (
		<svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
			className={className}
			<path
				d='M6 12H18M6 12L11 7M6 12L11 17'
				stroke='#fff'
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</svg>
	);
};

export default BackArrow;
