import React, { Component } from 'react';
import { connect } from 'react-redux';

class About extends Component {

    render() {
        return ( 
            <div className='section-share section-about'>
               <div className='section-about-header'>
                  Truyền thông về sức khỏe
               </div>
               <div className='section-about-content'>
                  <div className='content-left'>
                     <iframe 
                        width="100%" height="400px" 
                        src="https://www.youtube.com/embed/pvjKjGQANAw" 
                        title="Gừng : 7 Lợi Ích Sức Khỏe Tuyệt Vời Nhiều Người Có Thể Không Biết | SKĐS" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerpolicy="strict-origin-when-cross-origin" 
                        allowfullscreen>
                     </iframe>
                  </div>
                  <div className='content-right'>
                     <p>
                        Gừng là một loại gia vị quen thuộc trong mỗi gia đình. Gừng có nguồn gốc từ châu Á và thuộc họ thực vật Zingiberaceae, người ta thường sử dụng củ gừng trong chế biến các món ăn và làm thuốc chữa bệnh. Vậy gừng có tác dụng gì?
                        Kinh nghiệm dân gian cho thấy, gừng là một phương thuốc thảo dược cổ xưa được sử dụng trong điều trị nhiều bệnh lý thông thường như viêm khớp, ho, cảm lạnh, cảm cúm, đau dạ dày, đau bụng kinh và buồn nôn. Nó không chỉ giúp làm tăng hương vị cho các món ăn mà còn có thể cải thiện khả năng miễn dịch của bạn.
                     </p>
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
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(About);