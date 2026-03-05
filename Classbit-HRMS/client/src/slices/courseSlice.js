import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const fetchCourses = createAsyncThunk('courses/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/courses');
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

const courseSlice = createSlice({
    name: 'courses',
    initialState: { courses: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCourses.pending, (state) => { state.loading = true; })
            .addCase(fetchCourses.fulfilled, (state, action) => { state.loading = false; state.courses = action.payload; })
            .addCase(fetchCourses.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
    },
});

export default courseSlice.reducer;
