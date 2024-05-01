import { useCallback, useEffect, useState } from 'react';
import SingleStory from '../SingleStory/SingleStory';
import styles from './CategoryStories.module.css';
import { fetchCategoryStoriesApi } from '../../../services/StoriesService';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import SkeletonLoader from '../../SkeletonLoader/SkeletonLoader';
import { SET_MAIN_LOADING } from '../../../redux/slice/mainSlice';

const CategoryStories = ({ category }) => {
	const [page, setPage] = useState(1);
	const [stories, setStories] = useState([]);
	const { user } = useSelector((state) => state.user);
	const [remainingCount, setRemainingConut] = useState(null);
	const dispatch = useDispatch();
	const { token } = user;
	const [storiesLoading, setStoriesLoading] = useState(false);
	const [showMoreClicked, setShowMoreClicked] = useState(false);

	useEffect(() => {
		const fetchStories = async () => {
			const categoryKey = category.key;
			try {
				if (!showMoreClicked) {
					setStoriesLoading(true);
				} else {
					dispatch(SET_MAIN_LOADING(true));
				}

				const data = await fetchCategoryStoriesApi({ categoryKey, token, page });
				const newStories = data.data;
				setStories((prev) => [...prev, ...newStories]);
				setRemainingConut(data?.remainingCount);
			} catch (error) {
				toast.error(error.message);
			} finally {
				setStoriesLoading(false);
				dispatch(SET_MAIN_LOADING(false));
			}
		};

		fetchStories();
	}, [category.key, page, showMoreClicked, token]);

	useEffect(() => {
		setShowMoreClicked(false);
		setStories([]);
		setPage(1);
	}, [category.key, user, token]);

	return (
		<div className={styles.mainContainer}>
			<h2 className={styles.h2}>
				Stories of category <span className={styles.categoryName}>{category.name}</span>
			</h2>
			{!storiesLoading ? (
				<>
					{stories.length > 0 ? (
						<>
							<div className={styles.container}>
								{stories.map((story, index) => (
									<SingleStory key={index} story={story} />
								))}
							</div>
							{remainingCount > 0 && (
								<button
									onClick={() => {
										setShowMoreClicked(true);
										setPage((prev) => prev + 1);
									}}
									className={styles.showMoreButton}
								>
									show more
								</button>
							)}
						</>
					) : (
						<div className={styles.noStories}>No Stories Available</div>
					)}
				</>
			) : (
				<SkeletonLoader />
			)}
		</div>
	);
};

export default CategoryStories;
