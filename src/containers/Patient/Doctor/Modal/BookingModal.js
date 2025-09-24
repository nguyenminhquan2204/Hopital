import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './BookingModal.scss';
import { Modal } from 'reactstrap';
import ProfileDoctor from '../ProfileDoctor';
import _ from 'lodash';
import DatePicker from '../../../../components/Input/DatePicker';
import * as actions from '../../../../store/actions';
import { LANGUAGES } from '../../../../utils';
import Select from 'react-select';
import {postPatientBookAppointment} from '../../../../services/userService';
import {toast} from 'react-toastify';
import moment from 'moment';
import NumberFormat from 'react-number-format';
// import _ from 'lodash';
import localization from 'moment/locale/vi';

class BookingModal extends Component {

  constructor(props){
      super(props)

      this.state = { 
         fullName: '',
         phoneNumber: '',
         email: '',
         address: '',
         reason: '',
         birthday: '',
         doctorId: '',
         genders: '',
         selectedGender: '',
         timeType: ''
      }
   }

   buildDataGender = (data) => {
      let result = [];
      let language = this.props.language;

      if(data && data.length > 0) {
         data.map(item => {
            let object = {};
            object.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
            object.value = item.keyMap;
            result.push(object);
         })
      }
      return result;
   }

   async componentDidUpdate(prevProps, prevState, snapshot) {
      if(this.props.genders !== prevProps.genders) {
         this.setState({
            genders: this.buildDataGender(this.props.genders)
         })
      }
      if(this.props.language !== prevProps.language) {
         this.setState({
            genders: this.buildDataGender(this.props.genders)
         })
      }
      if(this.props.dataScheduleTimeModal !== prevProps.dataScheduleTimeModal) {
         if(this.props.dataScheduleTimeModal && !_.isEmpty(this.props.dataScheduleTimeModal)) {
            this.setState({
               doctorId: this.props.dataScheduleTimeModal.doctorId,
               timeType: this.props.dataScheduleTimeModal.timeType
            })
         }
      }
   }

   async componentDidMount() {
      this.props.getGenders();
   }

   hanldeOnChangeInput = (event, id) => {
      let valueInput = event.target.value;
      let stateCopy = {...this.state};

      stateCopy[id] = valueInput;
      this.setState({
         ...stateCopy
      })
   }

   hanldeOnChangeDatePicker = (date) => {
      this.setState({
         birthday: date[0]
      })
   }

   handleChangeSelect = (selectedOption) => {
      this.setState({
         selectedGender: selectedOption
      })
   }

   buildTimeBooking = (dataTime) => {
      let {language} = this.props;

      if(dataTime && !_.isEmpty(dataTime)) {
         let date = language === LANGUAGES.VI ? moment.unix(+dataTime.date/1000).format('dddd - DD/MM/YYYY') : moment.unix(+dataTime.date/1000).locale('en').format('ddd - MM/DD/YYYY')
         let time = language === LANGUAGES.VI ? dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn;
         
         return `${time} - ${date}`;
      }
      return ''
   }

   buildDoctorName = (dataTime) => {
      let {language} = this.props;

      if(dataTime && !_.isEmpty(dataTime)) {
         let name = language === LANGUAGES.VI ?
            `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`
            : `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`;

         return name;
      }
      return '';
   }

   hanldeConfirmBooking = async () => {
      // console.log('aaaaaaa', this.state);
      let birthday = new Date(this.state.birthday).getTime();
      let timeString = this.buildTimeBooking(this.props.dataScheduleTimeModal);
      let doctorName = this.buildDoctorName(this.props.dataScheduleTimeModal);

      let res = await postPatientBookAppointment({
         fullName: this.state.fullName,
         phoneNumber: this.state.phoneNumber,
         email: this.state.email,
         address: this.state.address,
         reason: this.state.reason,
         date: this.props.dataScheduleTimeModal.date,
         birthday: birthday,
         doctorId: this.state.doctorId,
         selectedGender: this.state.selectedGender.value,
         timeString: timeString,
         timeType: this.state.timeType,
         language: this.props.language,
         doctorName: doctorName
      })

      if(res && res.errorCode === 0) {
         toast.success("Booking a new successful!");
         this.props.closeBookingModal();
      } else {
         toast.error("Booking a new error!");
      }
   }

  render() {
   let {isOpenModal, closeBookingModal, dataScheduleTimeModal} = this.props;
   let doctorId = '';

   if(dataScheduleTimeModal && !_.isEmpty(dataScheduleTimeModal)) {
      doctorId = dataScheduleTimeModal.doctorId
   }

   return (
      <Modal 
         isOpen={isOpenModal} 
         className='booking-modal-container'
         size='lg'
         centered
      >
         <div className='booking-modal-content'>
            <div className='booking-modal-header'>
               <span className='left'><FormattedMessage id="patient.booking-modal.title" /></span>
               <span onClick={closeBookingModal} className='right'><i className='fas fa-times'></i></span>
            </div>
            <div className='booking-modal-body'>
               {/* {JSON.stringify(dataScheduleTimeModal)} */}
               <div className='doctor-infor'>
                  <ProfileDoctor 
                     doctorId={doctorId}
                     isShowDescriptionDoctor={false}
                     dataTime={dataScheduleTimeModal}
                     isShowLinkDetail={false}
                     isShowPrice={true}
                  />
               </div>
               <div className='row'>
                  <div className='col-6 form-group'>
                     <label><FormattedMessage id="patient.booking-modal.fullName" /></label>
                     <input 
                        className='form-control'
                        value={this.state.fullName}
                        onChange={(event) => this.hanldeOnChangeInput(event, 'fullName')}   
                     />
                  </div>
                  <div className='col-6 form-group'>
                     <label><FormattedMessage id="patient.booking-modal.phoneNumber" /></label>
                     <input 
                        className='form-control'
                        value={this.state.phoneNumber}
                        onChange={(event) => this.hanldeOnChangeInput(event, 'phoneNumber')}   
                     />
                  </div>
                  <div className='col-6 form-group'>
                     <label><FormattedMessage id="patient.booking-modal.email" /></label>
                     <input 
                     className='form-control'
                        value={this.state.email}
                        onChange={(event) => this.hanldeOnChangeInput(event, 'email')}   
                     />
                  </div>
                  <div className='col-6 form-group'>
                     <label><FormattedMessage id="patient.booking-modal.address" /></label>
                     <input 
                        className='form-control'
                        value={this.state.address}
                        onChange={(event) => this.hanldeOnChangeInput(event, 'address')}   
                     />
                  </div>
                  <div className='col-12 form-group'>
                     <label><FormattedMessage id="patient.booking-modal.reason" /></label>
                     <input 
                        className='form-control'
                        value={this.state.reason}
                        onChange={(event) => this.hanldeOnChangeInput(event, 'reason')}
                     />
                  </div>
                  <div className='col-6 form-group'>
                     <label><FormattedMessage id="patient.booking-modal.birthday" /></label>
                     <DatePicker 
                        onChange={this.hanldeOnChangeDatePicker}
                        className='form-control'
                        value={this.state.birthday}
                     />
                  </div>
                  <div className='col-6 form-group'>
                     <label><FormattedMessage id="patient.booking-modal.gender" /></label>
                     <Select 
                        value={this.state.selectedGender}
                        options={this.state.genders}
                        onChange={this.handleChangeSelect}
                     />
                  </div>
               </div>
            </div>
            <div className='booking-modal-footer'>
               <button onClick={() => this.hanldeConfirmBooking()} className='btn-booking-confirm'><FormattedMessage id="patient.booking-modal.btnConfirm" /></button>
               <button onClick={closeBookingModal} className='btn-booking-cancel'><FormattedMessage id="patient.booking-modal.btnCancel" /></button>
            </div>
         </div>
      </Modal>
   );
  }
}

const mapStateToProps = state => {
   return {
      language: state.app.language,
      genders: state.admin.genders,

   };
};

const mapDispatchToProps = dispatch => {
   return {
      // createBooking: (data) => dispatch(actions.createBooking(data)),
      getGenders: () => dispatch(actions.fetchGenderStart())
   };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
