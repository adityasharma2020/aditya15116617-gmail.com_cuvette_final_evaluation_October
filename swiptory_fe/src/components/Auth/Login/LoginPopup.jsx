import styles from './LoginPopup.module.css';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { signInSchema } from '../../../utils/validation';
import AuthInput from '../AuthInput/AuthInput';
import Loader from '../../../svg/loader.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { loginUserApi } from '../../../services/AuthService.js';
import CloseIcon from '../../../svg/CloseIcon.jsx';
import { SET_LOGIN_POPUP, SET_MAIN_LOADING } from '../../../redux/slice/mainSlice.js';
import { SET_USER_LOADING, SET_LOGIN, SET_ERROR_MESSAGE } from '../../../redux/slice/userSlice.js';
import { useState } from 'react';
import toast from 'react-hot-toast';

const LoginPopup = () => {
	const dispatch = useDispatch();
	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm({ resolver: yupResolver(signInSchema) });
	const { loading: userLoading, error } = useSelector((state) => state.user);
	const [closeButtonClicked, setCloseButtonClicked] = useState(false);

	const onSubmit = async (values) => {
		dispatch(SET_MAIN_LOADING(true));
		dispatch(SET_USER_LOADING(true));

		try {
			let response = await loginUserApi({ ...values });
			dispatch(SET_LOGIN(response));
			handleCloseLoginPopup();
			toast.success('User Login Successful.');
		} catch (error) {
			dispatch(SET_ERROR_MESSAGE(error.message));
		} finally {
			dispatch(SET_USER_LOADING(false));
			dispatch(SET_MAIN_LOADING(false));
		}
	};

	const handleCloseLoginPopup = () => {
		setCloseButtonClicked(true);

		//just to make sure the that first we are able to see exit animation properly,then we dispatch the action
		setTimeout(() => {
			dispatch(SET_LOGIN_POPUP(false));
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
					<p>Welcome Back</p>
					<h2 className='mt-2 text-sm'>Login to Swiptory</h2>
				</div>

				{/* form */}
				<form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
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

					{/* if we have an Error while registering */}

					{error ? (
						<div>
							<p className={styles.errorMessage}>{error}</p>
						</div>
					) : null}

					{/* submit button */}
					<button className={styles.button} type='submit'>
						{userLoading === true ? <Loader /> : 'Login'}
					</button>
				</form>
			</div>
		</div>
	);
};

export default LoginPopup;
