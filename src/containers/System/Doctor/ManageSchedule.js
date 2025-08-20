import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import './ManageSchedule.scss';
import { FormattedMessage } from 'react-intl'
import Select from 'react-select';
import * as actions from '../../../store/actions';
import { dateFormat, LANGUAGES } from '../../../utils';
import DatePicker from '../../../components/Input/DatePicker';
import moment from 'moment';
import FormattedDate from '../../../components/Formating/FormattedDate';
import { toast } from 'react-toastify';
import _ from 'lodash';
import { saveBulkScheduleDoctor } from '../../../services/userService';

class ManageSchedule extends Component {

   constructor(props) {
      super(props);
      this.state = {
         // Define initial state if needed
         listDoctors: [],
         selectedDoctors: {},
         currentDate: '',
         rangeTime: []
      };
   }

   componentDidMount() {
      this.props.fetchAllDoctors();
      this.props.fetchAllScheduleTime();
   }

   buildDataInputSelect = (inputData) => {
      let result = [];
      let language = this.props.language;
      
      if(inputData && inputData.length > 0) {
         inputData.map((item, index) => {
            let object = {};
            let langVi = `${item.lastName} ${item.firstName}`;
            let langEn = `${item.firstName} ${item.lastName}`;

            object.label = language === LANGUAGES.VI ? langVi : langEn;
            object.value = item.id;
            
            result.push(object);
         })
      }

      return result;
   }
   
   componentDidUpdate(prevProps, prevState, snapshot) {
      if(prevProps.allDoctors !== this.props.allDoctors) {
         let data = this.buildDataInputSelect(this.props.allDoctors);
         this.setState({
            listDoctors: data
         })
      }
   
      if(prevProps.language !== this.props.language) {
         let data = this.buildDataInputSelect(this.props.allDoctors);
         this.setState({
            listDoctors: data
         })
      }

      if(prevProps.allScheduleTime !== this.props.allScheduleTime) {
         let data = this.props.allScheduleTime;

         if(data && data.length > 0) {
            data = data.map(item => ({...item, isSelected: false}));
         }

         this.setState({
            rangeTime: data
         })
      }
   }

   handleChangeSelect = (selectOption) => {
      this.setState({
         selectedDoctor: selectOption
      })
   }

   handleOnChangeDatePicker = (date) => {
      this.setState({
         currentDate: date[0]
      })
   }

   handleClickBtnTime = (time) => {
      let { rangeTime } = this.state;

      if(rangeTime && rangeTime.length > 0) {
         rangeTime = rangeTime.map(item => {
            if(item.id === time.id) item.isSelected = !item.isSelected;
            return item;
         })

         this.setState({
            rangeTime: rangeTime
         })
      }
   }

   handleSaveSchedule = async () => {
      let { rangeTime, selectedDoctor, currentDate } = this.state;
      let result = [];

      if(!selectedDoctor && _.isEmpty(selectedDoctor)) {
         toast.error('Please select a doctor');
         return;
      }
      if(!currentDate) {
         toast.error('Please select a date');
         return;
      }
      
      // let formateDate = moment(currentDate).format(dateFormat.SEND_TO_SERVER);
      let formateDate = new Date(currentDate).getTime();

      if(rangeTime && rangeTime.length > 0) {
         let selectedTime = rangeTime.filter(item => item.isSelected === true);
         
         if(selectedTime && selectedTime.length > 0) {
            selectedTime.map((time, index) => {
               let object = {};
               
               object.doctorId = selectedDoctor.value; // value, label
               object.date = formateDate;
               object.timeType = time.keyMap;

               result.push(object);
            })
         } else {
            toast.error('Please select a date');
            return;
         }
      }

      let res = await saveBulkScheduleDoctor({
         arrSchedule: result,
         doctorId: selectedDoctor.value,
         date: formateDate
      });  

      if(res && res.errorCode === 0) {
         toast.success('Save Infor succeed!');
      } else {
         toast.error('Save Infor error!');
      }
   }

   render() {
      // console.log('Check state', this.state);
      // console.log('Check props', this.props);

      let rangeTime = this.state.rangeTime;
      let language = this.props.language;
      let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));

      return (
         <div className='manage-schedule-container'>
            <div className='m-s-title'>
               <FormattedMessage id="manage-schedule.title" />
            </div>
            <div className='container'>
               <div className='row'>
                  <div className='col-6 form-group'>
                     <label><FormattedMessage id="manage-schedule.choose-doctor" /></label>
                     <Select 
                        options={this.state.listDoctors}
                        value={this.state.selectedDoctor}
                        onChange={this.handleChangeSelect}
                     />
                  </div>
                  <div className='col-6 form-group'>
                     <label><FormattedMessage id="manage-schedule.choose-date" /></label>
                     <DatePicker 
                        onChange={this.handleOnChangeDatePicker}
                        className='form-control'
                        value={this.state.currentDate}
                        minDate={yesterday}
                     />
                  </div>
                  <div className='col-12 pick-hour-container'>
                     {rangeTime && rangeTime.length > 0 &&
                        rangeTime.map((item, index) => {
                           return (
                              <button 
                                 className={item.isSelected === true ? 'btn btn-schedule active' : 'btn btn-schedule'} 
                                 key={index}
                                 onClick={() => this.handleClickBtnTime(item)} 
                              >
                                 {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                              </button>
                           )
                        })
                     }
                  </div>
                  <div className='col-12'>
                     <button 
                        className='btn btn-primary btn-save-schedule'
                        onClick={() => this.handleSaveSchedule()}
                     ><FormattedMessage id="manage-schedule.save" /></button>
                  </div>
               </div>
            </div>
         </div>
      );
   }
}

const mapStateToProps = state => {
   return {
      isLoggedIn: state.user.isLoggedIn,
      language: state.app.language,
      allDoctors: state.admin.allDoctors,
      allScheduleTime: state.admin.allScheduleTime
   };
};

const mapDispatchToProps = dispatch => {
   return {
      fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
      fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime())
   };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);