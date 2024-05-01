import styles from './RegisterPopup.module.css';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { RegisterSchema } from '../../../utils/validation';
import AuthInput from '../AuthInput/AuthInput';
import Loader from '../../../svg/loader.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUserApi } from '../../../services/AuthService.js';
import CloseIcon from '../../../svg/CloseIcon.jsx';
import {
	SET_LOGIN_POPUP,
	SET_MAIN_LOADING,
	SET_REGISTER_POPUP,
} from '../../../redux/slice/mainSlice.js';
import {
	SET_USER_LOADING,
	SET_REGISTER,
	SET_ERROR_MESSAGE,
} from '../../../redux/slice/userSlice.js';
import { useState } from 'react';
import Picture from '../PictureInput/PictureInput.jsx';
import axios from 'axios';
import toast from 'react-hot-toast';

const cloud_secret = `${import.meta.env.VITE_REACT_APP_CLOUD_SECRET}`;
const cloud_name = `${import.meta.env.VITE_REACT_APP_CLOUD_NAME}`;

const RegisterPopup = () => {
	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm({ resolver: yupResolver(RegisterSchema) });
	const { loading: userLoading, error } = useSelector((state) => state.user);
	const [picture, setPicture] = useState(); // here we put the image that we upload to cloudinary
	const [readablePicture, setReadablePicture] = useState(''); //this is the file that we read from user
	const [closeButtonClicked, setCloseButtonClicked] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const onSubmit = async (values) => {
		dispatch(SET_USER_LOADING(true));
		dispatch(SET_MAIN_LOADING(true));

		try {
			let response;
			if (picture) {
				//upload to cloudinary and then register user
				await uploadImage().then(async (pictureData) => {
					response = await registerUserApi({
						...values,
						picture: pictureData?.secure_url,
					});

				});
			} else {
				response = await registerUserApi({ ...values, picture: '' });
			}

			dispatch(SET_REGISTER(response));
			handleCloseLoginPopup();
			toast.success('user register successfully.');
		} catch (error) {
			dispatch(SET_ERROR_MESSAGE(error.message));
		} finally {
			dispatch(SET_USER_LOADING(false));
			dispatch(SET_MAIN_LOADING(false));
		}
	};

	const uploadImage = async () => {
		let formData = new FormData();
		formData.append('upload_preset', cloud_secret);
		formData.append('file', picture);

		const { data } = await axios.post(
			`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
			formData
		);

		return data;
	};

	const handleCloseLoginPopup = () => {
		setCloseButtonClicked(true);

		//just to make sure the that first we are able to see exit animation properly,then we dispatch the action
		setTimeout(() => {
			dispatch(SET_REGISTER_POPUP(false));
		}, 500);
	};

	return (
		<div
			className={`${styles.mainContainer} entryAnimation ${
				closeButtonClicked && 'exitAnimation'
			}`}
		>
			{/* container */}
			<div className={styles.container}>
				<div onClick={handleCloseLoginPopup}>
					<CloseIcon className={styles.CloseIcon} />
				</div>

				{/* heading */}
				<div className={styles.headingContainer}>
					<p>Welcome To swipTory</p>
					<h2 className='mt-2 text-sm'>Register to SwipTory</h2>
				</div>

				{/* form */}
				<form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
					<AuthInput
						name='name'
						type='text'
						placeholder='UserName'
						register={register}
						error={errors?.name?.message}
					/>

					<AuthInput
						name='email'
						type='text'
						placeholder='Email address'
						register={register}
						error={errors?.email?.message}
					/>

					<AuthInput
						name='password'
						type='password'
						placeholder='Password'
						register={register}
						error={errors?.password?.message}
					/>

					{/* picture */}
					<Picture
						readablePicture={readablePicture}
						setReadablePicture={setReadablePicture}
						setPicture={setPicture}
					/>

					{/* if we have an Error while registering */}

					{error ? (
						<div>
							<p className={styles.errorMessage}>{error}</p>
						</div>
					) : null}

					{/* submit button */}
					<button className={styles.button} type='submit'>
						{userLoading === true ? <Loader /> : 'Register'}
					</button>
				</form>
			</div>
		</div>
	);
};

export default RegisterPopup;
