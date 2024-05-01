import { useDispatch, useSelector } from 'react-redux';
import BackArrow from '../../../svg/BackArrow';
import BookMarkIcon from '../../../svg/BookMarkIcon';
import CloseIcon from '../../../svg/CloseIcon';
import ForwardArrow from '../../../svg/ForwardArrow';
import LikeIcon from '../../../svg/LikeIcon';
import ShareIcon from '../../../svg/ShareIcon';
import StoryHeader from './StoryHeader';
import styles from './ViewStoryPopup.module.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SET_LOGIN_POPUP, SET_VIEW_STORY_POPUP } from '../../../redux/slice/mainSlice';
import { SET_ACTIVE_STORY } from '../../../redux/slice/storySlice';
import toast from 'react-hot-toast';
import { bookMarkStoryApi, likeStoryApi } from '../../../services/StoriesService';
import { useLocation, useNavigate } from 'react-router-dom';
const API_ENDPOINT = `${import.meta.env.VITE_REACT_APP_CLIENT_ENDPOINT}`;

const ViewStoryPopup = ({ isSmallScreen }) => {
	let duration = 5000;
	const [loaded, setLoaded] = useState(false);
	const [activeIndex, setActiveIndex] = useState(0);
	const { activeStory } = useSelector((state) => state.story);
	const { user } = useSelector((state) => state.user);
	const location = useLocation();
	const [noOfLike, setNoOfLike] = useState(activeStory?.likeCount || 0);
	const [progress, setProgress] = useState(0);
	const { token } = user;

	const [isLiked, setIsLiked] = useState(activeStory?.likes?.includes(user._id));
	const [isBookMarked, setIsBookMarked] = useState(activeStory?.bookmarks?.includes(user._id));
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleBack = useCallback(() => {
		if (activeIndex > 0) {
			setProgress(0);
			setActiveIndex((activeIndex) => activeIndex - 1);
		}
	}, [activeIndex]);

	const handleForward = useCallback(() => {
		if (activeIndex < activeStory?.slides?.length - 1) {
			setProgress(0);
			setLoaded(false);
			if (loaded) {
				setActiveIndex((activeIndex) => activeIndex + 1);
			}
		}
	}, [activeIndex, activeStory?.slides?.length, loaded]);

	const handleCloseButton = useCallback(() => {
		if (location.pathname.startsWith('/view_story')) {
			dispatch(SET_VIEW_STORY_POPUP(false));
			dispatch(SET_ACTIVE_STORY({}));
			navigate('/');
		} else {
			dispatch(SET_VIEW_STORY_POPUP(false));
			dispatch(SET_ACTIVE_STORY({}));
		}
	}, [dispatch, location.pathname, navigate]);

	const handleShareButton = async () => {
		const textToCopy = `${API_ENDPOINT}/view_story/${activeStory._id}`;
		await navigator.clipboard.writeText(textToCopy);
		toast.success('Link copied to clipbard.');
	};

	const handleLikeClicked = async () => {
		if (!user || !user.token) {
			dispatch(SET_VIEW_STORY_POPUP(false));
			dispatch(SET_LOGIN_POPUP(true));
			toast.error('Sign In to like a post.');
			navigate('/');
		} else {
			const storyId = activeStory._id;
			try {
				setIsLiked((prev) => !prev);
				setNoOfLike((prev) => {
					if (isLiked === false) {
						return prev + 1;
					} else if (isLiked === true) {
						return prev - 1;
					}
				});
				await likeStoryApi({ storyId, token });
			} catch (error) {
				toast.error(error.message);
			}
		}
	};

	const handleBookMarkClicked = async () => {
		if (!user || !user.token) {
			dispatch(SET_VIEW_STORY_POPUP(false));
			dispatch(SET_LOGIN_POPUP(true));
			toast.error('Sign In to bookmark a post.');
			navigate('/');
		} else {
			const storyId = activeStory._id;
			try {
				setIsBookMarked((prev) => !prev);
				await bookMarkStoryApi({ storyId, token });
			} catch (error) {
				toast.error(error.message);
			}
		}
	};

	useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.keyCode === 37) {
				// for left Arrow
				handleBack();
			} else if (event.keyCode === 39) {
				// for right arrow
				handleForward();
			} else if (event.keyCode === 27) {
				// for escape key
				handleCloseButton();
			}
		};

		const handlePopState = (event) => {
			event.preventDefault();
			handleCloseButton();
		};

		const handleFullscreenChange = () => {
			if (!document.fullscreenElement && isSmallScreen) {
				handleCloseButton();
			}
		};

		const storyContainer = document.getElementById('storyContainerId');
		if (storyContainer && isSmallScreen) {
			storyContainer.requestFullscreen();
		}

		window.addEventListener('popstate', handlePopState);
		document.addEventListener('keydown', handleKeyDown);
		document.addEventListener('fullscreenchange', handleFullscreenChange);

		return () => {
			window.removeEventListener('popstate', handlePopState);
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('fullscreenchange', handleFullscreenChange);
		};
	}, [handleBack, handleCloseButton, handleForward, isSmallScreen]);

	return (
		<div id='storyContainerId' className={`${styles.mainContainer}`}>
			<div className={styles.outerContainer}>
				{/* Back Arrow */}
				<div className={styles.backArrowIcon} onClick={handleBack}>
					<BackArrow />
				</div>
				{/* container */}
				<div className={styles.internalContainer}>
					{/* top stories header */}
					<div className={styles.storyHeader}>
						<StoryHeader
							slides={activeStory.slides}
							activeIndex={activeIndex}
							handleForward={handleForward}
							duration={duration}
							progress={progress}
							setProgress={setProgress}
							loaded={loaded}
						/>
					</div>
					{/* heder buttons */}
					<div className={styles.headerButtonContainer}>
						<div onClick={handleCloseButton} className={styles.closeIcon}>
							<CloseIcon />
						</div>
						<div onClick={handleShareButton} className={styles.shareIcon}>
							<ShareIcon />
						</div>
					</div>

					<div className={styles.imageContainer}>
						<div
							onClick={() => {
								isSmallScreen && handleBack();
							}}
							className={styles.beforeImage}
						></div>
						<img
							key={activeIndex}
							className={!loaded ? `${styles.loading}` : ''}
							loading='eager'
							onLoad={(e) => {
								if (e.target.complete) {
									setLoaded(true); // Set loaded to true only when the image is fully loaded
								}
							}}
							src={activeStory?.slides[activeIndex]?.ImageURL}
							alt=''
						/>
						<div
							onClick={() => {
								isSmallScreen && handleForward();
							}}
							className={styles.afterImage}
						></div>
					</div>

					{/* story info */}
					<div className={styles.storyInfo}>
						<h2>
							{activeStory?.slides[activeIndex]?.Heading.length > 25
								? `${activeStory?.slides[activeIndex]?.Heading.substring(0, 25)}...`
								: activeStory?.slides[activeIndex]?.Heading}
						</h2>
						<p>
							{activeStory?.slides[activeIndex]?.Description.length > 70
								? `${activeStory?.slides[activeIndex]?.Description.substring(
										0,
										70
								)}...`
								: activeStory?.slides[activeIndex]?.Description}
						</p>
					</div>

					{/* Interaction buttons */}
					<div className={styles.actionButtons}>
						<div
							onClick={handleBookMarkClicked}
							className={`${styles.bookMarkIcon} ${
								isBookMarked && styles.activeBookMarkIcon
							}`}
						>
							<BookMarkIcon />
						</div>

						<div className={styles.likeLottieContainer}></div>
						<div className={styles.likeContainer}>
							<div
								onClick={handleLikeClicked}
								className={`${styles.likeIcon} ${isLiked && styles.activeLikeIcon}`}
							>
								<LikeIcon />
							</div>
							<span>{noOfLike}</span>
						</div>
					</div>
				</div>

				{/* forward arrow */}
				<div className={styles.forwardArrowIcon} onClick={handleForward}>
					<ForwardArrow />
				</div>
			</div>
		</div>
	);
};

export default ViewStoryPopup;
