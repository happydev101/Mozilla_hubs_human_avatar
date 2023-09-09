import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import styles from "./LiveCaptionTextContainer.scss";
import axios from "axios";

export const LiveCaptionTextContainer = props => {
  const [captionTxt, setCaptionTxt] = useState("");
  const [speechTxt, setSpeechTxt] = useState("");
  // const [speaking, setSpeaking] = useState(false);
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  let timeoutId;

  const TextToSpeech = text => {
    const speech = new SpeechSynthesisUtterance();
    speech.text = text;
    return new Promise((resolve, reject) => {
      speech.onend = resolve;
      speech.onerror = reject;
      window.speechSynthesis.speak(speech);
    })
      .then(() => {
        // Speech synthesis completed
        console.log("Speech synthesis completed");
        recognition.start(); // Restart speech recognition after completion
      })
      .catch(error => {
        console.error("Error occurred during speech synthesis:", error);
      });
  };

  useEffect(() => {
    // Check if the browser supports the SpeechRecognition API
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      // Create a new SpeechRecognition instance
      // recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      // Set the continuous property to true to enable continuous speech recognition
      recognition.continuous = true;

      // Set the onresult event handler
      recognition.onresult = event => {
        if (event.results.length > 0) {
          console.log("--------------", event);
          const { transcript } = event.results[event.results.length - 1][0];
          setCaptionTxt(transcript);
          setSpeechTxt(transcript);
        }
      };

      // Set the onend event handler
      recognition.onend = () => {
        // Restart speech recognition after it ends
        recognition.start();
      };

      // Start speech recognition
      recognition.start();

      // Clean up the recognition instance on component unmount
      return () => {
        clearTimeout(timeoutId);
        recognition.stop();
      };
    } else {
      console.log("Speech recognition not supported");
    }
  }, []);

  useEffect(() => {
    axios
      .post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: captionTxt
            }
          ],
          temperature: 0.6,
          max_tokens: 100
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer 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`
          }
        }
      )
      .then(response => {
        setCaptionTxt(response.data.choices[0].message.content);
        TextToSpeech(response.data.choices[0].message.content);
        recognition.stop(); // Stop speech recognition while speaking
      });
  }, [speechTxt]);

  return (
    <div className={classNames(styles.caption_wrapper)}>
      <p className={classNames(styles.content)}>{captionTxt}</p>
    </div>
  );
};

LiveCaptionTextContainer.propTypes = {
  capturedText: PropTypes.string
};
