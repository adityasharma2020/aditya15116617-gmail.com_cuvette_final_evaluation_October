import React, { useEffect } from 'react';
import BookMarkStories from '../components/Story/BookMarkStories/BookMarkStories';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const BookmarkPage = () => {
	const navigate = useNavigate();
	const { isLoggedIn } = useSelector((state) => state.user);
	
	useEffect(() => {
		if (!isLoggedIn) {
			navigate('/');
		}
	}, [isLoggedIn, navigate]);


	return <div>{isLoggedIn && <BookMarkStories />}</div>;
};

export default BookmarkPage;
