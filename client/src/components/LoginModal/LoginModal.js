import styled from 'styled-components';
import userStore from '../../store/userStore';
import { CloseOutlined } from '@ant-design/icons';
import { useState } from 'react';
import Signup from '../Signup/Signup';
import server from '../../utils/CustomApi';
import memberstore from '../../store/memberstore';
import Logo from '../../svg/Logo.svg';
import jwt_decode from 'jwt-decode';

function LoginModal(props) {
  const setUserId = userStore((state) => state.setUserId);
  const setNickname = userStore((state) => state.setNickname);
  const [signUp, setSignUp] = useState(false);
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const { isLogin, setisLogin } = memberstore((state) => state);

  const googleLogin = () => {
    const GoogleAuthLogin =
      'https://myprojectsite.shop/oauth2/authorization/google';
    window.location.href = GoogleAuthLogin;
  };

  const validationCheck = (e, value) => {
    if (value === 'email') {
      const emailRegex =
        /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
      if (!emailRegex.test(e)) {
        window.alert('올바른 이메일 형식이 아닙니다');
        return false;
      }
    }
    if (value === 'password') {
      const passwordRegex =
        /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
      if (!passwordRegex.test(e)) {
        window.alert('숫자,영문을 포함해 8자리 이상이어야 합니다');
        return false;
      }
    }
  };

  const closeButton = () => {
    // eslint-disable-next-line react/prop-types
    props.onClose();
  };

  const onChangeId = (e) => {
    setId(e.target.value);
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const SignIn = async () => {
    const login = await server
      .post(`auth/login`, {
        email: id,
        password: password,
      })
      .then((res) => {
        const user_id = res.data.memberId;
        const user_nickname = res.data.nickname;
        // Access Token - Authorization Header로 받음 / Refresh Token - HttpOnly Cookie로 받음
        localStorage.setItem('accessToken', res.headers.authorization);
        localStorage.setItem('loginUserProfile', res.data.profileImageUrl);
        // Access Token Decode
        const decoded = jwt_decode(
          res.headers.authorization.replace('Bearer ', '')
        );
        localStorage.setItem('atk_expire', Math.floor(decoded.exp * 1000)); // 토큰 만료시간 저장
        localStorage.setItem('myId', decoded.memberId);

        setUserId(user_id);
        setNickname(user_nickname);
        setisLogin(true);

        // eslint-disable-next-line react/prop-types
        props.onClose();
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        // alert(err.response.data.message);
      });
    login();
  };

  const goSignUp = () => {
    setSignUp(true);
  };

  return (
    <Overlay>
      <ModalWrap>
        <CloseOutlined
          style={{ marginLeft: '85%', marginTop: '5%' }}
          onClick={closeButton}
        />
        <Contents>
          <h1
            style={{
              marginBottom: '5%',
              display: 'flex',
              justifyContent: 'space-evenly',
              fontSize: '30px',
              position: 'relative',
              top: '-30px',
            }}
          >
            Look at me
          </h1>
          <h2 style={{ fontSize: '20px', position: 'relative', top: '-30px' }}>
            <img src={Logo} alt="logo" className="title" role="presentation" />
          </h2>
          <input
            className="id"
            placeholder="아이디"
            style={{
              fontSize: '14px',
              padding: '12px 12px',
              backgroundColor: 'gary',
              borderRadius: '8px',
              width: '250px',
              color: 'black',
              fontWeight: '200',
              marginTop: '-30px',
              position: 'relative',
              border: '1.5px solid #C1C1C1',
              top: '-20px',
            }}
            onChange={onChangeId}
          ></input>
          <input
            className="pw"
            placeholder="비밀번호"
            type="password"
            style={{
              fontSize: '14px',
              padding: '12px 12px',
              width: '250px',
              backgroundColor: 'gary',
              borderRadius: '8px',
              color: 'black',
              fontWeight: '200',
              marginTop: '-30px',
              position: 'relative',
              top: '0px',
              border: '1.5px solid #C1C1C1',
            }}
            onChange={onChangePassword}
          ></input>
          <div>
            <SigninButton onClick={SignIn}>로그인</SigninButton>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: '17px',
              marginBottom: '10px',
              justifyContent: 'center',
            }}
          >
            <div>아직 회원이 아니신가요?</div>
            <SignupButton onClick={goSignUp}> 회원가입</SignupButton>
          </div>
          <div> --------------------- OR ---------------------</div>
          <GoogleButton onClick={googleLogin}>구글 로그인</GoogleButton>
        </Contents>
      </ModalWrap>
      {signUp && (
        <Signup
          open={signUp}
          onClose={() => {
            setSignUp(false);
          }}
        />
      )}
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 9999;
  text-align: center;
`;

const ModalWrap = styled.div`
  width: 400px;
  height: 500px;
  border-radius: 15px;
  background-color: #fff;
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Contents = styled.div`
  margin: 50px 30px;
  h1 {
    font-size: 30px;
    font-weight: 600;
    margin-bottom: 60px;
  }
  img {
    margin-top: -60px;
    width: 300px;
  }
`;

const SigninButton = styled.button`
  font-size: 14px;
  padding: 12px 10px;
  background-color: #4083b1;
  border-radius: 8px;
  color: white;
  font-style: italic;
  font-weight: 200;
  margin-top: 10px;
  width: 277px;
  cursor: pointer;
  border: none;
  &:hover {
    background-color: #67b8f0;
  }
`;

const SignupButton = styled.button`
  font-size: 14px;
  border: none;
  font-style: italic;
  font-weight: 200;
  all: unset;
  cursor: pointer;
  margin-left: 10px;
  color: gray;
  font-size: 15px;
`;

const GoogleButton = styled.button`
  font-size: 14px;
  border-radius: 8px;
  color: white;
  font-style: italic;
  font-weight: 200;
  margin-top: 12px;
  background-color: #4083b1;
  border: none;
  cursor: pointer;
  width: 277px;
  height: 40.5px;
  &:hover {
    background-color: #67b8f0;
  }
  .title {
    width: 260px;
  }
`;

export default LoginModal;
