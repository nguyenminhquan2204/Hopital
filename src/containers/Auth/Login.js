import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
// import * as actions from "../store/actions";
import * as actions from "../../store/actions";
import './Login.scss';
import { FormattedMessage } from 'react-intl';
import { handleLoginApi } from '../../services/userService';

class Login extends Component {
   constructor(props) {
      super(props);
      this.state = {
         username: '',
         password: '',
         isShowPassword: false,
         errorMessage: ''
      }
   }

   handleOnChangeUsername = (event) => {
      this.setState({
         username: event.target.value,
      })
   }

   handleOnChangePassword = (event) => {
      this.setState({
         password: event.target.value,
      })
   }

   handleLogin = async () => {
      this.setState({
         errorMessage: ''
      })

      try {
         let data = await handleLoginApi(this.state.username, this.state.password);
         if(data && data.errorCode !== 0) {
            this.setState({
               errorMessage: data.message
            })
         }
         if(data && data.errorCode === 0) {
            this.props.userLoginSuccess(data.user);
         }
      } catch (error) {
         if(error.response) {
            if(error.response.data) {
               this.setState({
                  errorMessage: error.response.data.message
               })
            }
         }
      }      
   }

   handleShowHidePassword = () => {
      this.setState({
         isShowPassword: !this.state.isShowPassword
      })
   }

   render() {
      return (
         <div className='login-background'>
            <div className='login-container'>
               <div className='login-content row'>
                  <div className='col-12 text-login'>Login</div>
                  <div className='col-12 form-group login-input'>
                     <label>Username:</label>
                     <input 
                        value={this.state.username} 
                        placeholder='Enter your username' 
                        type='text' className='form-control'
                        name='email'
                        onChange={(event) => this.handleOnChangeUsername(event)}
                     />
                  </div>
                  <div className='col-12 form-group login-input'>
                     <label>Password:</label>
                     <div className='custom-input-password'>
                        <input 
                           name='password'
                           value={this.state.password} 
                           placeholder='Enter your password' 
                           type={this.state.isShowPassword ? 'text' : 'password'} 
                           className='form-control'
                           onChange={(event) => this.handleOnChangePassword(event)}
                        />
                        <span
                           onClick={() => this.handleShowHidePassword()}             
                        ><i className={this.state.isShowPassword ? 'far fa-eye' : 'far fa-eye-slash'}></i></span>
                     </div>
                  </div>
                  <div className='col-12' style={{ color: 'red' }}>
                     {this.state.errorMessage}
                  </div>
                  <div className='col-12'>
                     <button 
                        className='btn-login'
                        onClick={() => this.handleLogin()}
                     >Login</button>
                  </div>
                  <div className='col-12'>
                     <span className='forgot-password'>Forgot your password?</span>
                  </div>
                  <div className='col-12 text-center mt-3'>
                     <span className='text-other-login'>Or Login with:</span>
                  </div>
                  <div className='col-12 social-login'>
                     <i className='fab fa-google-plus-g google'></i>
                     <i className='fab fa-facebook-f facebook'></i>
                  </div>
               </div>
            </div>
         </div>
      )
   }
}

const mapStateToProps = state => {
   return {
      language: state.app.language
   };
};

const mapDispatchToProps = dispatch => {
   return {
      navigate: (path) => dispatch(push(path)),
      // userLoginFail: () => dispatch(actions.adminLoginFail()),
      userLoginSuccess: (userInfor) => dispatch(actions.userLoginSuccess(userInfor))
   };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
