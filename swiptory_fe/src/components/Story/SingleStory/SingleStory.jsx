import { useDispatch, useSelector } from 'react-redux';
import {
	SET_ADD_STORY_POPUP,
	SET_MAIN_LOADING,
	SET_VIEW_STORY_POPUP,
} from '../../../redux/slice/mainSlice';
import EditIcon from '../../../svg/EditIcon';
import styles from './SingleStory.module.css';
import {
	SET_ACTIVE_STORY,
	SET_EDITING_STORY,
	SET_EDIT_MODE,
} from '../../../redux/slice/storySlice';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { getStoryApi } from '../../../services/StoriesService';

const SingleStory = ({ story }) => {
	const dispatch = useDispatch();
	const [loaded, setLoaded] = useState(false);
	const { user } = useSelector((state) => state.user);
	const { token } = user;

	const handleStory = async () => {
		const storyId = story._id;
		try {
			dispatch(SET_MAIN_LOADING(true));
			const data = await getStoryApi({ storyId });
			dispatch(SET_VIEW_STORY_POPUP(true));
			dispatch(SET_ACTIVE_STORY(data.data));
		} catch (error) {
			toast.error(error.message);
			dispatch(SET_VIEW_STORY_POPUP(false));
		} finally {
			dispatch(SET_MAIN_LOADING(false));
		}
	};

	const handleEditButton = () => {
		try {
			dispatch(SET_EDIT_MODE(true));
			dispatch(SET_EDITING_STORY(story));
			dispatch(SET_ADD_STORY_POPUP(true));
		} catch (error) {
			toast.error(error.message);
		}
	};

	return (
		<div className={styles.outerContainer}>
			<div onClick={handleStory} className={styles.mainContainer}>
				<div className={styles.imageContainer}>
					<img
						className={!loaded ? `${styles.loading}` : ''}
						onLoad={() => setLoaded(true)}
						loading='lazy'
						src={story.slides[0].ImageURL}
						alt=''
					/>
				</div>
				<div className={styles.storyInfo}>
					<h1 className={styles.h1}>
						{story.slides[0].Heading.length > 20
							? `${story.slides[0].Heading.substring(0, 20)}...`
							: story.slides[0].Heading}
					</h1>
					<p className={styles.p}>
						{story.slides[0].Description.length > 75
							? `${story.slides[0].Description.substring(0, 75)}...`
							: story.slides[0].Description}
					</p>
				</div>
			</div>
			{story?.addedBy === user._id && (
				<div onClick={handleEditButton} className={styles.editButtonContainer}>
					<div className={styles.editIcon}>
						<EditIcon />
					</div>
					<span>edit</span>
				</div>
			)}
		</div>
	);
};

export default SingleStory;
