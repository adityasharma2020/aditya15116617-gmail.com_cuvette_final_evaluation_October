import React from 'react';
import CurrentUserStories from '../components/Story/CurrentUserStories/CurrentUserStories';

const YourStoryPage = ({ newStoryAdded }) => {
	return (
		<div>
			<CurrentUserStories newStoryAdded={newStoryAdded} />
		</div>
	);
};

export default YourStoryPage;
