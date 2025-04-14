"use client";

import "../App.css";
import axios from "axios";
import { useEffect, useRef, useState, useCallback } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import startimg from "../image/loadprop.png";
import { useNavigate } from "react-router-dom";

function Conversation() {
  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true });

  const [start, setstart] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isUserClicked, setIsUserClicked] = useState(false);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const [inputval, setinputval] = useState(""); // Store the value of the input
  const [speak, setspeak] = useState(""); // Store the value to speak
  const navigate = useNavigate();

  // Track the last processed transcript to avoid duplication
  const lastProcessedTranscript = useRef("");
  // Track the auto-stop timer
  const autoStopTimerRef = useRef(null);

  const defaultVoice = window.speechSynthesis
    .getVoices()
    .find((voice) => voice.default);

  const speech = new SpeechSynthesisUtterance();

  useEffect(() => {
    window.speechSynthesis.onvoiceschanged = () => {
      const defaultVoice = window.speechSynthesis
        .getVoices()
        .find((voice) => voice.default);
      speech.voice = defaultVoice;
    };
  }, []);

  useEffect(() => {
    speech.text = speak;
    speech.voice = defaultVoice;

    speech.onstart = () => {
      setIsSpeaking(true);
    };

    speech.onend = () => {
      setIsSpeaking(false);
      if (isUserClicked) {
        // Reset transcript after response is spoken
        resetTranscript();
        lastProcessedTranscript.current = "";
        startListeningWithAutoStop();
      }
    };

    if (speak) {
      window.speechSynthesis.speak(speech);
    }
  }, [speak, defaultVoice, isUserClicked, resetTranscript]);

  const debounceTimerRef = useRef(null);

  // Function to start listening with auto-stop
  const startListeningWithAutoStop = useCallback(() => {
    // First make sure we're not already listening
    SpeechRecognition.stopListening();

    // Clear any existing timers
    if (autoStopTimerRef.current) {
      clearTimeout(autoStopTimerRef.current);
    }

    // Start listening
    startListening();
    setstart(true);

    // Set up the auto-stop timer
    resetAutoStopTimer();
  }, []);

  // Reset the auto-stop timer
  const resetAutoStopTimer = useCallback(() => {
    // Clear any existing timer
    if (autoStopTimerRef.current) {
      clearTimeout(autoStopTimerRef.current);
    }

    // Set a new timer for 4 seconds
    autoStopTimerRef.current = setTimeout(() => {
      if (listening) {
        console.log("No speech detected for 4 seconds. Auto-stopping...");

        // If there's something to process, do it
        if (transcript && transcript !== lastProcessedTranscript.current) {
          fetchdata();
        } else {
          // If nothing to process, just stop listening
          SpeechRecognition.stopListening();
          setstart(false);
        }
      }
    }, 4000);
  }, [transcript, listening]);

  // Fetch the response data from the server
  const fetchdata = useCallback(() => {
    if (!transcript || transcript === lastProcessedTranscript.current) {
      console.log("No new input to process");
      return;
    }

    // Clear the auto-stop timer
    if (autoStopTimerRef.current) {
      clearTimeout(autoStopTimerRef.current);
    }

    SpeechRecognition.stopListening();
    setstart(false);

    // Save current transcript to avoid reprocessing
    lastProcessedTranscript.current = transcript;

    // Set the current transcript as input value
    const currentInput = transcript.trim();
    setinputval(currentInput);

    const data = {
      value: currentInput,
    };

    console.log("Sending to server:", currentInput);

    axios
      .post("https://talktome-ujhx.onrender.com/talktome", data)
      .then((res) => {
        console.log("Response:", res.data);
        setspeak(res.data);
      })
      .catch((err) => console.log(err));
  }, [transcript]);

  useEffect(() => {
    // Only process if there's new transcript content
    if (transcript && transcript !== lastProcessedTranscript.current) {
      const currentTranscript = transcript.toLowerCase().trim();

      if (
        currentTranscript.includes("stop") ||
        currentTranscript.includes("stop this conversation")
      ) {
        stoplist();
        return;
      }

      // Reset the auto-stop timer whenever we get new speech
      resetAutoStopTimer();

      // Add timeout for debouncing the speech end event
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        fetchdata();
      }, 2500);
    }

    return () => {
      clearTimeout(debounceTimerRef.current);
    };
  }, [transcript, fetchdata, resetAutoStopTimer]);

  // Monitor listening state
  useEffect(() => {
    if (listening && start) {
      // Reset the auto-stop timer whenever listening state changes
      resetAutoStopTimer();
    }
  }, [listening, start, resetAutoStopTimer]);

  // Clean up timers when component unmounts
  useEffect(() => {
    return () => {
      clearTimeout(debounceTimerRef.current);
      clearTimeout(autoStopTimerRef.current);
    };
  }, []);

  // Clear input and reset transcript before starting new listening session
  function sayany() {
    setinputval(""); // Clear previous input
    resetTranscript(); // Reset transcript
    lastProcessedTranscript.current = ""; // Reset last processed transcript
    setIsUserClicked(true);
    startListeningWithAutoStop();
  }

  function stoplist() {
    window.speechSynthesis.cancel();
    setstart(false);
    setIsUserClicked(false);
    setinputval("");
    setspeak("");
    resetTranscript();
    lastProcessedTranscript.current = "";
    SpeechRecognition.stopListening();

    // Clear the auto-stop timer
    if (autoStopTimerRef.current) {
      clearTimeout(autoStopTimerRef.current);
    }

    navigate("/thank");
  }

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  return (
    <div
      style={{
        backgroundColor: "#15191F",
        height: "100vh",
        padding: "2%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
      className="App"
    >
      <h1 className="animated-title">𝕿𝖆𝖑𝖐 𝖙𝖔 𝖒𝖊</h1>

      {start ? (
        <img
          className="image imageone"
          src="https://cdn.dribbble.com/users/121337/screenshots/1309485/loading.gif"
          alt="loading"
        />
      ) : (
        <img
          className="image imagetwo"
          src={startimg || "/placeholder.svg"}
          alt="start"
        />
      )}

      <input
        style={{ visibility: "hidden" }}
        value={inputval}
        onChange={(e) => setinputval(e.target.value)}
      />

      <div className="btn-style">
        <button className="button" onClick={sayany} disabled={isSpeaking}>
          <b>Start Conversation</b>
        </button>
        <button className="button" onClick={stoplist}>
          <b>Stop Conversation</b>
        </button>
      </div>
    </div>
  );
}

export default Conversation;
