import styles from './AddStoryPopup.module.css';
import Loader from '../../../svg/loader.jsx';
import { useDispatch, useSelector } from 'react-redux';

import CloseIcon from '../../../svg/CloseIcon.jsx';
import { SET_ADD_STORY_POPUP, SET_MAIN_LOADING } from '../../../redux/slice/mainSlice.js';
import { useEffect, useRef, useState } from 'react';
import { addStoryApi, updateStoryApi } from '../../../services/userService.js';
import toast from 'react-hot-toast';
import { SET_EDITING_STORY, SET_EDIT_MODE } from '../../../redux/slice/storySlice.js';

const initialSlide = {
	Heading: '',
	Description: '',
	ImageURL: '',
};

const AddStoryPopup = ({ setNewStoryAdded }) => {
	const dispatch = useDispatch();
	const { loading, categories } = useSelector((state) => state.main);
	const [closeButtonClicked, setCloseButtonClicked] = useState(false);
	const [slides, setSlides] = useState([initialSlide, initialSlide, initialSlide]);
	const [category, setCategory] = useState(categories[1]?.key); // default as the 1st index category from our category list.
	const [activeIndex, setActiveIndex] = useState(0);
	const [error, setError] = useState('');
	const formRef = useRef(null);
	const { user } = useSelector((state) => state.user);
	const { editMode, editingStory } = useSelector((state) => state.story);
	const { token } = user;


	const handleCloseButton = () => {
		if (editMode) {
			dispatch(SET_EDIT_MODE(false));
			dispatch(SET_EDITING_STORY({}));
		}
		setCloseButtonClicked(true);
		setTimeout(() => {
			dispatch(SET_ADD_STORY_POPUP(false));
		}, 300);
	};

	const handleAddNewSlide = () => {
		if (slides.length > 6) return;
		setSlides((prev) => [...prev, initialSlide]);
	};

	const handleRemoveSlide = (index) => {
		setSlides(slides.filter((_, i) => i !== index));
	};

	const handleSlideClicked = (index) => {
		setActiveIndex(index);
	};

	const previousButtonClicked = () => {
		setError('');
		if (activeIndex > 0) {
			setActiveIndex((prev) => prev - 1);
		}
	};
	const nextButtonClicked = () => {
		setError('');
		if (activeIndex < slides.length - 1) {
			setActiveIndex((prev) => prev + 1);
		}
	};

	const handleInputChange = (e) => {
		const { id, value } = e.target;
		setSlides((prevSlides) => {
			const updatedSlides = [...prevSlides];
			updatedSlides[activeIndex] = { ...prevSlides[activeIndex], [id]: value };
			return updatedSlides;
		});
	};
	const handleCategoryChange = (e) => {
		setCategory(e.target.value);
	};

	const postButtonClicked = () => {
		try {
			slides.forEach((slide, index) => {
				if (!slide.Heading) throw new Error(`Heading of slide ${index + 1} is required.`);
				if (!slide.Description)
					throw new Error(`Description of slide ${index + 1} is required.`);
				if (!slide.ImageURL) throw new Error(`ImageURL of slide ${index + 1} is required.`);
				if (!isValidURL(slide.ImageURL))
					throw new Error(`ImageURL of slide ${index + 1} is not valid.`);
			});
			if (!category) {
				throw new Error('Select an category.');
			}
			handleSubmit();
			setError('');
		} catch (error) {
			setError(error.message);
		}
	};

	const isValidURL = (url) => {
		return url.startsWith('https://') || url.startsWith('http://');
	};

	const handleSubmit = async () => {
		dispatch(SET_MAIN_LOADING(true));

		try {
			const values = { slides, category: category };
			if (editMode) {
				const storyId = editingStory._id;
				const response = await updateStoryApi({ storyId,values, token });
				toast.success('Story updated successfully.');
			} else {
				const response = await addStoryApi({ values, token });
				toast.success('Story created successfully.');
			}
			handleCloseButton();
			setNewStoryAdded(true);
		} catch (error) {
			toast.error(error.message);
		} finally {
			dispatch(SET_MAIN_LOADING(false));
		}
	};

	useEffect(() => {
		if (editMode && editingStory) {
			setCategory(editingStory.category);

			const slidesData = editingStory.slides.map((slide) => ({
				Heading: slide.Heading,
				Description: slide.Description,
				ImageURL: slide.ImageURL,
			}));
			setSlides(slidesData);
		}
	}, [editMode, editingStory]);

	return (
		<div
			className={`${styles.mainContainer} entryAnimation ${
				closeButtonClicked && 'exitAnimation'
			}`}
		>
			{/* container */}
			<div className={styles.container}>
				<div onClick={handleCloseButton}>
					<CloseIcon className={styles.CloseIcon} />
				</div>
				<div className={styles.innerContainer}>
					{/* Slides  */}
					<div className={styles.slideMessage}>Add upto 6 slides</div>
					<div className={styles.slideContainer}>
						{slides.map((slide, index) => (
							<div key={index}>
								<div
									onClick={() => handleSlideClicked(index)}
									className={`${styles.slide} ${
										index === activeIndex && styles.activeSlide
									}`}
								>
									{`Slide ${index + 1}`}
									{index > 2 && (
										<div
											onClick={() => handleRemoveSlide(index)}
											className={styles.slideCloseIcon}
										>
											<CloseIcon />
										</div>
									)}
								</div>
							</div>
						))}

						{slides.length < 6 && (
							<div onClick={handleAddNewSlide} className={styles.addButton}>
								Add +
							</div>
						)}
					</div>

					{/* form */}
					<form ref={formRef} onSubmit={handleSubmit} className={styles.formContainer}>
						<div className={styles.inputContainer}>
							<label className={styles.label} htmlFor='Heading'>
								Heading
							</label>
							<input
								placeholder='Heading'
								className={styles.input}
								type='text'
								id='Heading'
								autoFocus
								value={slides[activeIndex]?.Heading || ''}
								onChange={handleInputChange}
							/>
						</div>
						<div className={styles.inputContainer}>
							<label className={styles.label} htmlFor='Description'>
								Description
							</label>
							<textarea
								placeholder='Description'
								className={styles.textarea}
								id='Description'
								value={slides[activeIndex]?.Description || ''}
								onChange={handleInputChange}
							/>
						</div>
						<div className={styles.inputContainer}>
							<label className={styles.label} htmlFor='Image'>
								Image
							</label>
							<input
								placeholder='Image URL'
								className={styles.input}
								type='text'
								id='ImageURL'
								value={slides[activeIndex]?.ImageURL || ''}
								onChange={handleInputChange}
							/>
						</div>

						<div className={styles.inputContainer}>
							<label className={styles.label} htmlFor='Category'>
								Category
							</label>
							<select
								onChange={handleCategoryChange}
								className={styles.select}
								id='Category'
								value={category}
							
							>
								{categories.slice(1).map((category, index) => (
									<option
										className={styles.option}
										key={index}
										value={category.key}
										
									>
										{category.name}
									</option>
								))}
							</select>
						</div>
					</form>
				</div>

				<div>{error && <p className={styles.error}>{error}</p>}</div>
				{/* action Buttons */}
				<div className={styles.actionButtonContainer}>
					<div className={styles.prevNextButtonsContainer}>
						<button
							onClick={previousButtonClicked}
							className={`${styles.button} ${styles.previous}`}
							type='button'
						>
							Previous
						</button>
						<button
							onClick={nextButtonClicked}
							className={`${styles.button} ${styles.next}`}
							type='button'
						>
							Next
						</button>
					</div>

					<button
						onClick={postButtonClicked}
						className={`${styles.button} ${styles.post}`}
						type='button'
					>
						{loading === true ? <Loader /> : editMode ? 'Update' : 'Post'}
					</button>
				</div>
			</div>
		</div>
	);
};

export default AddStoryPopup;
