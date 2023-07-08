import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Pages } from '../../constants';
import { HeaderLayout } from '../layout/header-layout';
import { IUserDTO } from '../../types';
import { fetchPost } from '../../utils';


const LoginPage: React.FunctionComponent = () => {
  const [displayValidMessage, setDisplayValidMessage] = useState('none');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLoginClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    if (login.length < 4 || password.length < 4) {
      return;
    }

    const user = await fetchPost<IUserDTO | null>({
      url:'api/login',
      method: 'POST',
      default: null,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        login: login,
        password: password,
      }),
    });
    if (user){
      localStorage.setItem('Token', user.token);
      localStorage.setItem('UserName', user.name);
      localStorage.setItem('AccessLevel', user.accessLevel.toString());
      navigate(Pages.PROFILE);
    } else {
      setDisplayValidMessage('block');
    }
  }

  return (
    <>
      <HeaderLayout />

      <main className="w4-main">
        <form className='w4-flex w4-flex-column w4-container w4-margin-center w4-margin-top' style={{maxWidth: '300px'}}>
          <h2 className='w4-margin-bottom'>SIGN IN</h2>
          <input 
            className='w4-input w4-margin-bottom' 
            placeholder='Enter login' 
            type='text'
            onChange={(e) => setLogin(e.target.value)}
          />
          <input 
            className='w4-input w4-margin-bottom' 
            placeholder='Enter password' 
            type='password'
            autoComplete='on'
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className='w4-button w4-button-primary w4-button-login' onClick={(e) => handleLoginClick(e)}>
            Sign In
          </button>
          <p style={{display: displayValidMessage}}>
            Login or password are not valid.
          </p>
        </form>
      </main>
    </>
  )
}

export default LoginPage;
