import React, { useEffect, useState } from 'react';
import styles from './Navbar.module.css';
import { useDispatch, useSelector } from 'react-redux';
import logo from '/assets/SwiptoryLogo.webp';
import MenuIcon from '../../svg/MenuIcon';
import BookMarkIcon from '../../svg/BookMarkIcon';
import {
	SET_ADD_STORY_POPUP,
	SET_LOGIN_POPUP,
	SET_MAIN_LOADING,
	SET_REGISTER_POPUP,
} from '../../redux/slice/mainSlice';
import { useNavigate } from 'react-router-dom';
import { SET_LOGOUT } from '../../redux/slice/userSlice';
import toast from 'react-hot-toast';

const Navbar = () => {
	const { isLoggedIn } = useSelector((state) => state.user);
	const [showUserMenu, setShowUserMenu] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { user } = useSelector((state) => state.user);

	const handleRegisterButton = () => {
		dispatch(SET_REGISTER_POPUP(true));
	};
	const handleSignInButton = () => {
		dispatch(SET_LOGIN_POPUP(true));
	};

	const handleAddStory = () => {
		dispatch(SET_ADD_STORY_POPUP(true));
	};

	const handleLogout = () => {
		dispatch(SET_MAIN_LOADING(true));
		dispatch(SET_LOGOUT());
		toast.success('Logout successful.');
		setShowUserMenu(false);
		dispatch(SET_MAIN_LOADING(false));
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
				<div onClick={() => navigate('/')} className={styles.logoContainer}>
					<div className={styles.imageContainer}>
						<img src={logo} alt='' />
					</div>
					<h2>SwipTory</h2>
				</div>

				<div className={styles.menuContainer}>
					<ul>
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
								<li
									onClick={() => navigate('/bookmarks')}
									className={`${styles.button} ${styles.bookmarksButton} `}
								>
									<BookMarkIcon className={styles.BookMarkIcon} />
									<p> Bookmarks</p>
								</li>

								<li
									onClick={handleAddStory}
									className={`${styles.button} ${styles.addStorybutton} `}
								>
									<p>Add Story</p>
								</li>
								<li className={`${styles.profilePicContainer} `}>
									<img className={styles.img} src={user.picture} alt='' />
								</li>
								<div
									onClick={() => setShowUserMenu((prev) => !prev)}
									className={`${styles.burgerIcon} `}
								>
									<MenuIcon />
								</div>
								{/* User Menu  */}
								{showUserMenu && (
									<div className={styles.userMenu}>
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
										<div
											onClick={handleLogout}
											className={`${styles.button} ${styles.logoutButton} `}
										>
											Logout
										</div>
									</div>
								)}
							</div>
						)}
					</ul>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
