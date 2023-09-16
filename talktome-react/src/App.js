import './App.css';
import axios from 'axios';
import { useEffect, useRef, useState, useCallback } from 'react'; // Import useCallback
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import startimg from "./image/loadprop.png"
function App() {
  const startListening = () => SpeechRecognition.startListening({ continuous: true, language: 'eng-IN' });
  const [start,setstart]=useState(false)
  const { transcript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [inputval, setinputval] = useState(transcript || '');
  const [speak, setspeak] = useState('');
  const [voices, setvoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(4); // Initialize with the first voice

  let speech = new SpeechSynthesisUtterance();

  useEffect(() => {
    window.speechSynthesis.onvoiceschanged = () => {
      setvoices(window.speechSynthesis.getVoices());
    };
  }, []);

  useEffect(() => {
    speech.text = speak;
    speech.voice = voices[selectedVoice]; // Update the voice when selectedVoice changes
    window.speechSynthesis.speak(speech);
  }, [speak, voices, selectedVoice]);

  const debounceTimerRef = useRef(null);

  const fetchdata = useCallback(() => {
    if (inputval === '') {
      console.log('Need to communicate');
    } else {
      SpeechRecognition.stopListening();
      setstart(false)
      let data = {
        value: inputval,
      };
      axios
        .post('http://localhost:2500/talktome', data)
        .then((res) => {
          console.log(res.data);
          setspeak(res.data);
          // handlespeak(res.data); // No longer needed here
        })
        .catch((err) => console.log(err));
    }
  }, [inputval]);

  useEffect(() => {
    setinputval(transcript);

    // Clear the previous debounce timer
    clearTimeout(debounceTimerRef.current);

    // Set a new debounce timer to execute fetchdata after 7 seconds of no changes
    debounceTimerRef.current = setTimeout(() => {
      fetchdata(); // Use the fetchdata function here
    }, 3500);

    return () => {
      // Cleanup: clear the debounce timer on component unmount
      clearTimeout(debounceTimerRef.current);
    };
  }, [transcript, fetchdata]);

  function sayany() {
    setstart(true)
    setinputval('');
    startListening();
  }

  function stoplist(){
    setstart(false)
    SpeechRecognition.stopListening()
  }

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  return (
    <div style={{backgroundColor:'rgba(21,25,31,255)',height:'100vh',padding:'2%',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}} className="App">
      <h1 style={{color:'white',fontFamily:'monospace',fontSize:'35px'}}><b>𝕿𝖆𝖑𝖐 𝖙𝖔 𝖒𝖊</b></h1>
      {start?<img className='imageone'  src="https://cdn.dribbble.com/users/121337/screenshots/1309485/loading.gif"   alt=""/>:<img  className='imagetwo' src={startimg}   alt=""/>}
      
      <input style={{visibility:'hidden'}} value={inputval} onChange={(e) => setinputval(e.target.value)}></input>

      <div  className="btn-style">
        <button className='button' style={{color:'white',backgroundColor:'grey',fontFamily:'monospace',width:'150px',height:'40px'}} onClick={sayany}><b>Start Conversation</b></button>
        <button className='button' style={{color:'white',backgroundColor:'grey',fontFamily:'monospace',width:'150px',height:'40px'}} onClick={stoplist}><b>Stop Conversation</b></button>
        </div>
        <div style={{position:'absolute',top:'1%',left:'1%'}}>
        <select className='button'  style={{color:'white',backgroundColor:'grey',width:'300px',height:'35px',fontFamily:'monospace',fontWeight:'700'}} value={selectedVoice} onChange={(e) => setSelectedVoice(e.target.value)}>
          {voices.map((voi, i) => (
            <option key={i} value={i}>
              {voi.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default App;



// https://media3.giphy.com/media/QzdJer4CUPGheUFa1n/giphy.gif
// https://farm5.staticflickr.com/4876/39891228293_13c532f352_o.gif
// https://media2.giphy.com/media/jUJtNKKVTdIeD0XreN/giphy.gif?cid=790b7611242031e216d1fa871e586bcb2bbd0e3e2e14b8fd&rid=giphy.gif&ct=s