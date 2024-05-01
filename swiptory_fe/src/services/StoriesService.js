// fetchAllStoriesApi
/* eslint-disable no-undef */
import axios from 'axios';

const STORY_ENDPOINT = `${import.meta.env.VITE_REACT_APP_API_ENDPOINT}/stories`;

export const fetchCategoryStoriesApi = async ({ categoryKey, token, page }) => {
	try {
		const response = await axios.get(`${STORY_ENDPOINT}?category=${categoryKey}&page=${page}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response?.data?.data;
	} catch (error) {
		throw new Error(error.response?.data?.error?.message || 'something went wrong');
	}
};

export const likeStoryApi = async ({ storyId, token }) => {
	try {
		const response = await axios.put(
			`${STORY_ENDPOINT}/${storyId}/like`,
			{},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		return response.data;
	} catch (error) {
		throw new Error(error.response?.data?.error?.message || 'something went wrong');
	}
};
export const bookMarkStoryApi = async ({ storyId, token }) => {
	try {
		const response = await axios.put(
			`${STORY_ENDPOINT}/${storyId}/bookmark`,
			{},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		return response.data;
	} catch (error) {
		throw new Error(error.response?.data?.error?.message || 'something went wrong');
	}
};

export const getStoryApi = async ({ storyId }) => {
	try {
		const response = await axios.get(`${STORY_ENDPOINT}/${storyId}`);

		return response.data;
	} catch (error) {
		throw new Error(error.response?.data?.error?.message || 'something went wrong');
	}
};
