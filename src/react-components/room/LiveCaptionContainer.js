import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
// import { LiveCaptionButtonContainer } from "./LiveCaptionButtonContainer";
import { ToolbarButton } from "../input/ToolbarButton";
import { FormattedMessage } from "react-intl";
import { ReactComponent as CaptionOnIcon } from "../icons/Caption.svg";
import { ReactComponent as CaptionOffIcon } from "../icons/CaptionOff.svg";
import { usePeopleList } from "./PeopleSidebarContainer";

export const LiveCaptionContainer = props => {
  const scene = document.querySelector("a-scene");
  const [previousPeopleList, setPreviousPeopleList] = useState([]);
  const peopleList = usePeopleList(props.presences, props.mySessionId);
  useEffect(() => {
    if (peopleList.length >= 1 && peopleList.length !== previousPeopleList.length) {
      scene.emit("action_toggle_AI_character", peopleList.length);
      props.onPeopleChange();
    }
    setPreviousPeopleList(peopleList);
  }, [peopleList]);

  return (
    <ToolbarButton
      preset="accent1"
      icon={props.captionenable ? <CaptionOnIcon /> : <CaptionOffIcon />}
      label={<FormattedMessage id="voice-button-container.label" defaultMessage="Caption" />}
      onClick={props.onClick}
    />
  );
};

LiveCaptionContainer.propTypes = {
  onClick: PropTypes.func.isRequired,
  captionenable: PropTypes.bool.isRequired,
  mySessionId: PropTypes.string.isRequired,
  presences: PropTypes.object.isRequired,
  onPeopleChange: PropTypes.func.isRequired
};
