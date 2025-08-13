import React, { Component } from 'react';
import { connect } from 'react-redux';
import './MedicalFacility.scss';
import Slider from 'react-slick';
import * as actions from '../../../store/actions';
import { LANGUAGES } from '../../../utils';
import { FormattedMessage } from 'react-intl';

class OutStandingDoctor extends Component {

   constructor(props) {
      super(props);
      this.state = {
         arrDoctors: []
      }
   }

   componentDidMount() {
      this.props.loadTopDoctors();

   }

   componentDidUpdate(prevProps, prevState, snapshot){
      if(prevProps.topDoctorsRedux !== this.props.topDoctorsRedux) {
         this.setState({
            arrDoctors: this.props.topDoctorsRedux
         })
      }
   }

   render() {
      console.log("Check data doctors redux", this.props.topDoctorsRedux);
      let language = this.props.language;
      let allDoctors = this.state.arrDoctors;

      return ( 
         <React.Fragment>
            <div className='section-share section-outstanding-doctor'>
               <div className='section-container'>
                  <div className='section-header'>
                        <span className='title-section'><FormattedMessage id="homepage.out-standing-doctor"/></span>
                        <button className='btn-section'><FormattedMessage id="homepage.more-info" /></button>
                  </div>
                  <div className='section-body'>
                        <Slider {...this.props.settings}>
                           {allDoctors && allDoctors.length > 0 &&
                              allDoctors.map((item, index) => {
                                 let imageBase64 = '';
                                 let nameVi = `${item.positionData.valueVi}, ${item.lastName} ${item.firstName}`;
                                 let nameEn = `${item.positionData.valueEn}, ${item.firstName} ${item.lastName}`;

                                 if(item.image) {
                                    imageBase64 = new Buffer(item.image, 'base64').toString('binary');
                                 }

                                 console.log(item);

                                 return (
                                    <div className='section-customize'>
                                       <div className='customize-border'>
                                          <div className='outer-bg'>
                                             <div className='bg-image section-outstanding-doctor' 
                                                style={{ backgroundImage: `url(${imageBase64})` }}
                                             />
                                          </div>
                                          <div className='position text-center'>
                                             <div>{language === LANGUAGES.VI ? nameVi : nameEn}</div>
                                             <div>Cơ xương khớp 1</div>
                                          </div>
                                       </div>         
                                    </div>
                                 )
                              })
                           }
                           
                           {/* <div className='section-customize'>
                              <div className='customize-border'>
                                 <div className='outer-bg'>
                                    <div className='bg-image section-outstanding-doctor' />
                                 </div>
                                 <div className='position text-center'>
                                    <div>Giáo sư, Tiến sĩ Nguyễn Quân</div>
                                    <div>Cơ xương khớp 2</div>
                                 </div>
                              </div>  
                           </div>
                           <div className='section-customize'>
                              <div className='customize-border'>
                                 <div className='outer-bg'>
                                    <div className='bg-image section-outstanding-doctor' />
                                 </div>
                                 <div className='position text-center'>
                                    <div>Giáo sư, Tiến sĩ Nguyễn Quân</div>
                                    <div>Cơ xương khớp 3</div>
                                 </div>
                              </div>  
                           </div>
                           <div className='section-customize'>
                              <div className='customize-border'>
                                 <div className='outer-bg'>
                                    <div className='bg-image section-outstanding-doctor' />
                                 </div>
                                 <div className='position text-center'>
                                    <div>Giáo sư, Tiến sĩ Nguyễn Quân</div>
                                    <div>Cơ xương khớp 4</div>
                                 </div>
                              </div> 
                           </div>
                           <div className='section-customize'>
                              <div className='customize-border'>
                                 <div className='outer-bg'>
                                    <div className='bg-image section-outstanding-doctor' />
                                 </div>
                                 <div className='position text-center'>
                                    <div>Giáo sư, Tiến sĩ Nguyễn Quân</div>
                                    <div>Cơ xương khớp 5</div>
                                 </div>
                              </div>  
                           </div>
                           <div className='section-customize'>
                              <div className='customize-border'>
                                 <div className='outer-bg'>
                                    <div className='bg-image section-outstanding-doctor' />
                                 </div>
                                 <div className='position text-center'>
                                    <div>Giáo sư, Tiến sĩ Nguyễn Quân</div>
                                    <div>Cơ xương khớp 6</div>
                                 </div>
                              </div> 
                           </div> */}
                  </Slider>
                  </div>
               </div>
            </div>
         </React.Fragment>
      );
   }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        topDoctorsRedux: state.admin.topDoctors,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
   return {
      loadTopDoctors: () => dispatch(actions.fetchTopDoctorHomeService())
   };
};

export default connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor);