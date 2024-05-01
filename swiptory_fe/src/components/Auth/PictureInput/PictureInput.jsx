/* 
  So when we select the image from the user, we are going to presernve that
  image in "picture" state (the actual file) this is what cloudinary accepts.
  But as we also want to show the preview of the selected image on the page and 
  to put it in the href attribute we have to convert to base64 so that it can be able to read.

*/

import Styles from './PictureInput.module.css';
import { useRef, useState } from 'react';

const Picture = ({ readablePicture, setReadablePicture, setPicture }) => {
	const [error, setError] = useState('');
	const inputRef = useRef();

	const handlePicture = (e) => {
		let pic = e.target.files[0];
		if (pic.type !== 'image/jpeg' && pic.type !== 'image/png' && pic.type !== 'image/webp') {
			setError(`${pic.name}  format is not supported.`);
			return;
		} else if (pic.size > 5 * 1024 * 1024) {
			//5 mb
			setError(`${pic.name}  size is too large,maximum 5mb is allowed.`);
		} else {
			setError('');
			setPicture(pic);

			// -------------reading the picture--------------------------
			const reader = new FileReader();
			reader.readAsDataURL(pic);
			reader.onload = (e) => {
				setReadablePicture(e.target.result);
			};

			// Reset the file input value to allow selecting the same file again.
			e.target.value = null;
		}
	};

	const handleChangePic = () => {
		setPicture('');
		setReadablePicture('');
		// inputRef.current.click();
	};

	return (
		<div className={Styles.mainContainer}>
			<label className={Styles.label} htmlFor='picture'>
				Picture (Optional)
			</label>

			{readablePicture ? (
				<div className={Styles.imageContainer}>
					<div className={Styles.imageViewer}>
						<img src={readablePicture} alt='displayImage' />
					</div>
					{/* change pic */}
					<div className={Styles.removeButton} onClick={() => handleChangePic()}>
						Remove
					</div>
				</div>
			) : (
				<div className={Styles.button} onClick={() => inputRef.current.click()}>
					Upload Picture
				</div>
			)}
			<input
				type='file'
				name='picture'
				id='picture'
				hidden
				ref={inputRef}
				accept='image/png,image/jpeg,image/webp'
				onChange={handlePicture}
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						e.preventDefault();
					}
				}}
			/>

			{/* error */}
			<div>
				<p className={Styles.errorMessage}>{error}</p>
			</div>
		</div>
	);
};

export default Picture;
