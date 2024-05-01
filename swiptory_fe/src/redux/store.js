import { configureStore } from '@reduxjs/toolkit';
import mainSlice from './slice/mainSlice';
import userSlice from './slice/userSlice';
import storySlice from './slice/storySlice';

// to load and persist the redux value in localstorage
const loadStateFromLocalStorage = () => {
	try {
		const data = localStorage.getItem('userState');
		if (data === null) {
			return undefined;
		}
		return JSON.parse(data);
	} catch (error) {
		return undefined;
	}
};

const saveStateIntoLocalStorage = (state) => {
	try {
		const updatedState = { ...state, error: null, loading: false };
		const data = JSON.stringify(updatedState);
		localStorage.setItem('userState', data);
	} catch (error) {
		return undefined;
	}
};

const persistedUserState = loadStateFromLocalStorage();
// ---------------------------Store configuration ------------------------------
const store = configureStore({
	reducer: {
		user: userSlice,
		main: mainSlice,
		story: storySlice,
	},
	preloadedState: {
		user: persistedUserState, // Set preloaded state for the user slice so ,that we can get the values from localstorage before hand.
	},
});

//here , we are subscribing the redux store , so that whenever redux state chagne , we also update it in localstorage
store.subscribe(() => {
	saveStateIntoLocalStorage(store.getState().user);
});

export default store;
