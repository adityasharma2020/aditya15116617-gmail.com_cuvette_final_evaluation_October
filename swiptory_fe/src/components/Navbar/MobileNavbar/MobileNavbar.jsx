import React, { useEffect, useState } from 'react';
import styles from './MobileNavbar.module.css';
import { useSelector, useDispatch } from 'react-redux';
import logo from '/assets/SwiptoryLogo.webp';
import MenuIcon from '../../../svg/MenuIcon';
import BookMarkIcon from '../../../svg/BookMarkIcon';
import {
	SET_ADD_STORY_POPUP,
	SET_LOGIN_POPUP,
	SET_REGISTER_POPUP,
} from '../../../redux/slice/mainSlice';
import { useNavigate } from 'react-router-dom';
import { SET_LOGOUT } from '../../../redux/slice/userSlice';
import toast from 'react-hot-toast';

const MobileNavbar = () => {
	const { isLoggedIn } = useSelector((state) => state.user);
	const [showUserMenu, setShowUserMenu] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { user } = useSelector((state) => state.user);

	const handleRegisterButton = () => {
		dispatch(SET_REGISTER_POPUP(true));
		setShowUserMenu(false);
	};
	const handleSignInButton = () => {
		dispatch(SET_LOGIN_POPUP(true));
		setShowUserMenu(false);
	};

	const handleAddStory = () => {
		dispatch(SET_ADD_STORY_POPUP(true));
		setShowUserMenu(false);
	};

	const handleYourStory = () => {
		navigate('/your-story');
		setShowUserMenu(false);
	};

	const handleBookMarkButton = () => {
		navigate('/bookmarks');
		setShowUserMenu(false);
	};

	const handleLogout = () => {
		dispatch(SET_LOGOUT());
		toast.success('Logout successful.');
		navigate('/');
		setShowUserMenu(false);
	};

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 100) {
				setScrolled(true);
			} else {
				setScrolled(false);
			}
		};
		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	return (
		<div className={`${styles.mainContainer} ${scrolled ? styles.scrolled : ''}`}>
			{/* container */}
			<div className={styles.container}>
				<div
					onClick={() => {
						navigate('/');
						setShowUserMenu(false);
					}}
					className={styles.logoContainer}
				>
					<div className={styles.imageContainer}>
						<img src={logo} alt='' />
					</div>
					<h2>SwipTory</h2>
				</div>

				<div>
					<div>
						<div
							onClick={() => setShowUserMenu((prev) => !prev)}
							className={`${styles.burgerIcon} `}
						>
							<MenuIcon />
						</div>

						{/* User Menu  */}
						{showUserMenu && (
							<div className={styles.userMenu}>
								{!isLoggedIn ? (
									<div className={styles.loggedOutMenu}>
										<li
											onClick={handleRegisterButton}
											className={`${styles.button} ${styles.registerButton} `}
										>
											<p> Register Now</p>
										</li>
										<li
											onClick={handleSignInButton}
											className={`${styles.button} ${styles.signInButton} `}
										>
											<p> Sign In</p>
										</li>
									</div>
								) : (
									<div className={styles.loggedInMenu}>
										<div className={styles.userDetails}>
											<li className={`${styles.profilePicContainer} `}>
												<img
													className={styles.img}
													src={user.picture}
													alt=''
												/>
											</li>

											<div>
												<p>
													{user.name.length > 20
														? `${user.name.substring(0, 20)}...`
														: user.name}
												</p>
												<p>
													{user.email.length > 25
														? `${user.email.substring(0, 25)}...`
														: user.email}
												</p>
											</div>
										</div>
										<li
											onClick={handleYourStory}
											className={`${styles.button} ${styles.yourStoryButton} `}
										>
											<p>your Story</p>
										</li>

										<li
											onClick={handleAddStory}
											className={`${styles.button} ${styles.addStorybutton} `}
										>
											<p>Add Story</p>
										</li>
										<li
											onClick={handleBookMarkButton}
											className={`${styles.button} ${styles.bookmarksButton} `}
										>
											<BookMarkIcon className={styles.BookMarkIcon} />
											<p> Bookmarks</p>
										</li>

										<li
											onClick={handleLogout}
											className={`${styles.button} ${styles.logoutButton} `}
										>
											<p>Logout</p>
										</li>
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default MobileNavbar;
