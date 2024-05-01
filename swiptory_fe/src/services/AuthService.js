/* eslint-disable no-undef */
import axios from 'axios';

const AUTH_ENDPOINT = `${import.meta.env.VITE_REACT_APP_API_ENDPOINT}/auth`;

export const loginUserApi = async (values) => {
	try {
		const response = await axios.post(`${AUTH_ENDPOINT}/login`, {
			...values,
		});

		return response.data;
	} catch (error) {
		throw new Error(error.response?.data?.error?.message || 'something went wrong');
	}
};

export const registerUserApi = async (values) => {
	try {
		const response = await axios.post(`${AUTH_ENDPOINT}/register`, {
			...values,
		});

		return response.data;
	} catch (error) {
		throw new Error(error.response?.data?.error?.message || 'something went wrong');
	}
};
