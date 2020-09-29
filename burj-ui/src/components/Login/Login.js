import React, { useContext } from 'react';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import {UserContext} from '../../App';
import { useHistory, useLocation } from 'react-router-dom';
import { Button } from '@material-ui/core';
import './Login.css';

const Login = () => {
    const [signedInUser, setSignedInUser] = useContext(UserContext);
    const history = useHistory();
    const location = useLocation();

    const { from } = location.state || {from: {pathname: "/"} };

    if(firebase.apps.length === 0) {
        firebase.initializeApp(firebaseConfig); 
    }
    
    const googleSignIn = () => {
        
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function(result) {
            const {displayName, email} = result.user;
            const signedInUser = {name: displayName, email: email}
            setSignedInUser(signedInUser);
            history.replace(from);
          }).catch(function(error) {
            var errorMessage = error.message;
            console.log(errorMessage);
          });
    }
    return (
        <div className="login-btn">
            <Button onClick={googleSignIn} variant="contained" color="primary">
                Google Sign In
            </Button>
            {/* <h3>Email: {signedInUser.email}</h3>
            <h3>Name: {signedInUser.name}</h3> */}
        </div>
    );
};

export default Login;