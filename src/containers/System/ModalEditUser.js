import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { emitter } from '../../utils/emitter';
import _ from 'lodash';

class ModalEditUser extends Component {

   constructor(props) {
      super(props);
      this.state = {
         id: '',
         email: '',
         password: '',
         firstName: '',
         lastName: '',
         address: ''
      }
   }


   componentDidMount() {
      let user = this.props.currentUser;  
      if(user && !_.isEmpty(user)) {
         this.setState({
            id: user.id,
            email: user.email,
            password: 'abc',
            firstName: user.firstName,
            lastName: user.lastName,
            address: user.address
         })
      }
   }

   toggle = () => {
      this.props.toggleFromParent();
   }

   handleOnChangeInput = (event, id) => {
      //good code
      let copyState = {...this.state};
      copyState[id] = event.target.value;
      this.setState({
         ...copyState
      })
   }

   checkValidateInput = () => {
      let isValid = true;
      let arrInput = ['email', 'password', 'firstName', 'lastName', 'address'];
      for(let i = 0; i < arrInput.length; i++) {
         if(!this.state[arrInput[i]]) {
            isValid = false;
            alert('Missing parameter : ' + arrInput[i]);
            break;
         }
      }
      return isValid;
   }

   handleSaveUser = () => {
      //validate
      let isValid = this.checkValidateInput();
      if(isValid === true) {
         // Call API edit user
         this.props.editUser(this.state);
      }
   }

   render() {
      return (
         <Modal 
            isOpen={this.props.isOpen} 
            toggle={() => {this.toggle()}} 
            className={'modal-user-container'}
         >
            <ModalHeader className='modal-title' toggle={() => {this.toggle()}}>Edit a new user</ModalHeader>
            <ModalBody>
               <div className='modal-user-body'>
                  <div className='input-container'>
                     <label>Email</label>
                     <input disabled value={this.state.email} type='text' onChange={(event) => {this.handleOnChangeInput(event, 'email')}} />
                  </div>     
                  <div className='input-container'>
                     <label>Password</label>
                     <input disabled value={this.state.password} type='password' onChange={(event) => {this.handleOnChangeInput(event, 'password')}} />
                  </div>
                  <div className='input-container'>
                     <label>First name</label>
                     <input value={this.state.firstName} type='text' onChange={(event) => {this.handleOnChangeInput(event, 'firstName')}} />
                  </div>
                  <div className='input-container'>
                     <label>Last name</label>
                     <input value={this.state.lastName} type='text' onChange={(event) => {this.handleOnChangeInput(event, 'lastName')}} />
                  </div>
                  <div className='input-container max-width-input'>
                     <label>Address</label>
                     <input value={this.state.address} type='text' onChange={(event) => {this.handleOnChangeInput(event, 'address')}} />
                  </div>
               </div>
            </ModalBody>
            <ModalFooter>
               <Button color='primary' className='px-3' onClick={() => {this.handleSaveUser()}}>Save changes</Button>
               <Button color='secondary' className='px-3' onClick={() => this.toggle()}>Close</Button>
            </ModalFooter>
         </Modal>
      )
   }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditUser);