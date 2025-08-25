import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import { postVerifyBookAppointment } from '../../services/userService';
import HomeHeader from '../HomePage/HomeHeader';
import './VerifyEmail.scss';

class VerifyEmail extends Component {

  constructor(props){
      super(props)

      this.state = { 
         statusVerify: false,
         errorCode: 0
      }
   }

   async componentDidUpdate(prevProps, prevState, snapshot) {

   }

   async componentDidMount() {
      if(this.props.location && this.props.location.search) {
         let urlParams = new URLSearchParams(this.props.location.search);
         let token = urlParams.get('token');
         let doctorId = urlParams.get('doctorId');
         let res = await postVerifyBookAppointment({
            token: token,
            doctorId: doctorId
         })

         if(res && res.errorCode === 0) {
            this.setState({
               statusVerify: true,
               errorCode: res.errorCode
            })
         } else {
            this.setState({
               statusVerify: true,
               errorCode: res && res.errorCode ? res.errorCode : -1
            })
         }
      }
   }

  render() {
   let {statusVerify, errorCode} = this.state;

   return (
      <>
         <HomeHeader />
         <div className='verify-email-container'>
            {statusVerify === false ?
               <div>Loading data ...</div>
               :
               <div>
                  {errorCode === 0 ?
                     <div className='infor-booking'>Xác nhận lịch hẹn thành công!</div>
                     :
                     <div className='infor-booking'>Lịch hẹn đã được xác nhận hoặc đã tồn tại!</div>
                  }
               </div>
            }
         </div>
      </>
   );
  }
}

const mapStateToProps = state => {
   return {
      language: state.app.language,

   };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail);
