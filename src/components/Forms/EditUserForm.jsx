import React from 'react';
import './forms.scss'
import HR from '../../components/HR/HR'
import { MainButton } from '../Buttons/Buttons';
const EditUserForm = ({stateHandler, changeEmailHandler, changePasswordHandler, state}) => {
  return (
    <form className="form" >
      <div className="field-group">
        <label htmlFor="email" className="form-label">Email</label>
        <input type="email" className="form-input" placeholder="user@example.com" name="email" onChange={e => stateHandler(e)}/>
      </div>
      <div className="d-f jc-fe pb-">
        <MainButton
          value="Change Email"
          className="btn btn-green p-"
          onClick={changeEmailHandler}
          disabled={!state.email ? true : false}
        />
      </div>
      <HR />

      <div className="field-group">
        <label htmlFor="currentPasswowrd" className="form-label">Current Password</label>
        <input type="password" className="form-input" name="currentPassword" placeholder="Current Password" autoComplete="new-password" onChange={e => stateHandler(e)}/>
      </div>

      <div className="field-group">
        <label htmlFor="newPassword" className="form-label">New Password</label>
        <input type="password" className="form-input" name="newPassword" placeholder="New Password" autoComplete="new-password" onChange={e => stateHandler(e)}/>
      </div>

      <div className="field-group">
        <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
        <input type="password" className="form-input" name="confirmPassword" placeholder="Confirm New Password" autoComplete="new-password" onChange={e => stateHandler(e)}/>
      </div>

      <div className="d-f jc-fe ">
        <MainButton
          value="Change Password"
          className="btn btn-green p-"
          onClick={changePasswordHandler}
          disabled={!state.currentPassword ? true : false}
        />
      </div>
    </form>
  );
}

export default EditUserForm;
