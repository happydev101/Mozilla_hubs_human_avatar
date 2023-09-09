import React, { useEffect, useState } from "react";
import PropTypes, { func } from "prop-types";
import { Modal } from "../modal/Modal";
import { BackButton } from "../input/BackButton";
import { TextInputField } from "../input/TextInputField";
import { Column } from "../layout/Column";
import { FormattedMessage } from "react-intl";
import { Button, AcceptButton } from "../input/Button";
import styles from "./CustomLoginContent.scss";
import authService from "../../service/auth.service";
import HTTPService from "../../service/http.service";
import { beforeRead } from "@popperjs/core";
const STATE = {
  STATE_VERIFY_TOKEN: 0,
  STATE_LOGIN: 1,
  STATE_SIGNUP: 2,
  STATE_VERIFY_OTP: 3
};

export function CustomLoginModel({ className, onBack, onSuccess, ...rest }) {
  return (
    <Modal title="User Login" beforeTitle={<BackButton onClick={onBack} />} className={className}>
      <RenderForm onSuccess={onSuccess}></RenderForm>
    </Modal>
  );
}

export function RenderForm({ onSuccess, ...rest }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isMsg, setIsMsg] = useState(false);
  const [msg, setMsg] = useState("");
  const [authFlowState, setAuthFlowState] = useState(STATE.STATE_VERIFY_TOKEN);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");

  useEffect(() => {
    //step 1, check if already logged in earlier
    // setIsVerifOtp(false);
    return () => {};
  }, [isLoading]);
  function renderLoginPage() {
    return (
      <>
        <TextInputField
          disabled={false}
          label="Email"
          spellCheck="false"
          required
          onChange={e => {
            console.log("email changed", e.target.value);
            setEmail(e.target.value);
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
              .login({
                email: email
              })
              .then(data => {
                setAuthFlowState(STATE.STATE_VERIFY_OTP);
                setIsLoading(false);
              })
              .catch(err => {
                console.log("login failed", err);
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
          Login
        </Button>
        <Button
          type="button"
          preset="basic"
          onClick={() => {
            setAuthFlowState(STATE.STATE_SIGNUP);
          }}
        >
          <u>New User</u>
        </Button>
      </>
    );
  }
  function renderSignUpPage() {
    return (
      <>
        <TextInputField
          disabled={false}
          label="Name"
          spellCheck="false"
          required
          onChange={e => {
            console.log("name changed", e.target.value);
            setName(e.target.value);
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
          label="Email"
          spellCheck="false"
          required
          onChange={e => {
            console.log("email changed", e.target.value);
            setEmail(e.target.value);
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
              .signup({
                name: name,
                email: email
              })
              .then(data => {
                setAuthFlowState(STATE.STATE_VERIFY_OTP);
                setIsLoading(false);
                console.log("User Created Successfully", data);
              })
              .catch(err => {
                console.log("User Creation Error", err);
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
          Register
        </Button>
      </>
    );
  }
  function renderVerifyOTP() {
    return (
      <>
        <TextInputField
          disabled={false}
          label="OTP"
          spellCheck="false"
          required
          onChange={e => {
            console.log("otp changed", e.target.value);
            setOTP(e.target.value);
          }}
          // description={
          //   <FormattedMessage
          //     id="avatar-settings-content.display-name-description"
          //     defaultMessage="Alphanumerics, hyphens, underscores, and tildes. At least 3 characters, no more than 32"
          //   />
          // }
          // ref={ele_name_input}
        />

        <Button
          type="button"
          preset="basic"
          onClick={() => {
            console.log("otp", otp);
            setIsLoading(true);
            authService
              .verifyOTP({
                otp: otp,
                email: email
              })
              .then(data => {
                setIsLoading(false);
                setIsMsg(true);
                setMsg("User Verfied Successfully! Redirecting...");
                window.localStorage.setItem("Token", data.data.access_token);
                HTTPService.saveHeader({ key: "Authorization", value: `Bearer ${data.data.access_token}` });

                setTimeout(() => {
                  onSuccess();
                }, 3000);
                console.log("verify success", data);
              })
              .catch(err => {
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
          Verify OTP
        </Button>
      </>
    );
  }
  function renderVerifyToken() {
    let token = window.localStorage.getItem("Token");
    if (token === null || token.length === 0) {
      setAuthFlowState(STATE.STATE_LOGIN);
    } else {
      HTTPService.saveHeader({ key: "Authorization", value: `Bearer ${token}` });
      console.log("retrived token", token);
      authService
        .validateToken()
        .then(data => {
          onSuccess();
        })
        .catch(err => {
          setAuthFlowState(STATE.STATE_LOGIN);
        });
    }
    return <p>Verifing User..</p>;
  }
  function renderPage() {
    if (isLoading) {
      return <p>LOADING..</p>;
    } else if (isMsg) {
      return <p>{msg}</p>;
    }

    switch (authFlowState) {
      case STATE.STATE_VERIFY_TOKEN:
        return renderVerifyToken();
      case STATE.STATE_LOGIN:
        return renderLoginPage();
      case STATE.STATE_SIGNUP:
        return renderSignUpPage();
      case STATE.STATE_VERIFY_OTP:
        return renderVerifyOTP();
    }
  }
  return (
    <Column as="form" className={styles.content} {...rest}>
      {renderPage()}
    </Column>
  );
}
