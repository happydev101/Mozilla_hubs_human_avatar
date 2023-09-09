import React, { useEffect, useState } from "react";
import PropTypes, { func } from "prop-types";
import { Modal } from "../modal/Modal";
import { BackButton } from "../input/BackButton";
import { TextInputField } from "../input/TextInputField";
import { Column } from "../layout/Column";
import { FormattedMessage } from "react-intl";
import { Button, AcceptButton } from "../input/Button";
import styles from "./SuggestionBoxContent.scss";
import authService from "../../service/auth.service";
import HTTPService from "../../service/http.service";
import { beforeRead } from "@popperjs/core";
const STATE = {
  STATE_VERIFY_TOKEN: 0,
  STATE_LOGIN: 1,
  STATE_SIGNUP: 2,
  STATE_VERIFY_OTP: 3
};

export function SuggestionBoxModel({ className, onBack, onSuccess, ...rest }) {
  return (
    <Modal title="Suggestion" beforeTitle={<BackButton onClick={onBack} />} className={className}>
      <RenderForm onSuccess={onSuccess}></RenderForm>
    </Modal>
  );
}

export function RenderForm({ onSuccess, ...rest }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isMsg, setIsMsg] = useState(false);
  const [msg, setMsg] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    //step 1, check if already logged in earlier
    // setIsVerifOtp(false);
    return () => {};
  }, [isLoading]);

  function renderPage() {
    if (isLoading) {
      return <p>LOADING..</p>;
    } else if (isMsg) {
      return <p>{msg}</p>;
    }

    return (
      <>
        <TextInputField
          disabled={false}
          label="Title"
          spellCheck="false"
          required
          onChange={e => {
            // console.log("email changed", e.target.value);
            setTitle(e.target.value);
          }}
          // description={
          //   <FormattedMessage
          //     id="avatar-settings-content.display-name-description"
          //     defaultMessage="Alphanumerics, hyphens, underscores, and tildes. At least 3 characters, no more than 32"
          //   />
          // }
        />
        <TextInputField
          disabled={false}
          label="Suggestion"
          spellCheck="false"
          required
          onChange={e => {
            // console.log("email changed", e.target.value);
            setSuggestion(e.target.value);
          }}
          // description={
          //   <FormattedMessage
          //     id="avatar-settings-content.display-name-description"
          //     defaultMessage="Alphanumerics, hyphens, underscores, and tildes. At least 3 characters, no more than 32"
          //   />
          // }
        />
        <Button
          type="button"
          preset="basic"
          onClick={() => {
            setIsLoading(true);
            authService
              .suggestion({
                title: title,
                description: suggestion,
                suggestion_id: 0
              })
              .then(data => {
                setIsLoading(false);
                setIsMsg(true);
                setMsg("Suggestion added successfully !");
                setTimeout(() => {
                  setIsMsg(false);
                  setMsg("");
                  onSuccess();
                }, 3000);
              })
              .catch(err => {
                console.log("suggestion failed", err);
                setIsLoading(false);
                setIsMsg(true);
                setMsg(err.message);
                setTimeout(() => {
                  setIsMsg(false);
                  setMsg("");
                }, 3000);
              });
          }}
        >
          Submit
        </Button>
      </>
    );
  }
  return (
    <Column as="form" className={styles.content} {...rest}>
      {renderPage()}
    </Column>
  );
}
