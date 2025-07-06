import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { emitter } from '../../utils/emitter';

class ModalUser extends Component {

   constructor(props) {
      super(props);
      this.state = {
         email: '',
         password: '',
         firstName: '',
         lastName: '',
         address: ''
      }
      this.listenToEmitter();
   }

   listenToEmitter = () => {
      emitter.on('EVENT_CLEAR_MODAL_DATA', () => {
         //reset
         this.setState({
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            address: ''
         })
      });
   }

   componentDidMount() {
      
   }

   toggle = () => {
      this.props.toggleFromParent();
   }

   handleOnChangeInput = (event, id) => {
      //bad code modify state
      // this.state[id] = event.target.value;
      // this.setState({
      //    ...this.state
      // }, () => {
      //    console.log('Check bad code', this.state);
      // })

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

   handleAddNewUser = () => {
      //validate
      let isValid = this.checkValidateInput();
      if(isValid === true) {
         // Call API create modal
         this.props.createNewUser(this.state);
      }
   }

   render() {
      // console.log(this.props.isOpen)
      return (
         <Modal 
            isOpen={this.props.isOpen} 
            toggle={() => {this.toggle()}} 
            className={'modal-user-container'}
         >
            <ModalHeader className='modal-title' toggle={() => {this.toggle()}}>Create a new user</ModalHeader>
            <ModalBody>
               <div className='modal-user-body'>
                  <div className='input-container'>
                     <label>Email</label>
                     <input value={this.state.email} type='text' onChange={(event) => {this.handleOnChangeInput(event, 'email')}} />
                  </div>     
                  <div className='input-container'>
                     <label>Password</label>
                     <input value={this.state.password} type='password' onChange={(event) => {this.handleOnChangeInput(event, 'password')}} />
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
               <Button color='primary' className='px-3' onClick={() => {this.handleAddNewUser()}}>Add new</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalUser);