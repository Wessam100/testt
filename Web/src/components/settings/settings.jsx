import { useState } from 'react';
import {Link } from 'react-router-dom';
import './settings.css'
import { deleteUser } from '../../api/userAPI';
import { useAuth } from '../../Context';
import { FaHome } from 'react-icons/fa';



export default function Settings() {
  const { user, logout } = useAuth(); //for the account delete
  const [isSideDetailsOpen, setIsSideDetailsOpen] = useState(false);

  const [ sure1, setSure1 ] = useState(false);
  const [ sure2, setSure2 ] = useState(false);
  const [ sure3, setSure3 ] = useState(false);
  const [ sure4, setSure4 ] = useState(false);
  const [ sure5, setSure5 ] = useState(false);

  const toggleSideDetails = () => {
    setIsSideDetailsOpen(!isSideDetailsOpen);
  };

  return (
    <div className="settings-container">
      <Link to='/homepage' className='settings-home-icon'>
        <FaHome />
      </Link>
        <h2 className='settext'>Settings</h2>
        <ul>
          <li className='editt'><Link to='/editprofile'>Edit account</Link></li>
       
        </ul> 
      <a className='delete-account' onClick={ () => {setSure1(true)}}>delete account</a>
      {sure1 &&
      <div>
        <h3>Are you sure?</h3>
        <button onClick={ () => {setSure2(true)}}>yes</button>
        <button onClick={ () => {setSure1(false)}}>no</button>
        {sure2 &&
          <div>
            <h3>Wait are you actually really sure?</h3>
            <button onClick={ () => {setSure3(true)}}>yes</button>
            <button onClick={ () => {setSure1(false)}}>no, nevermind</button>
            {sure3 &&
              <div>
                <h3>Did you ask you mom before you clicked?</h3>
                <button onClick={ () => {setSure4(true)}}>yes</button>
                <button onClick={ () => {setSure1(false)}}>she said no</button>
                {sure4 &&
                  <div>
                    <h3>Did I do something tayyeb?</h3>
                    <button onClick={ () => {setSure5(true)}}>yes, bye</button>
                    <button onClick={ () => {setSure1(false)}}>no I love you nvm sorry</button>
                    {sure5 &&
                    <div>
                      <h3>This is the last time or your account will be deleted FOREVER</h3>
                      <Link to='/' onClick={ () => {logout}}>
                              <button className='notcool' onClick={ () => { deleteUser(user.id)}}>yes, bye</button>
                      </Link>
                      <button onClick={ () => {setSure1(false)}}>OMG NO NOT MY ACCOUNT NVM, BACK, UNDO</button>
                    </div>
                    }
                  </div>
                }
                </div>
              }
            </div>
            
          }
        
        </div>
      }
     
    </div>
  );
}

