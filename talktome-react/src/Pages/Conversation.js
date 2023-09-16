import '../App.css';
import axios from 'axios';
import { useEffect, useRef, useState, useCallback } from 'react'; // Import useCallback
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import startimg from "../image/loadprop.png"

function Conversation() {
  const startListening = () => SpeechRecognition.startListening({ continuous: true });
  const [start, setstart] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false); 
  const [isUserClicked, setIsUserClicked] = useState(false); 
  const { transcript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [inputval, setinputval] = useState(transcript || '');
  const [speak, setspeak] = useState('');

  const defaultVoice = window.speechSynthesis.getVoices().find(voice => voice.default);

  let speech = new SpeechSynthesisUtterance();

  useEffect(() => {
    window.speechSynthesis.onvoiceschanged = () => {
      const defaultVoice = window.speechSynthesis.getVoices().find(voice => voice.default);
      speech.voice = defaultVoice;
    };
  }, []);

  useEffect(() => {
    speech.text = speak;

    speech.voice = defaultVoice;

    speech.onstart = () => {
      setIsSpeaking(true);
    }
      
    speech.onend = () => {
      setIsSpeaking(false);
      if (isUserClicked) {
        startListening();
        setstart(true);
      }
    }

    window.speechSynthesis.speak(speech);
  }, [speak, defaultVoice, isUserClicked]);

  const debounceTimerRef = useRef(null);

  const fetchdata = useCallback(() => {
    if (inputval === '') {
      console.log('Need to communicate');
    } else {
      SpeechRecognition.stopListening();
      setstart(false);
      let data = {
        value: inputval,
      };
      axios
        .post('https://talktome-ujhx.onrender.com/talktome', data)
        .then((res) => {
          console.log(res.data);
          setspeak(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [inputval]);

  useEffect(() => {
    setinputval(transcript);
    clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      fetchdata();
    }, 3500);

    return () => {
      clearTimeout(debounceTimerRef.current);
    };
  }, [transcript, fetchdata]);

  function sayany() {
    setstart(true);
    setinputval('');
    setIsUserClicked(true);
    startListening();
  }

  function stoplist() {
    setstart(false);
    setIsUserClicked(false);
    setinputval('');
    setspeak('');
    SpeechRecognition.stopListening();
    window.speechSynthesis.cancel(); // Cancel speech synthesis
  }
  

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  return (
    <div style={{ backgroundColor: 'rgba(21,25,31,255)', height: '100vh', padding: '2%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} className="App">
      <h1 style={{ color: 'white', fontFamily: 'monospace', fontSize: '35px' }}><b>𝕿𝖆𝖑𝖐 𝖙𝖔 𝖒𝖊</b></h1>
      {start ? <img className='imageone' src="https://cdn.dribbble.com/users/121337/screenshots/1309485/loading.gif" alt="" /> : <img className='imagetwo' src={startimg} alt="" />}

      <input style={{ visibility: 'hidden' }} value={inputval} onChange={(e) => setinputval(e.target.value)}></input>

      <div className="btn-style">
        <button className='button' style={{ color: 'white', backgroundColor: 'grey', fontFamily: 'monospace', width: '150px', height: '40px' }} onClick={sayany} disabled={isSpeaking}><b>Start Conversation</b></button>
        <button className='button' style={{ color: 'white', backgroundColor: 'grey', fontFamily: 'monospace', width: '150px', height: '40px' }} onClick={stoplist}><b>Stop Conversation</b></button>
      </div>
    </div>
  );
}

export default Conversation;




// https://media3.giphy.com/media/QzdJer4CUPGheUFa1n/giphy.gif
// https://farm5.staticflickr.com/4876/39891228293_13c532f352_o.gif
// https://media2.giphy.com/media/jUJtNKKVTdIeD0XreN/giphy.gif?cid=790b7611242031e216d1fa871e586bcb2bbd0e3e2e14b8fd&rid=giphy.gif&ct=s