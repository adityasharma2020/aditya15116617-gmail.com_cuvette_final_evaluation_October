import React, { useEffect, useState } from 'react';
import ViewStoryPopup from '../components/Story/ViewStoryPopup/ViewStoryPopup';
import { useParams } from 'react-router-dom';
import { getStoryApi } from '../services/StoriesService';
import { useDispatch } from 'react-redux';
import { SET_VIEW_STORY_POPUP } from '../redux/slice/mainSlice';
import toast from 'react-hot-toast';
import { SET_ACTIVE_STORY } from '../redux/slice/storySlice';

const ViewStoryPage = () => {
	const { id: storyId } = useParams();
	const dispatch = useDispatch();
	useEffect(() => {
		const getStory = async () => {
			try {
				const data = await getStoryApi({ storyId });
				dispatch(SET_VIEW_STORY_POPUP(true));
				dispatch(SET_ACTIVE_STORY(data.data));
			} catch (error) {
				toast.error(error.message);
				dispatch(SET_VIEW_STORY_POPUP(false));
			}
		};

		getStory();
	}, [dispatch, storyId]);

	return <></>;
};

export default ViewStoryPage;
