import { useDispatch, useSelector } from 'react-redux';
import styles from './Category.module.css';
import { useState } from 'react';
import { SET_SELECTED_CATEGORY } from '../../redux/slice/mainSlice';

const Category = ({ category }) => {
	const [loaded, setLoaded] = useState(false);
	const { selectedCategory } = useSelector((state) => state.main);
	const dispatch = useDispatch();	

	const handleCategoryChange = () => {
		dispatch(SET_SELECTED_CATEGORY(category));
	};

	return (
		<div>
			{/* container */}
			<div
				onClick={handleCategoryChange}
				className={`${styles.mainContainer} ${
					selectedCategory.key === category.key && styles.active
				}`}
			>
				<img
					className={!loaded ? `${styles.loading}` : ''}
					onLoad={() => setLoaded(true)}
					src={category.img}
					alt=''
				/>

				<p>{category.name}</p>
			</div>
		</div>
	);
};

export default Category;
