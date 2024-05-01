import React from 'react';
import styles from "./SkeletonLoader.module.css"

const skeletonArray = [1, 2, 3, 4];
const SkeletonLoader = () => {
	return (
		<div className={styles.skeletonContainer}>
			{skeletonArray.map((item) => (
				<div key={item} className={styles.skeletonItem}>
                    <div className={styles.heading}></div>
                    <div className={styles.description}></div>
                </div>
			))}
		</div>
	);
};

export default SkeletonLoader;
