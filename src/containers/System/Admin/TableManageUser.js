import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import "./TableManageUser.scss";
import * as actions from '../../../store/actions';

class TableManageUser extends Component {

   constructor(props) {
      super(props);
      this.state = {
         usersRedux: []
      }
   }

   componentDidMount() {
      this.props.fetchUserRedux();
   }

   componentDidUpdate(prevProps, prevState, snapshot) {
      if(prevProps.listUsers !== this.props.listUsers) {
         this.setState({
            usersRedux: this.props.listUsers
         })
      }
   }

   handleDeleteUser = (user) => {
      this.props.deleteAUserRedux(user.id);   
   }

   hanldeEditUser = (user) => {
      this.props.handleEditUserFromParent(user);
   }

   render() {
      // console.log('Check list users: ', this.props.listUsers);
      // console.log('Check userRedux in state: ', this.state.usersRedux);

      let arrUsers = this.state.usersRedux;

      return (
         <table id="TableManageUser">
            <tbody>
                  <tr>
                     <th>Email</th>
                     <th>First name</th>
                     <th>Last name</th>
                     <th>Address</th>
                     <th>Actions</th>
                  </tr>
                  {arrUsers && arrUsers.length > 0 &&
                     arrUsers.map((item, index) => {
                        return (
                           <tr key={index}>
                              <td>{item.email}</td>
                              <td>{item.firstName}</td>
                              <td>{item.lastName}</td>
                              <td>{item.address}</td>
                              <td>
                                 <button className='btn-edit'
                                       onClick={() => this.hanldeEditUser(item)}
                                    ><i className="fas fa-pencil-alt"></i></button>
                                 <button className='btn-delete'
                                       onClick={() => this.handleDeleteUser(item)}
                                    ><i className="fas fa-trash"></i></button>
                              </td>
                           </tr>
                        )
                     })
                  }
            </tbody>
         </table>
      );
   }
}

const mapStateToProps = state => {
   return {
      listUsers: state.admin.users
   };
};

const mapDispatchToProps = dispatch => {
   return {
      fetchUserRedux: () => dispatch(actions.fetchAllUserStart()),
      deleteAUserRedux: (id) => dispatch(actions.deleteAUser(id))
   };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);
