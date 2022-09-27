import React, { FunctionComponent } from 'react';
import { Outlet } from 'react-router-dom'
import { Typography, Link as MuiLink } from '@mui/material';
import Popup from './components/Popup';

function Copyright() {
  return (
    <Typography variant="body1" color="text.secondary" align="center">
      {'Copyright © '}
      <MuiLink color="inherit" href="https://twitter.com/FoobaFun">
        Crypto Sketches
      </MuiLink>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

interface LayoutProps {
  message: String|undefined;
  clearMessage: Function;
}

const Layout: FunctionComponent<LayoutProps> = ({message, clearMessage}) => {
  return (
    <>
      <div className="bg-image"/>
      <div id="App">
          <main id="page-wrapper" className='flex flex-col justify-between h-full p-5 text-center max-w-4xl'>
            <Outlet/>
            <Copyright/>
          </main>
          {message && <Popup
            content={<>
              <Typography variant="h6" component="p" className='my-2'>Information</Typography>
              <div dangerouslySetInnerHTML={{__html: `${message}`}}/>
            </>}
            handleClose={clearMessage}
          />}
      </div>
    </>
  );
};

export default Layout;