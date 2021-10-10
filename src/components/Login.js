import React, {useState} from "react";
import {getUser, verifyUser} from "../data/repository";
import ErrorMessage from "./ErrorMessage";
import {emailPattern, userInfoErrorMessages} from "./Utils";
import {FormInputSection} from "./InputSections";

/** Login component that handles the login info and validates the inputs */
function Login(props) {
  const [fields, setFields] = useState({email: "", password: ""});
  const [errorMessage, setErrorMessage] = useState(null);
  const [isValidEmail, setIsValidEmail] = useState(true);

  //disable the submit button until valid info entered
  const submitDisabled = !(fields.email && fields.password && isValidEmail)

  // Generic change handler.
  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    // Copy fields.
    const temp = {...fields};

    // Update field and state.
    temp[name] = value;
    setFields(temp);
  };

  const validateEmail = () => fields.email
      ? setIsValidEmail(emailPattern.test(fields.email))
      : setIsValidEmail(true);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const user = await verifyUser(fields.email, fields.password);

    // If verified login the user.
    if (user !== null) {

      props.loginUser(getUser());

      //setActiveTab in navbar as profile since this is the next component to render
      props.setActiveNavTab("profile");

      // Navigate to the profile page.
      props.history.push("/profile");
      return;
    }

    // Reset password field to blank.
    const temp = {...fields};
    temp.password = "";
    setFields(temp);

    // Set error message.
    setErrorMessage(userInfoErrorMessages.loginErrorMessage);
  };

  return (
      <div className="formRow">
        <h1 className="formHeader">Login to your account</h1>
        <div className="form">
          <form onSubmit={handleSubmit}>
            <FormInputSection name={"email"} value={fields.email} handleInputChange={handleInputChange}
                              validate={validateEmail} placeHolderText={"Enter your email address"} label={"Email"}
                              isValid={isValidEmail} errorMessage={userInfoErrorMessages.emailFormatInvalid}
            />

            <FormInputSection name={"password"} value={fields.password} handleInputChange={handleInputChange}
                              placeHolderText={"Enter your password"} label={"Password"} isValid={true}
            />

            <div className="form-group">
              <input type="submit" className={submitDisabled ? "disabledButton" : "activeButton"} value="Login" disabled={submitDisabled}/>
            </div>
            {errorMessage !== null && <ErrorMessage errorMessage={errorMessage}/>}
          </form>
        </div>
      </div>
  );
}

export default Login;
