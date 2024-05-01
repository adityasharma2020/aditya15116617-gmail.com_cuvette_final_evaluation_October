import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './BookMarkStories.module.css';
import SingleStory from '../SingleStory/SingleStory';
import toast from 'react-hot-toast';
import { fetchBookmarkStoriesApi } from '../../../services/userService';
import SkeletonLoader from '../../SkeletonLoader/SkeletonLoader';
const BookMarkStories = () => {
	const [bookmarkStories, setBookmarkStories] = useState([]);
	const [storiesLoading, setStoriesLoading] = useState(false);
	const { user } = useSelector((state) => state.user);
	const { activeStory } = useSelector((state) => state.story);
	const dispatch = useDispatch();
	const [remainingCount, setRemainingConut] = useState(null);
	const { token } = user;
	const [page, setPage] = useState(1);

	useEffect(() => {
		const fetchBookmarkStories = async () => {
			try {
				setStoriesLoading(true);
				const { data } = await fetchBookmarkStoriesApi({ token, page });
				const newStories = data.data;
				setRemainingConut(data.remainingCount);
				setBookmarkStories((prev) => [...prev, ...newStories]);
			} catch (error) {
				toast.error(error.message);
			} finally {
				setStoriesLoading(false);
			}
		};
		fetchBookmarkStories();
	}, [dispatch, page, activeStory, token]);

	//to check whether bookmarks is removed or not , so that we show hte latest bookmarks
	useEffect(() => {
		setBookmarkStories([]);
	}, [activeStory]);

	return (
		<>
			<div className={styles.mainContainer}>
				<h1 className={styles.h1}>Your BookMark Stories</h1>
				{!storiesLoading ? (
					<>
						<div>
							<div className={styles.container}>
								{bookmarkStories.length > 0 ? (
									bookmarkStories?.map((bookmarkStory, index) => {
										return <SingleStory key={index} story={bookmarkStory} />;
									})
								) : (
									<>
										<div className={styles.noStories}>
											No BookMark Stories Available
										</div>
									</>
								)}
							</div>
							{remainingCount > 0 && (
								<button
									onClick={() => {
										// setShowMoreClicked(true);
										setPage((prev) => prev + 1);
									}}
									className={styles.showMoreButton}
								>
									Show More
								</button>
							)}
						</div>
					</>
				) : (
					<>
						<SkeletonLoader />
					</>
				)}
			</div>
		</>
	);
};

export default BookMarkStories;
