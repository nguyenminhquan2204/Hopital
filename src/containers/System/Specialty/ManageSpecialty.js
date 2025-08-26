import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './ManageSpecialty.scss';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import CommonUtils from '../../../utils/CommonUtils';
import {postCreateNewSpecialty} from '../../../services/userService';
import { toast} from 'react-toastify';

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageSpecialty extends Component {

  constructor(props){
      super(props)

      this.state = { 
         name: '',
         imageBase64: '',
         descriptionHTML: '',
         descriptionMarkdown: ''
      }
   }

   async componentDidUpdate(prevProps, prevState, snapshot) {

   }

   handleOnChangeInput = (event, id) => {
      let stateCopy = {...this.state};

      stateCopy[id] = event.target.value;
      this.setState({
         ...stateCopy
      })
   }

   hanldeEditorChange = ({ html, text }) => {
      this.setState({
         descriptionMarkdown: text,
         descriptionHTML: html
      });
   }

   hanldeOnChangeImage = async (event) => {
      let data = event.target.files;
      let file = data[0];

      if(file) {
         let base64 = await CommonUtils.getBase64(file);

         this.setState({
            imageBase64: base64
         });
      }
   }

   hanldeSaveNewSpecialty = async  () => {
      // console.log(';adadad', this.state);
      let res = await postCreateNewSpecialty(this.state);

      if(res && res.errorCode === 0) {
         toast.success("Add new specialty succeed!");
      } else {
         toast.error("Add new specialty failed!");
      }
   }  

  render() {
   return (
      <div className='manage-specialty-container'>
         <div className='ms-title'>Quản lý chuyên khoa</div>
         <div className='add-new-specialty row'>
            <div className='col-6 form-group'>
               <label>Tên chuyên khoa</label>
               <input type='text' className='form-control' value={this.state.name}
                  onChange={(event) => this.handleOnChangeInput(event, 'name')}
               />
            </div>
            <div className='col-6 form-group'>
               <label>Ảnh chuyên khoa</label>
               <input type='file' className='form-control-file'
                  onChange={(event) => this.hanldeOnChangeImage(event)}
               />
            </div>
            <div className='col-12'>
               <MdEditor 
                  style={{height: '350px'}}
                  renderHTML={text => mdParser.render(text)}
                  onChange={this.hanldeEditorChange}
                  value={this.state.descriptionMarkdown}
               />
            </div>
            <div className='col-12'>
               <button className='btn-save-specialty'
                  onClick={() => this.hanldeSaveNewSpecialty()}
               >Thêm mới</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);
