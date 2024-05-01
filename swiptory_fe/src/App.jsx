import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import { Navigate } from 'react-router-dom';
import Loader from './components/Loader/Loader';
import Navbar from './components/Navbar/Navbar';
import HomePage from './pages/HomePage';
import ViewStoryPage from './pages/ViewStoryPage';
import BookmarkPage from './pages/BookMarkPage';
import LoginPopup from './components/Auth/Login/LoginPopup';
import RegisterPopup from './components/Auth/Register/RegisterPopup';
import { useCallback, useEffect, useState } from 'react';
import MobileNavbar from './components/Navbar/MobileNavbar/MobileNavbar';
import ViewStoryPopup from './components/Story/ViewStoryPopup/ViewStoryPopup';
import AddStoryPopup from './components/Story/AddStoryPopup/AddStoryPopup';
import { jwtDecode } from 'jwt-decode';
import './App.css';
import YourStoryPage from './pages/YourStoryPage.jsx';
import { SET_SESSION } from './redux/slice/userSlice.js';
import Footer from './components/Footer/Footer.jsx';

function App() {
	const [isSmallScreen, setIsSmallScreen] = useState(false);
	const [newStoryAdded, setNewStoryAdded] = useState(false);
	const { user } = useSelector((state) => state.user);
	const { token } = user;
	const dispatch = useDispatch();
	const { showLoginPopup, loading, showRegisterPopup, showViewStoryPopup, showAddStoryPopup } =
		useSelector((state) => state.main);

	const decodeToken = (token) => {
		return jwtDecode(token);
	};
	const handleIsTokenExpired = useCallback((token) => {
		const decodedToken = decodeToken(token);
		const expirationTime = decodedToken.exp;
		const currentTime = Math.floor(Date.now() / 1000);
		return expirationTime < currentTime;
	}, []);

	//for token expiry every minute
	useEffect(() => {
		const interval = setInterval(() => {
			if (token) {
				const session = handleIsTokenExpired(token);
				if (session) {
					dispatch(SET_SESSION(session));
					toast('Session Expired! Please log in again .', {
						style: {
							border: '1px solid #ff7373',
							color: '#ff7373',
						},
					});
				}
			}
		}, 50000); // To check token is valid or not every min.
		return () => clearInterval(interval);
	}, [token, dispatch, handleIsTokenExpired]);

	//for screen size
	useEffect(() => {
		const handleResize = () => {
			setIsSmallScreen(window.matchMedia('(max-width: 700px)').matches);
		};

		setIsSmallScreen(window.matchMedia('(max-width: 700px)').matches);
		window.addEventListener('resize', handleResize);

		// cleanup function to remove the event listener when component unmounts
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [setIsSmallScreen]);

	return (
		<>
			<Toaster
				toastOptions={{
					success: {
						iconTheme: {
							primary: '#73abff',
							secondary: 'white',
						},
						style: {
							color: '#73abff',
						},
					},
					error: {
						iconTheme: {
							primary: '#ff7373',
							secondary: 'white',
						},
						style: {
							color: '#ff7373',
						},
					},
				}}
			/>
			{loading ? <Loader /> : null}

			<div>
				<BrowserRouter>
					{showLoginPopup ? <LoginPopup /> : null}
					{showRegisterPopup ? <RegisterPopup /> : null}
					{showViewStoryPopup ? <ViewStoryPopup isSmallScreen={isSmallScreen} /> : null}
					{showAddStoryPopup ? (
						<AddStoryPopup setNewStoryAdded={setNewStoryAdded} />
					) : null}

					{isSmallScreen ? <MobileNavbar /> : <Navbar />}
					<Routes>
						<Route path='/bookmarks' element={<BookmarkPage  />} />
						<Route
							path='/your-story'
							element={
								isSmallScreen ? (
									<YourStoryPage newStoryAdded={newStoryAdded} />
								) : (
									<Navigate to='/' replace />
								)
							}
						/>
						<Route path='/view_story/:id' element={<ViewStoryPage />} />
						<Route
							path='/*'
							element={
								<HomePage
									newStoryAdded={newStoryAdded}
									isSmallScreen={isSmallScreen}
								/>
							}
						/>
					</Routes>
					{
						<Footer/>
					}
				</BrowserRouter>
			</div>
		</>
	);
}

export default App;
