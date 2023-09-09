import React from "react";
import PropTypes from "prop-types";
import { ToolbarButton } from "../input/ToolbarButton";
import { FormattedMessage } from "react-intl";
import { ReactComponent as SpeechRecognize } from "../icons/SpeechRecognize.svg";

export const SpeechRecognition = props => {

  return (
    <ToolbarButton
      preset="accent2"
      icon={<SpeechRecognize />}
      label={<FormattedMessage id="voice-button-container.label" defaultMessage="Speech" />}
      onMouseDown={props.onMouseDown}
      onMouseUp={props.onMouseUp}
    />
  );
};

SpeechRecognition.propTypes = {
  onMouseDown: PropTypes.func.isRequired,
  onMouseUp: PropTypes.func.isRequired,
  speechRecognitionEnable: PropTypes.bool.isRequired
};
