/* eslint-disable react/prop-types */

import { useState } from 'react';
import styles from './AuthInput.module.css';
import CloseEyeIcon from '../../../svg/CloseEyeIcon.jsx';
import OpenEyeIcon from '../../../svg/OpenEyeIcon.jsx';
export default function AuthInput({ name, type, placeholder, register, error }) {
	const [eyeVisibility, setEyeVisibility] = useState(false);
	const [inputType, setInputType] = useState(type);

	const handleEyeClicked = () => {
		setEyeVisibility((prev) => !prev);
		if (eyeVisibility) {
			setInputType('password');
		} else {
			setInputType('text');
		}
	};
	return (
		<div className={styles.mainContainer}>
			<label className={styles.label} htmlFor={name}>
				{placeholder}
			</label>
			<div className={styles.container}>
				<div className={styles.inputContainer}>
					<input
						className={styles.input}
						type={inputType}
						placeholder={placeholder}
						autoComplete='current-password'
						{...register(name)}
					/>
					{type === 'password' && (
						<div onClick={handleEyeClicked} className={styles.eye}>
							{eyeVisibility ? <OpenEyeIcon /> : <CloseEyeIcon />}
						</div>
					)}
				</div>
				{error && <p className={styles.errorMessage}>{error}</p>}
			</div>
		</div>
	);
}
