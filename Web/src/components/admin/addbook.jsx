import './addbook.css'
import { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import UploadPlaybar from '../playbar/upload_playbar.jsx';
import Playbar from '../playbar/playbar.jsx'
import { addAdminBook } from '../../api/bookAPI.js';
import { useAuth } from '../../Context';

const categories = ['fantasy', 'science_fiction', 'biographies', 'recipes', 
    'romance', 'textbooks', 'children', 'history', 'religion', 
    'mystery_and_detective_stories', 'plays', 'science'];

const categoryNamesMapping = {
    fantasy: 'Must Read',
    science_fiction: 'Science Fiction',
    biographies: 'Biographies',
    recipes: 'Recipes',
    romance: 'Romance Novels',
    textbooks: 'Textbooks',
    children: 'Children\'s Books',
    history: 'History & Culture',
    religion: 'Religion & Philosophy',
    mystery_and_detective_stories: 'Mystery & Detective',
    plays: 'Plays & Dramas',
    science: 'Science & Technology'
};

function Addbook({ onCancel, userId }){
    const [coverImageFile, setCoverImageFile] = useState(null);
    const [audioFile, setAudioFile] = useState(null);
    const [previewImageURL, setPreviewImageURL] = useState(null);
    const [previewAudioURL, setPreviewAudioURL] = useState(null);
    const [title, setTitle] = useState('');
    const [genre, setGenre] = useState('');
    const [description, setDescription] = useState('');
    const [coverImageChanged, setCoverImageChanged] = useState(false);
    const [audioFileChanged, setAudioFileChanged] = useState(false);
    
    // Get the current authenticated user info
    const { user } = useAuth();

    const handle_image_upload = (event) => {
        const file = event.target.files[0];
        if(file){
            setCoverImageFile(file);
            setPreviewImageURL(URL.createObjectURL(file));
            setCoverImageChanged(true);
        }
    };

    const handle_audio_upload = (event) => {
        const file = event.target.files[0];
        if(file){
            setAudioFile(file);
            setPreviewAudioURL(URL.createObjectURL(file));
            setAudioFileChanged(true);
        }
    };
    const navigate = useNavigate();
    const handleSubmit = async () => {
        if (!genre) {
            alert("Please select a genre.");
            return;
        }
        try {
          const formData = new FormData();
          formData.append('title', title);
          formData.append('genre', genre);
          formData.append('description', description);
          console.log('userId is ', userId, ' and user.id is ', user.id)
          if (!user.id) {
            console.error('No author ID available');
            return;
          }
         
          formData.append('authorId', user.id );
          
          if (coverImageChanged && coverImageFile) {
            formData.append('coverImage', coverImageFile);
          }
          if (audioFileChanged && audioFile) {
            formData.append('audioFile', audioFile);
          }
          await addAdminBook(formData);
          setCoverImageChanged(false);
          setAudioFileChanged(false);
          
          if (onCancel) {
            onCancel();
          } else {
            navigate('/admin');
          }
        } catch (error) {
          console.error('Submission failed ', error.message);
        }
      };
      
    const handleCancel = () => {
      if (onCancel) {
        onCancel();
      } else {
        navigate('/admin');
      }
    };
    
    return(
   
        <div className='form-bookk-wrapper'>
             <form className="form-bookk">
                <div className='image-container-bookk'>
                    <h2>
                        Upload book image
                    </h2>
                    {previewImageURL && <img src={previewImageURL} alt="Cover Image" />}
                    {!coverImageChanged && <input type='file' id='imageUpload' accept='image/*' onChange={handle_image_upload}/>}
                </div>
                <div className='content-container-bookk'>
                    <input className='add-field-input-bookk ' placeholder="e.g. Lord of The Ring" value={title}   onChange={(e) => setTitle(e.target.value)}/>
                    <select className='add-field-input-bookk book-genre-dropdown' value={genre} onChange={(e) => setGenre(e.target.value)} required>
                        <option value="">Select a genre</option>
                        {categories.map(category => (
                            <option key={category} value={category}>
                                {categoryNamesMapping[category]}
                            </option>
                        ))}
                    </select>
                    <textarea className='add-field-input-bookk ' placeholder="Book description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} rows="4"/>
                    {!audioFileChanged && <input type='file' id='audioUpload' accept='audio/mp3' onChange={handle_audio_upload}/>}
                    {previewAudioURL &&
                        <div>
                        <audio controls>
                            <source src={previewAudioURL} type='audio/mp3' />
                        </audio>
                        </div>
                    }
                    <br/>
                    <div className='buttons-div-bookk'>
                      <button type="button" className='createbook' disabled={!title || !genre || !coverImageFile || !audioFile} onClick={handleSubmit}>Create Book</button>
                      <button type="button" className="cancel-btn submit-btn-book" onClick={handleCancel}>Cancel</button>
                    </div>
                  
                    {/*I think since we need an author we can make the author the platform */}
                    {/* The duration should be automatically calculated, as well as the id */}
                </div>
            </form>
        </div>
        
    )
    
}

export default Addbook;