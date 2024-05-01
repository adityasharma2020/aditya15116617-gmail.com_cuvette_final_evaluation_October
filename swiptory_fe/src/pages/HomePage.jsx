import { useEffect, useState } from 'react';
import CategoriesCarousel from '../components/Categories/CategoriesCarousel';
import CurrentUserStories from '../components/Story/CurrentUserStories/CurrentUserStories';
import { useSelector } from 'react-redux';
import AllCategoriesStories from '../components/Story/AllCategoriesStories/AllCategoriesStories';

import CategoryStories from '../components/Story/CategoryStories/CategoryStories';

const HomePage = ({ newStoryAdded, isSmallScreen }) => {
	const { isLoggedIn } = useSelector((state) => state.user);
	const { selectedCategory } = useSelector((state) => state.main);

	return (
		<div>
			<div>
				<CategoriesCarousel />
			</div>

			<div>
				{isLoggedIn && (selectedCategory.key ==='All') && !isSmallScreen ? (
					<CurrentUserStories newStoryAdded={newStoryAdded} />
				) : null}
			</div>

			<div>
				{selectedCategory.key === 'All' ? (
					<AllCategoriesStories />
				) : (
					<CategoryStories category={selectedCategory} />
				)}
			</div>
		</div>
	);
};

export default HomePage;
