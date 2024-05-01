import axios from 'axios';

const USER_ENDPOINT = `${import.meta.env.VITE_REACT_APP_API_ENDPOINT}/user`;

export const addStoryApi = async ({ values, token }) => {
	try {
		const response = await axios.post(
			`${USER_ENDPOINT}/stories`,
			{
				...values,
			},
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

export const updateStoryApi = async ({ storyId, values, token }) => {
	try {
		const response = await axios.put(
			`${USER_ENDPOINT}/stories/${storyId}`,
			{
				...values,
			},
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

export const getUserStoriesApi = async ({ token, page }) => {
	try {
		const response = await axios.get(`${USER_ENDPOINT}/stories?page=${page}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		return response.data;
	} catch (error) {
		throw new Error(error.response?.data?.error?.message || 'something went wrong');
	}
};

// fetchBookmarkStoriesApi
export const fetchBookmarkStoriesApi = async ({ token, page }) => {
	try {
		const response = await axios.get(`${USER_ENDPOINT}/stories/bookmarks?page=${page}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		return response.data;
	} catch (error) {
		throw new Error(error.response?.data?.error?.message || 'something went wrong');
	}
};
