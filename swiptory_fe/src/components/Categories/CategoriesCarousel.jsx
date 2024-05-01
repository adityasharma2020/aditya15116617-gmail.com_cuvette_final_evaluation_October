import Category from './Category';
import styles from './CategoriesCarousel.module.css';
import { useSelector } from 'react-redux';

const CategoriesCarousel = () => {
	const { categories } = useSelector((state) => state.main);
	return (
		<div className={styles.mainContainer}>
			<div className={styles.categoriesContainer}>
				{categories.map((category, index) => {
					return (
						<Category
							key={index}
							category={category}
						/>
					);
				})}
			</div>
		</div>
	);
};

export default CategoriesCarousel;
