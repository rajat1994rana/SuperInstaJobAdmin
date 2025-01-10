import React, { memo, useState, useEffect, useCallback, useRef } from "react";
import io from "socket.io-client";
import moment from "moment";
import ChatImageView from "components/PerviewImage/ModalView";
import Loader from "components/Loading";
import { checkAuth } from "utils/helper";
import { sendMessageInThread, getAllMessage, getLastChatList } from "./apis";
import { Container } from "./styles";

const userInfo = checkAuth();

const ChatScreen = () => {
  const chatRef = useRef(null);
  const inputRef = useRef(null);
  const socketRef = useRef(null);
  const observer = useRef();

  const [allLastChat, setAllLastChat] = useState([]);
  const [showAttachment, setShowAttachment] = useState("");
  const [message, setMessage] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [allMessages, setAllMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState({});
  const [friendName, setFriendName] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastChatLoading, setLastChatLoading] = useState(false);
  const [images, setImages] = useState(null);
  const [oldChat, setOldChat] = useState([]);
  const [showClientChat, setShowClientChat] = useState(true);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [allMessages]);

  const findAllMessage = useCallback((threadId) => {
    setChatLoading(true);
    getAllMessage(threadId)
      .then(({ data }) => {
        setAllMessages(data?.data?.getDisputeMessage?.data?.reverse());
        setOldChat(data?.data?.allChat);
      })
      .catch(() => {})
      .finally(() => {
        setChatLoading(false);
      });
  }, []);

  const getAllLastMessages = useCallback(
    (loading = true, isPagination = false, page = 1) => {
      !isPagination ? setLoading(loading) : setLastChatLoading(true);
      getLastChatList({
        limit: 40,
        page,
      })
        .then(({ data }) => {
          setAllLastChat(data?.data?.data);
          if (data?.data?.data.length && loading) {
            let thread = data?.data?.data[0];
            setSelectedChat(thread);
            findAllMessage(thread.id);
            setFriendName(thread?.name);
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          !isPagination ? setLoading(false) : setLastChatLoading(false);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [findAllMessage]
  );

  useEffect(() => {
    getAllLastMessages(true);
  }, [getAllLastMessages]);

  useEffect(() => {
    if (socketRef.current) {
      return;
    }
    socketRef.current = io("http://34.216.237.49:3000");
    socketRef.current.emit("ConncetedChat", userInfo.id);
    if (socketRef.current) {
      socketRef.current.emit("ConncetedChat", userInfo.id);
    }
    if (socketRef.current) {
      socketRef.current.on(
        userInfo.userType !== 1 ? "newMessage" : "cooperate",
        (chat) => {
          const audioTag = document.getElementById("audio");

          setSelectedChat((lastState) => {
            if (
              chat.threadId === lastState.id &&
              chat.senderInfo.userType === 0
            ) {
              audioTag?.pause();
              audioTag?.play();
              setAllMessages((lastMessage) => {
                const tempChat = JSON.parse(JSON.stringify(lastMessage));
                tempChat.push(chat);
                return tempChat;
              });
            }
            return lastState;
          });
          getAllLastMessages(false);
        }
      );
    }
    return () => {
      socketRef.current.off("connect");
      socketRef.current.off("disconnect");
      socketRef.current.off("pong");
    };
  }, [getAllLastMessages]);

  const onSelectChat = useCallback(
    (thread) => {
      setSelectedChat(thread);
      setAllMessages([]);
      findAllMessage(thread.id);
      setFriendName(thread.name);
    },
    [findAllMessage]
  );

  const sendMessage = useCallback(
    (messageType = 0, imageName) => {
      if (!message && !imageName) {
        return;
      }
      setAllMessages((lastMessage) => {
        const tempChat = JSON.parse(JSON.stringify(lastMessage));
        tempChat.push({
          message: message || "Attachment",
          attachment: imageName ?? "",
          messageType,
          created: new Date().getTime() / 1000,
          isSendAdmin: 1,
        });
        return tempChat;
      });
      const { id } = selectedChat;
      setMessage("");
      sendMessageInThread({
        threadId: id,
        message: message || "Attachment",
      })
        .then(() => {})
        .catch(() => {})
        .finally(() => {});
    },
    [message, selectedChat]
  );

  const sendMessageByEnter = useCallback(
    (e) => {
      if (e.keyCode === 13) {
        sendMessage();
      }
    },
    [sendMessage]
  );

  const handleInputFile = useCallback(({ target: { files } }) => {
    setImages(files[0]);
  }, []);

  const openFile = useCallback(() => {
    inputRef.current.click();
  }, []);

  const lastChatElementRef = useCallback(
    (node) => {
      if (lastChatLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
        }
      });
      if (node) observer.current.observe(node);
    },
    [lastChatLoading]
  );

  return (
    <Container>
      <h2>CHAT</h2>
      <div className='col-md-12 p-md-5 p-2 chat_box'>
        <audio className='hide-audio' id='audio' controls>
          <source src='/assest/audio/audioMesaage.mp3' type='audio/ogg' />
          <source src='/assest/audio/audioMesaage.mp3' type='audio/mpeg' />
          Your browser does not support the audio tag.
        </audio>
        <div className='row justify-content-center g-0 h-100'>
          <div className='col-md-4 chat'>
            <div className='card mb-sm-3 mb-md-0 contacts_card'>
              <div className='card-body contacts_body'>
                <ul className='contacts' ref={lastChatElementRef}>
                  {loading && <Loader isShow={loading} />}
                  {allLastChat?.map(
                    ({ name, lastMessage, id, ...rest }, index) => (
                      <li
                        key={id}
                        onClick={() =>
                          onSelectChat({
                            name,
                            lastMessage,
                            id,
                            ...rest,
                            index,
                          })
                        }
                      >
                        <div
                          className={`d-flex bd-highlight ${
                            id === selectedChat?.id ? "is-active-chat" : ""
                          }`}
                        >
                          <div className='user_info'>
                            <h4>
                              {name}
                              <time>
                                {moment(
                                  new Date(rest?.created * 1000)
                                ).fromNow()}
                              </time>
                            </h4>
                            <span>
                              {rest?.unReadMessage > 0 && (
                                <span className='badge'>
                                  {" "}
                                  {rest?.unReadMessage}{" "}
                                </span>
                              )}
                            </span>
                            <p>{lastMessage}</p>
                          </div>
                        </div>
                      </li>
                    )
                  )}

                  {lastChatLoading && (
                    <div className='mt-4 mb-4 bg-red'>
                      Loading more chat....
                    </div>
                  )}
                </ul>
              </div>
              <div className='card-footer'></div>
            </div>
          </div>
          <div className='col-md-8  chat'>
            <div className='card card_chats'>
              <div className='card-header msg_head p-0'>
                <div className='d-flex bd-highlight'>
                  <div className='user_name'>
                    <span>{friendName}</span>
                    <div>
                      <div
                        onClick={() => setShowClientChat((curr) => !curr)}
                        className='btn btn-primary mr-4'
                      >
                        {showClientChat
                          ? "Click to show Client Chat"
                          : "Click to show Current Chat"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {chatLoading && (
                <div className='chatLoader'>
                  <Loader color={"#ff9c37"} />
                </div>
              )}

              <div className='card-body msg_card_body'>
                {!showClientChat &&
                  oldChat?.map(
                    ({
                      id,
                      messageType,
                      isAdmin,
                      created: createdAt,
                      message,
                      attachment,
                      senderId,
                      receiverName,
                      senderName,
                    }) => (
                      <div key={id}>
                        {messageType === 1 ? (
                          <div
                            className={`d-flex ${
                              isAdmin === 1
                                ? "justify-content-end"
                                : "justify-content-start"
                            }  mb-4`}
                          >
                            <div
                              className={` image-container ${
                                isAdmin === 1
                                  ? "msg_cotainer_send"
                                  : "msg_cotainer"
                              }`}
                            >
                              <img
                                alt=' name'
                                className='chat-image'
                                url={`${attachment}`}
                                onClick={() =>
                                  setShowAttachment(`${attachment}`)
                                }
                              />
                              {message}
                              <span className='msg_time'>
                                {moment(new Date(createdAt * 1000)).fromNow()}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div
                            className={`d-flex ${
                              isAdmin === 1
                                ? "justify-content-end"
                                : "justify-content-start"
                            }  mb-4`}
                          >
                            <div
                              className={`${
                                isAdmin === 1
                                  ? "msg_cotainer_send"
                                  : "msg_cotainer"
                              }`}
                            >
                              <div className='username'>
                                {isAdmin === 1
                                  ? "Support team"
                                  : senderId === selectedChat?.freelancerId
                                  ? senderName
                                  : receiverName}
                              </div>
                              {message}
                              <span className='msg_time'>
                                {moment(new Date(createdAt * 1000)).fromNow()}
                              </span>
                            </div>
                          </div>
                        )}{" "}
                      </div>
                    )
                  )}
                {showClientChat &&
                  allMessages.map(
                    ({
                      message,
                      id,
                      isSendAdmin: isAdmin,
                      created: createdAt,
                      messageType,
                      attachment,
                      senderInfo,
                      freelancerId,
                      jobUserId,
                      senderId,
                      freelancerName,
                      jobUserName,
                    }) => (
                      <div key={id}>
                        {messageType === 1 ? (
                          <div
                            className={`d-flex ${
                              isAdmin === 1
                                ? "justify-content-end"
                                : "justify-content-start"
                            }  mb-4`}
                          >
                            <div
                              className={` image-container ${
                                isAdmin === 1
                                  ? "msg_cotainer_send"
                                  : "msg_cotainer"
                              }`}
                            >
                              <img
                                alt=' name'
                                className='chat-image'
                                url={`${attachment}`}
                                onClick={() =>
                                  setShowAttachment(`${attachment}`)
                                }
                              />
                              {message}
                              <span className='msg_time'>
                                {moment(new Date(createdAt * 1000)).fromNow()}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div
                            className={`d-flex ${
                              isAdmin === 1
                                ? "justify-content-end"
                                : "justify-content-start"
                            }  mb-4`}
                          >
                            <div
                              className={`${
                                isAdmin === 1
                                  ? "msg_cotainer_send"
                                  : "msg_cotainer"
                              }`}
                            >
                              <div className='username'>
                                {isAdmin === 1
                                  ? "Support team"
                                  : senderId === freelancerId
                                  ? freelancerName
                                  : jobUserName}
                              </div>
                              {message}
                              <span className='msg_time'>
                                {moment(new Date(createdAt * 1000)).fromNow()}
                              </span>
                            </div>
                          </div>
                        )}{" "}
                      </div>
                    )
                  )}
                <div ref={chatRef} />
              </div>
              <div className='card-footer'>
                <div className='input-group'>
                  <div onClick={openFile} className='input-group-append'>
                    <span className='input-group-text attachment'>
                      <input
                        type='file'
                        ref={inputRef}
                        onChange={handleInputFile}
                        className='hide'
                        accept='image/*'
                      />
                    </span>
                  </div>
                  <input
                    type='text'
                    onChange={({ target: { value } }) => setMessage(value)}
                    placeholder='Type your message... '
                    value={message}
                    onKeyDown={sendMessageByEnter}
                  />

                  <div onClick={sendMessage} className='input-group-append'>
                    <span className='input-group-text send_btn'></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showAttachment && (
        <ChatImageView
          isOpen={showAttachment}
          onClose={() => setShowAttachment("")}
          attachment={showAttachment}
        />
      )}
    </Container>
  );
};

export default memo(ChatScreen);
