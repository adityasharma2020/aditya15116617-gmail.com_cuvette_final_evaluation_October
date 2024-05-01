import { useSelector } from 'react-redux';
import CategoryStories from '../CategoryStories/CategoryStories';

const AllCategoriesStories = () => {
	const { categories } = useSelector((state) => state.main);
	return (
		<div>
			<div>
				{categories.slice(1).map((category) => (
					<CategoryStories key={category.key} category={category} />
				))}
			</div>
		</div>
	);
};

export default AllCategoriesStories;
