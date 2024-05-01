import React, { useEffect, useRef, useState } from 'react';
import styles from './StoryHeader.module.css';

const StoryHeader = ({
	slides,
	activeIndex,
	handleForward,
	progress,
	setProgress,
	duration = 5000,
	loaded,
}) => {
	const updateInterval = 110;

	useEffect(() => {
		// Handle initial state or when there are no stories
		if (activeIndex < 0 || slides.length === 0) {
			// setProgress(0); // Reset progress to 0
			return;
		}
		const totalIncrements = duration / updateInterval;
		const incrementAmount = 100 / totalIncrements;
		const interval = setInterval(() => {
			if (loaded) {
				setProgress((oldProgress) => {
					if (oldProgress >= 100) {
						clearInterval(interval);
						handleForward();
						return 100;
					}
					return oldProgress + incrementAmount;
				});
			}
		}, updateInterval);

		return () => {
			clearInterval(interval);
		};
	}, [activeIndex, slides.length, duration, loaded, progress, setProgress, handleForward]);

	return (
		<div className={styles.storyProgresscontainer}>
			{slides.map((_, index) => {
				let storyProgress = 0;
				if (index < activeIndex) {
					storyProgress = 100;
				} else if (index === activeIndex) {
					storyProgress = progress;
				}

				return (
					<div key={index} className={styles.storyProgressItem}>
						<div
							className={styles.storyProgressBar}
							style={{ width: `${storyProgress}%` }}
						></div>
					</div>
				);
			})}
		</div>
	);
};

export default StoryHeader;
