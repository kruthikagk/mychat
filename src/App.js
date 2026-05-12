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

  const signInWithGoogle = () => {

    const provider = new firebase.auth.GoogleAuthProvider();

    auth.signInWithPopup(provider);

  };

  return (
    <div className="login">

      <h1>🔥 My Chat App</h1>

      <button onClick={signInWithGoogle}>
        Sign in with Google
      </button>

    </div>
  );
}

function ChatRoom() {

  const [formValue, setFormValue] = useState('');

  const messagesRef = firestore.collection('messages');

 
  const query =
  messagesRef
  .orderBy('createdAt', 'asc')
  .limit(50);

  const [messages] = useCollectionData(query, { idField: 'id' });
const sendMessage = async (e) => {

  e.preventDefault();

  if(formValue.trim() === ""){
    return;
  }

  const { uid, photoURL } =
    auth.currentUser;

  await messagesRef.add({

    text: formValue,

    createdAt:
      firebase.firestore.FieldValue.serverTimestamp(),

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
