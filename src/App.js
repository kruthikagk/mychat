import React, { useState } from 'react';

import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyCdTjvcA0vOezKjs56C5O71ZhTF2j7Uwbg",
  authDomain: "chat-c629a.firebaseapp.com",
  projectId: "chat-c629a",
  storageBucket: "chat-c629a.firebasestorage.app",
  messagingSenderId: "1082924679055",
  appId: "1:1082924679055:web:fc8f08d38c9a5713b155fa"
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">

      {user ? <ChatRoom /> : <SignIn />}

    </div>
  );
}



  function SignIn() {

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmObj, setConfirmObj] = useState(null);

  // SEND OTP
const sendOTP = async () => {

  try {

    if(phone === ""){
      alert("Enter phone number");
      return;
    }

    if(!window.recaptchaVerifier){

      window.recaptchaVerifier =
        new firebase.auth.RecaptchaVerifier(
          'recaptcha-container',
          {
            size: 'normal',
            callback: (response) => {
              console.log("Recaptcha verified");
            }
          }
        );

      await window.recaptchaVerifier.render();
    }

    const appVerifier = window.recaptchaVerifier;

    const confirmation =
      await auth.signInWithPhoneNumber(
        phone,
        appVerifier
      );

    setConfirmObj(confirmation);

    alert("OTP Sent");

  } catch(error) {

    console.log(error);

    alert(error.message);

  }
};
 

  

  // VERIFY OTP

  const verifyOTP = async () => {

    try {

      if(otp === ""){
        alert("Enter OTP");
        return;
      }

      await confirmObj.confirm(otp);

      alert("Login Successful");

    } catch(error) {

      console.log(error);

      alert("Invalid OTP");

    }
  };

  return (

    <div className="login">

      <h1>📱 My Chat App</h1>

      <input
        type="text"
        placeholder="+91xxxxxxxxxx"
        value={phone}
        onChange={(e)=>setPhone(e.target.value)}
      />

      <br /><br />

      <button onClick={sendOTP}>
        Send OTP
      </button>

      <br /><br />

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e)=>setOtp(e.target.value)}
      />

      <br /><br />

      <button onClick={verifyOTP}>
        Verify OTP
      </button>

      <div id="recaptcha-container"></div>

    </div>
  );
}


function ChatRoom() {

  const [formValue, setFormValue] = useState('');

  const messagesRef = firestore.collection('messages');

  const query = messagesRef.orderBy('createdAt').limit(50);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const sendMessage = async (e) => {

    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');
  };

  return (
    <>

      <header className="header">

        <div className="profile">

          <img
            src={auth.currentUser.photoURL}
            alt="profile"
          />

          <h3>{auth.currentUser.displayName}</h3>

        </div>

        <button onClick={() => auth.signOut()}>
          Logout
        </button>

      </header>

      <main>

        {messages &&
          messages.map(msg => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

      </main>

      <form onSubmit={sendMessage} className="form">

        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="Type message..."
        />

        <button type="submit">
          Send
        </button>

      </form>

    </>
  );
}

function ChatMessage(props) {

  const { text, uid, photoURL } = props.message;

  const messageClass =
    uid === auth.currentUser.uid
      ? 'sent'
      : 'received';

  return (
    <div className={`message ${messageClass}`}>

      <img src={photoURL} alt="user" />

      <p>{text}</p>

    </div>
  );
}

export default App;