import { createSlice } from '@reduxjs/toolkit';

export const storySlice = createSlice({
	name: 'story',
	initialState: {
		activeStory: {},
		editingStory: {},
		editMode: false,
	},
	reducers: {
		SET_ACTIVE_STORY: (state, action) => {
			state.activeStory = action.payload;
		},
		SET_EDIT_MODE: (state, action) => {
			state.editMode = action.payload;
		},
		SET_EDITING_STORY: (state, action) => {
			state.editingStory = action.payload;
		},
	},
});

export const { SET_ACTIVE_STORY, SET_EDIT_MODE, SET_EDITING_STORY } = storySlice.actions;
export default storySlice.reducer;
