import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';  // Import the CSS file

const App = () => {
    const [query, setQuery] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [reviewForm, setReviewForm] = useState({
        recipe_name: '',
        score: '',
        difficulty: '',
        preparation_time: ''
    });

    const searchRecipes = (e) => {
        e.preventDefault();
        const EDAMAM_API_URL = 'https://api.edamam.com/api/recipes/v2';
        const EDAMAM_API_ID = '4b5694f0';
        const EDAMAM_API_KEY = '1427ecfbd1a97ee27249920f554c8279';

        axios.get(EDAMAM_API_URL, {
            params: {
                q: query,
                app_id: EDAMAM_API_ID,
                app_key: EDAMAM_API_KEY,
                type: 'public'
            }
        }).then(response => {
            setRecipes(response.data.hits);
        }).catch(err => {
            console.error(err);
        });
    };

    const fetchReviews = () => {
        axios.get('http://localhost:5000/')
            .then(response => {
                setReviews(response.data);
            })
            .catch(err => {
                console.error(err);
            });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setReviewForm({
            ...reviewForm,
            [name]: value
        });
    };

    const submitReview = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5000/', reviewForm)
            .then((response) => {
                setReviewForm({
                    recipe_name: '',
                    score: '',
                    difficulty: '',
                    preparation_time: ''
                });
                fetchReviews();
            })
            .catch(err => {
                console.error(err);
            });
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    return (
        <div className="container">
            <h1>Search Recipes</h1>
            <form onSubmit={searchRecipes}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter recipe name"
                />
                <button type="submit">Search</button>
            </form>

            <h2>Recipe Results</h2>
            <ul className="recipe-list">
                {recipes.map((recipe, index) => (
                    <li key={index}>
                        <strong>{recipe.recipe.label}</strong><br />
                        <img src={recipe.recipe.image} alt={recipe.recipe.label} className="recipe-img" /><br />
                        <a href={recipe.recipe.url} target="_blank" rel="noopener noreferrer">View Recipe</a>
                    </li>
                ))}
            </ul>

            <h1>Submit Recipe Review</h1>
            <form onSubmit={submitReview}>
                <label htmlFor="recipe_name">Recipe Name:</label>
                <input
                    type="text"
                    id="recipe_name"
                    name="recipe_name"
                    value={reviewForm.recipe_name}
                    onChange={handleInputChange}
                    required
                /><br /><br />
                <label htmlFor="score">Score:</label>
                <input
                    type="number"
                    id="score"
                    name="score"
                    value={reviewForm.score}
                    onChange={handleInputChange}
                    required
                /><br /><br />
                <label htmlFor="difficulty">Difficulty:</label>
                <input
                    type="text"
                    id="difficulty"
                    name="difficulty"
                    value={reviewForm.difficulty}
                    onChange={handleInputChange}
                    required
                /><br /><br />
                <label htmlFor="preparation_time">Preparation Time (minutes):</label>
                <input
                    type="number"
                    id="preparation_time"
                    name="preparation_time"
                    value={reviewForm.preparation_time}
                    onChange={handleInputChange}
                    required
                /><br /><br />
                <button type="submit">Submit</button>
            </form>

            <div className="reviews-section">
                <h1>All Reviews</h1>
                <ul>
                    {reviews.map((review) => (
                        <li key={review.id} className="review-card">
                            <h3>{review.recipe_name}</h3>
                            <p><strong>Score:</strong> {review.score}</p>
                            <p><strong>Difficulty:</strong> {review.difficulty}</p>
                            <p><strong>Preparation Time:</strong> {review.preparation_time} minutes</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default App;