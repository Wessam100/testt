import SearchBar from '../searchbar/searchbar';
import './browsecategories.css'
import image1 from'../../assets/image1.jpg'
import image2 from'../../assets/image2.jpg'
import image3 from'../../assets/image3.jpg'
import image4 from'../../assets/image4.png'
import image5 from'../../assets/image5.png'
import image6 from'../../assets/image6.jpg'
import image7 from'../../assets/image7.jpg'
import image8 from'../../assets/image8.jpg'
import image9 from'../../assets/image9.jpg'
import image10 from'../../assets/image10.jpg'
import image11 from'../../assets/image11.jpg'
import image12 from'../../assets/image12.jpg'
import { FaArrowRight } from 'react-icons/fa';

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BrowseCategories() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();


  const categoryData = [
    { id: 'fantasy', name: 'Must Read', color: '#FF9AA2',image: image1},
    { id: 'science_fiction', name: 'Science Fiction', color: '#FFB7B2',image: image2 },
    { id: 'biographies', name: 'Biographies', color: '#FFDAC1',image: image3},
    { id: 'recipes', name: 'Recipes', color: '#E2F0CB',image: image4},
    { id: 'romance', name: 'Romance', color: '#B5EAD7',image: image5 },
    { id: 'textbooks', name: 'Textbooks', color: '#C7CEEA',image: image6 },
    { id: 'children', name: 'Children', color: '#F8B195',image: image7 },
    { id: 'history', name: 'History', color: '#F67280',image: image8},
    { id: 'religion', name: 'Philosophy', color: '#6C5B7B',image: image9},
    { id: 'mystery', name: 'Mystery', color: '#355C7D',image: image10 },
    { id: 'plays', name: 'Dramas', color: '#A8E6CE',image: image11},
    { id: 'science', name: 'Technology', color: '#DCEDC2',image: image12 }
  ];

  useEffect(() => {
    setCategories(categoryData);
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/browsecategories/${categoryId}`);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };


  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="categories-container">
          <button className="back-buttonnn-right" onClick={() => navigate(-1)}>
        <FaArrowRight/>
      </button>
      <div className="search-container">
        <SearchBar value={searchQuery} onChange={handleSearch} />
      </div>
  
      {searchQuery.trim() !== "" ? (
        <div className="search-results">
          <h3 className='searchres'>Search Results</h3>
          {filteredCategories.length > 0 ? (
            <div className="categories-grid">
              {filteredCategories.map((category) => (
                <div 
                  key={category.id} 
                  className="category-card"
                  style={{ backgroundColor: category.color }}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <div className="category-cont">
                  {category.image && (
                    <img 
                      src={category.image} 
                      className="category-img" 
                      alt={category.name} 
                    />
                  )} 
                  <h3 className='text'>{category.name}</h3>

                </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-results">No categories found sop sop :(</p>
          )}
        </div>
      ) : (
        <div className="categories-grid">
          {categories.map((category) => (
            <div 
              key={category.id} 
              className="category-card"
              style={{ backgroundColor: category.color }}
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="category-cont">
                {category.image && (
                  <img 
                    src={category.image} 
                    className="category-img" 
                    alt={category.name} 
                  />
                )}
                
                <h3 className='text'>{category.name}</h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 