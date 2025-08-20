import React, { Component } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../../HomePage/HomeHeader';
import './DoctorSchedule.scss';
import { getDetailInforDoctor } from '../../../services/userService';
import { LANGUAGES } from '../../../utils/constant';
import localization from 'moment/locale/vi';
import moment from 'moment';
import {getScheduleDoctorByDate} from '../../../services/userService';
import { FormattedMessage } from 'react-intl';

class DoctorSchedule extends Component {

  constructor(props){
    super(props)

    this.state = {
      allDays: [],
      allAvalableTime: []
    }
  }

  getArrDays = () => {
      let { language } = this.props;
      let arrDate = [];

      for (let i = 0; i < 7; i++) {
         let object = {}
         if(language === LANGUAGES.VI) {
            if(i === 0) {
               let ddMM = moment(new Date()).format('DD/MM');
               let today = `Hôm nay - ${ddMM}`;
               object.label = today; 
            } else {
               let labelVi = moment(new Date()).add(i,'days').format('dddd - DD/MM');
               object.label = this.capitalizeFirstLetter(labelVi);
            }
         } else {
            if(i === 0) {
               let ddMM = moment(new Date()).format('DD/MM');
               let today = `Today - ${ddMM}`;
               object.label = today; 
            } else {
               object.label = moment(new Date()).add(i,'days').locale('en').format('ddd - DD/MM');
            }
         }
         object.value = moment(new Date()).add(i,'days').startOf('day').valueOf();
         arrDate.push(object);
      }

      return arrDate;
  }

  capitalizeFirstLetter = (string) => {
      return string.charAt(0).toUpperCase() + string.slice(1);
  }

   async componentDidMount() {
      let allDays = this.getArrDays();
      
      if(allDays && allDays.length > 0) {
         // let res = await getScheduleDoctorByDate(this.props.doctorIdFromParent, allDays[0].value);

         this.setState({
            allDays: allDays,
         })
      }
   }


  async componentDidUpdate(prevProps, prevState, snapshot) {
      if(this.props.language !== prevProps.language) {
         let allDays = this.getArrDays();
         this.setState({
            allDays: allDays
         })
      }
      if(this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
         let allDays = this.getArrDays();
         let res = await getScheduleDoctorByDate(this.props.doctorIdFromParent, allDays[0].value);
         this.setState({
            allAvalableTime: res.data ? res.data : []
         })
      }
  }

  handleOnChangeSelect = async (event) => {
      if(this.props.doctorIdFromParent && this.props.doctorIdFromParent !== -1) {
         let doctorId = this.props.doctorIdFromParent;;
         let date = event.target.value;
         let res = await getScheduleDoctorByDate(doctorId, date);
         // console.log('Check response', res);

         if(res && res.errorCode === 0)  {
            this.setState({
               allAvalableTime: res.data ? res.data : []
            })
         }
      }
  }

  render() {
   let { allDays, allAvalableTime } = this.state;
   let {language} = this.props;

   return (
      <div className='doctor-schedule-container'>
         <div className='all-schedule'>
            <select onChange={(event) => this.handleOnChangeSelect(event)}>
               {allDays && allDays.length > 0 && 
                  allDays.map((item, index) => {
                     return (
                        <option value={item.value} key={index}>{item.label}</option>
                     )
                  })
               }
            </select>
         </div>
         <div className='all-available-time'>
            <div className='text-calendar'>
               <span><i className='fas fa-calendar-alt'><span><FormattedMessage id="patient.detail-doctor.schedule"/></span></i></span>
            </div>
            <div className='time-content'>
               {allAvalableTime && allAvalableTime.length > 0 ?
                  <>
                     <div className='time-content-btns'>
                        {allAvalableTime.map((item, index) => {
                           let timeDisplay = language === LANGUAGES.VI ? item.timeTypeData.valueVi : item.timeTypeData.valueEn;

                           return (
                              <button
                                 key={index}
                                 className={language === LANGUAGES.VI ? 'btn-vi' : 'btn-en'}>
                                 {timeDisplay}
                              </button>
                           );
                        })}
                     </div>
                     <div className='book-free'>
                        <span><FormattedMessage id="patient.detail-doctor.choose"/><i className='far fa-hand-point-up'></i><FormattedMessage id="patient.detail-doctor.book-free"/></span>
                     </div>
                  </>
                  :
                  <div className='no-schedule'>
                     <FormattedMessage id="patient.detail-doctor.no-schedule"/>
                  </div>
               }
            </div>
         </div>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);
