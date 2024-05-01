import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
	name: 'user',
	initialState: {
		isLoggedIn: false,
		error: null,
		loading: false,
		user: {
			_id: '',
			name: '',
			email: '',
			picture: '',
			token: '',
			bookmarks: [],
		},
	},
	reducers: {
		SET_LOGOUT: (state) => {
			(state.isLoggedIn = false),
				(state.error = null),
				(state.loading = false),
				(state.user = {
					_id: '',
					name: '',
					email: '',
					picture: '',
					token: '',
					bookmarks: [],
				});
		},
		SET_LOGIN: (state, action) => {
			const userDetails = action.payload;

			state.isLoggedIn = true;
			state.user._id = userDetails?.user?._id;
			state.user.name = userDetails?.user?.name;
			state.user.email = userDetails?.user?.email;
			state.user.picture = userDetails?.user?.picture;
			state.user.token = userDetails?.user?.token;
			state.user.bookmarks = userDetails?.user?.bookmarks;
			state.error = '';
		},
		SET_REGISTER: (state, action) => {
			const userDetails = action.payload;
			state.isLoggedIn = true;
			state.user._id = userDetails?.user?._id;
			state.user.name = userDetails?.user?.name;
			state.user.email = userDetails?.user?.email;
			state.user.picture = userDetails?.user?.picture;
			state.user.token = userDetails?.user?.token;
			state.user.bookmarks = userDetails?.user?.bookmarks;
			state.error = '';
		},
		SET_ERROR_MESSAGE: (state, action) => {
			state.error = action.payload;
		},

		SET_USER_LOADING: (state, action) => {
			state.loading = action.payload;
		},
		SET_SESSION: (state, action) => {
			if (action.payload) {
				(state.isLoggedIn = false),
					(state.error = null),
					(state.loading = false),
					(state.user = {
						_id: '',
						name: '',
						email: '',
						picture: '',
						token: '',
						bookmarks: [],
					});
			}
		},
	},
});

export const {
	SET_REGISTER,
	SET_LOGIN,
	SET_LOGOUT,
	SET_SESSION,
	SET_USER_LOADING,
	SET_ERROR_MESSAGE,
} = userSlice.actions;

export default userSlice.reducer;
