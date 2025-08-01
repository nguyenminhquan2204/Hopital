import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';
import Navigator from '../../components/Navigator';
import { adminMenu } from './menuApp';
import './Header.scss';
import { LANGUAGES } from '../../utils/constant';
import { FormattedMessage } from 'react-intl';

class Header extends Component {

    handleChangeLanguage = (language) => {
        // alert(language);
        this.props.changeLanguageAppRedux(language);
    }

    render() {
        const { processLogout, language, userInfo } = this.props;

        return (
            <div className="header-container">
                {/* Thanh navigator */}
                <div className="header-tabs-container">
                    <Navigator menus={adminMenu} />
                </div>

                <div className='languages'>
                    <span className='welcome'>
                        <FormattedMessage id="homeheader.welcome" />
                        {userInfo && userInfo.firstName ? userInfo.firstName : ''} !
                    </span>
                    <span 
                        onClick={() => this.handleChangeLanguage(LANGUAGES.VI)} 
                        className={language === LANGUAGES.VI ? 'language-vi active' : 'language-vi'}
                    >
                        VN
                    </span>
                    <span 
                        onClick={() => this.handleChangeLanguage(LANGUAGES.EN)} 
                        className={language === LANGUAGES.EN ? 'language-en active' : 'language-en'}

                    >
                        EN
                    </span>
                    {/* Nút logout */}
                    <div title='Log out' className="btn btn-logout" onClick={processLogout}>
                        <i className="fas fa-sign-out-alt"></i>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
        language: state.app.language
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        changeLanguageAppRedux: (language) => dispatch(actions.changeLanguageApp(language))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
