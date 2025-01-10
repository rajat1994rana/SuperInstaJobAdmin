import styled from "styled-components";

export const Container = styled.div`
  & .user_name {
    background: #000;
    text-align: center;
    width: 100%;
    color: #fff;
    padding: 11px 0px;
    position: relative;
    font-size: 20px;
  }

  & .hide-audio {
    display: none;
  }

  & .card-footer {
    padding: 0.5rem 1rem;
    background-color: transparent;
    border-top: 1px solid rgba(0, 0, 0, 0.125);
  }

  & .input-group input {
    width: 100%;
    border: 1px solid #d79f2c;
    padding: 5px 5px 5px 42px;
    border-radius: 6px !important;
    background: transparent;
    height: 40px;
  }

  & .chat_box .card {
    height: 670px;
    background-color: #f7f7f7 !important;
    overflow: hidden;
  }
  & .card .card_chats {
    border-radius: 0px 15px 15px 0px !important;
    overflow: hidden;
  }

  & .chat_box .contacts_body {
    padding: 0 0 0 0 !important;
    overflow-y: auto;
    border: 1px solid rgb(215, 159, 44);
  }

  & .msg_card_body {
    overflow-y: auto;
    position: relative;
  }
  & .chatLoader {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 30%;
    top: 20%;
    z-index: 13;
  }

  & .chat_box .card-header {
    border-radius: 15px 15px 0 0 !important;
    border-bottom: 0 !important;
  }

  & .chat_box .card-footer {
    border-radius: 0 0 15px 15px !important;
    border-top: 0 !important;
  }

  & .type_msg {
    background-color: rgba(0, 0, 0, 0 0.3) !important;
    border: 0 !important;
    color: white !important;
    height: 60px !important;
    overflow-y: auto;
  }
  & .input-group input::placeholder {
    opacity: & 0.2 !important;
    font-size: 13px;
  }
  & .contacts li:first-child {
    border-top: 1px solid rgb(215, 159, 44);
  }

  & .type_msg:focus {
    box-shadow: none !important;
    outline: 0px !important;
  }

  & .send_btn {
    border-radius: 0 15px 15px 0 !important;
    background-color: transparent;
    border: 0 !important;
    cursor: pointer;
    position: absolute;
    right: 0;
    height: 40px;
  }
  & .attachment {
    border-radius: 0 15px 15px 0 !important;
    background-color: transparent;
    border: 0 !important;
    cursor: pointer;
    position: absolute;
    left: 0;
    height: 40px;
    & svg {
      height: 18px;
      width: 22px;
    }
  }
  & .hide {
    display: none;
  }
  & .fa-location-arrow::before {
    content: "\f124";
    color: #d79f2c;
  }

  & .chat_box .contacts {
    list-style: none;
    padding: 0;
  }

  & .chat_box & .contacts li {
    width: 100%;
    padding: 0px 0px;
    margin-bottom: 0;
  }

  & .chat_box & .active {
    background-color: #eaeaea;
  }

  & .user_img {
    height: 70px;
    width: 70px;
    border: 10.5px solid #f5f6fa;
  }

  & .user_img_msg {
    height: 40px;
    width: 40px;
    border: 10.5px solid #f5f6fa;
  }

  & .online_icon {
    position: absolute;
    height: 15px;
    width: 15px;
    background-color: #4cd137;
    border-radius: 50%;
    bottom: 0.2em;
    right: 0.4em;
    border: 10.5px solid white;
  }
  & .user_name span::after {
    position: absolute;
    content: "";
    height: 10px;
    width: 10px;
    background: #99bf51;
    border-radius: 50%;
    right: -15px;
    bottom: 7px;
  }
  & .user_name span {
    position: relative;
    display: inline-block;
  }

  & .offline {
    background-color: #c23616 !important;
  }

  & .user_info {
    margin-top: auto;
    margin-bottom: auto;
    cursor: pointer;
    padding: 5px 15px;
    border-bottom: 1px solid rgb(215, 159, 44);
    float: left;
    width: 100%;
  }
  & .chat-image {
    height: 300px;
    width: 300px;
    margin-bottom: 10px;
    object-fit: cover;
  }
  & .image-container {
    display: flex;
    flex-direction: column;
  }
  & .user_info span {
    font-size: 19px;
    color: #000;
    margin-bottom: 10px;
    display: block;
  }

  & .user_info p {
    font-size: 11px;
    color: #000;
    word-break: break-all;
    float: left;
    width: 100%;
    display: flex;
  }

  & .msg_cotainer {
    margin-top: auto;
    margin-bottom: auto;
    margin-left: 0px;
    border-radius: 10px;
    background-color: #def5ff;
    padding: 10px 10px 30px;
    position: relative;
    font-size: 13px;
    max-width: 80%;
    min-width: 120px;
  }

  & .msg_cotainer_send {
    margin-top: auto;
    margin-bottom: auto;
    margin-right: 10px;
    border-radius: 4px;
    background-color: #fff9ed;
    padding: 10px 10px 30px;
    position: relative;
    max-width: 80%;
    font-size: 13px;
    min-width: 120px;
  }

  & .msg_time {
    position: absolute;
    right: 10px;
    bottom: 10px;
    color: #959595;
    font-size: 10px;
  }

  & .msg_time_send {
    position: absolute;
    right: 10px;
    bottom: 10px;
    color: #959595;
    font-size: 10px;
  }

  & .msg_head {
    position: relative;
  }

  #action_menu_btn {
    position: absolute;
    right: 10px;
    top: 10px;
    color: white;
    cursor: pointer;
    font-size: 20px;
  }

  & .action_menu {
    z-index: 1;
    position: absolute;
    padding: 15px 0;
    background-color: rgba(0, 0, 0, 0, 0.5);
    color: white;
    border-radius: 15px;
    top: 30px;
    right: 15px;
    display: none;
  }

  & .action_menu ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  & .action_menu ul li {
    width: 100%;
    padding: 10px 15px;
    margin-bottom: 5px;
  }
  & .user_info span .badge {
    float: right;
    background: #d79f2c;
    padding: 0px 0px;
    border: #fff;
    border-radius: 50%;
    font-size: 10px;
    height: 22px;
    width: 22px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
  }
  & .action_menu ul li i {
    padding-right: 10px;
  }
  & .today {
    width: 100%;
    text-align: center;
    padding: 10px 10px;
    color: #999;
    text-transform: uppercase;
    font-size: 14px;
  }

  & .action_menu ul li:hover {
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0, 0.2);
  }

  & .user_info h4 {
    display: flex;
    justify-content: space-between;
    color: #d79f2c;
    font-size: 13px;
    margin-bottom: 9px;
  }

  & .user_info h4 time {
    color: #000;
  }
  & .is-active-chat {
    background-color: #e4e4e4;
  }
  & .username {
    font-size: 14px;
    color: black;
  }
`;
