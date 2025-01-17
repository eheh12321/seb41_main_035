import styled from 'styled-components';
import { useState } from 'react';
import LoginModal from './LoginModal/LoginModal';
import { BsPersonCircle, BsPencilSquare } from 'react-icons/bs';
import { AiOutlineMessage } from 'react-icons/ai';
import { GoThreeBars } from 'react-icons/go';
import { useNavigate } from 'react-router-dom';
import SearchBox from './SearchBox';
import userStore from '../store/userStore';
import memberstore from '../store/memberstore';
import server from '../utils/CustomApi';
import Logo from '../svg/Logo.svg';
import { BREAK_POINT_PC, BREAK_POINT_TABLET } from '../constants/index';
import Hambar from './HamBar';
import { removeCookie } from '../utils/Cookies';
const backendUrl = 'https://myprojectsite.shop/';

const LoginHeader = () => {
  const { isLogin, setisLogin } = memberstore((state) => state);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { userId, setUserId } = userStore((state) => state);
  const setNickname = userStore((state) => state.setNickname);
  const [isBarOpen, setIsBarOpen] = useState(false);
  const myId = JSON.parse(localStorage.getItem('myId'));
  const onClickButton = () => {
    setIsOpen(true);
  };
  const onBarOpen = () => {
    setIsBarOpen((prev) => !prev);
  };
  const Logout = async () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      await server.post(`auth/logout`).finally(() => {
        // 성공하든 말든 로그아웃 진행
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('myId');
        localStorage.removeItem('loginUserProfile');
        localStorage.removeItem('atk_expire');
        // eslint-disable-next-line react/prop-types
        setisLogin(false);
        setUserId('');
        setNickname('');
        removeCookie('Refresh');
        window.location.reload();
      });
    }
  };

  return (
    <>
      <SWrapper>
        <SHeader>
          <div className="header-container">
            <div className="title-name">
              {/* ---로고삽입--- */}
              <img
                src={Logo}
                alt="logo"
                className="title"
                role="presentation"
                onClick={() => navigate(`/`)}
                width="200px"
              />
            </div>
            {/* <SearchBox /> */}
            {!localStorage.getItem('accessToken') ? (
              <div className="right zone">
                <button className="login button" onClick={onClickButton}>
                  Log in
                </button>
              </div>
            ) : (
              <div className="right zone">
                <BsPersonCircle
                  onClick={() => navigate(`/profile/${myId}`)}
                  size="30"
                />
                <BsPencilSquare
                  size="30"
                  role="presentation"
                  onClick={() => navigate(`/postupload`)}
                />
                <AiOutlineMessage
                  size="30"
                  onClick={() => navigate(`/chatting`)}
                />
                <button className="logout button" onClick={Logout}>
                  Log out
                </button>
              </div>
            )}
            <GoThreeBars className="menu-bar" onClick={onBarOpen} />
          </div>
        </SHeader>
        {isOpen && (
          <LoginModal
            open={isOpen}
            onClose={() => {
              setIsOpen(false);
            }}
          />
        )}
        {isBarOpen && (
          <Hambar
            onBarOpen={onBarOpen}
            userId={userId}
            Logout={Logout}
            onClickButton={onClickButton}
          />
        )}
      </SWrapper>
    </>
  );
};
const SWrapper = styled.div`
  height: 12vh;
  z-index: 300;
  position: sticky;
`;
const SHeader = styled.div`
  height: 12vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  /* border-bottom: 3px solid #196ba5; */
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  //수정
  @media only screen and (max-width: ${BREAK_POINT_PC}px) {
    margin: 0 -50px;
  }
  .header-container {
    display: flex;
    /* 100% -> 80% 변경 */
    width: 90%;
    /* 1250에서 1400으로 변경 */
    max-width: 1400px;
    align-items: center;
    justify-content: space-between;
  }
  .title-name {
    flex-grow: 4;
    /* height: 12vh; */
    display: flex;
    /* justify-content: flex-start; */
    img {
      height: 90px;
    }
  }
  .title {
    cursor: pointer;
  }

  .right {
    flex-grow: 4;
    display: flex;
    justify-content: flex-end;
    margin-right: 20px;
    margin-top: 40px;

    svg {
      cursor: pointer;
      color: #565656;
      padding: 0 15px;
      :hover {
        color: lightgray;
      }
    }
    button {
      height: 30px;
      font-size: 17px;
      border: none;
      color: #5f6060;
      cursor: pointer;
      background-color: white;
      :hover {
        color: lightgray;
      }
    }
    @media only screen and (max-width: ${BREAK_POINT_TABLET}px) {
      & {
        display: none;
      }
    }
  }
  .autocomplete-wrapper {
    flex-grow: 0;
    margin-left: auto;
    margin-right: auto;
    @media only screen and (max-width: ${BREAK_POINT_TABLET}px) {
      & {
        display: none;
      }
    }
  }
  .menu-bar {
    display: none;
    margin-left: auto;
    align-items: center;
    margin-top: 35px;
    font-size: 35px;
    color: #196ba5;
    @media only screen and (max-width: ${BREAK_POINT_TABLET}px) {
      & {
        display: flex;
        margin-right: 20px;
      }
    }
  }
  svg {
    cursor: pointer;
  }
`;

export default LoginHeader;
