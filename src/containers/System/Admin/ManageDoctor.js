import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import "./ManageDoctor.scss";
import * as actions from '../../../store/actions';
// import * as ReactDOM from 'react-dom';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css'
import Select from 'react-select';
import { LANGUAGES } from '../../../utils';

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageDoctor extends Component {

   constructor(props) {
      super(props);
      this.state = {
         contentMarkdown: '',
         contentHTML: '',
         selectedDoctor: '',
         description: '',
         listDoctors: []
      }
   }

   componentDidMount() {
      this.props.getAllDoctors();   
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
   }

   // Finish!
   handleEditorChange = ({ html, text }) => {
      console.log('handleEditorChange', html, text);
      this.setState({
         contentHTML: html,
         contentMarkdown: text
      });
   }

   handleSaveContentMarkdown = () => {
      // console.log('handleSaveContentMarkdown', this.state);
      this.props.saveDetailDoctor({
         contentHTML: this.state.contentHTML,
         contentMarkdown: this.state.contentMarkdown,
         description: this.state.description,
         doctorId: this.state.selectedDoctor.value
      });
   }

   handleChange = (selectedDoctor) => {
      this.setState({ selectedDoctor });
      console.log('Option selected: ', selectedDoctor);
   }

   handleOnChangeDesc = (e) => {
      this.setState({
         description: e.target.value
      })
   }

   render() {


      return (
            <div className="manage-doctor-container">
               <div className="manage-doctor-title">Tạo thêm thông tin bác sỹ</div>
               <div className="more-info">
                  <div className='content-left form-group'>
                     <label>Chọn bác sỹ</label>
                     <Select 
                        value={this.state.selectedDoctor}
                        onChange={this.handleChange}
                        options={this.state.listDoctors}
                     />
                  </div>
                  <div className='content-right'>
                     <label>Thông tin giới thiệu</label>
                     <textarea 
                        className='form-control' rows='4'
                        onChange={(e) => this.handleOnChangeDesc(e)}
                        value={this.state.description}
                     >
                     </textarea>
                  </div>
               </div>
               <div className='manage-doctor-editor'>
                  <MdEditor 
                     style={{ height: '500px' }} 
                     renderHTML={text => mdParser.render(text)} 
                     onChange={this.handleEditorChange} 
                  />
               </div>
               <button 
                  className="save-content-doctor"
                  onClick={() => this.handleSaveContentMarkdown()}
               >Lưu thông tin</button>
            </div>
      );
   }
}

const mapStateToProps = state => {
   return {
      language: state.app.language,
      allDoctors: state.admin.allDoctors
   };
};

const mapDispatchToProps = dispatch => {
   return {
      getAllDoctors: () => dispatch(actions.fetchAllDoctors()),
      saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data))
   };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
