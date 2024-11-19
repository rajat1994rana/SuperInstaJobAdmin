import React, { Component } from "react";
import { injectIntl } from "react-intl";

import {
  UncontrolledDropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
} from "reactstrap";

import { Redirect } from "react-router-dom";

import {
  menuHiddenBreakpoint,
  searchPath,
} from "../../constants/defaultValues";
import { getData } from "../../utils/helper";

import TopnavDarkSwitch from "./Topnav.DarkSwitch";

import { getDirection, setDirection } from "../../helpers/Utils";

class WebNav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isInFullScreen: false,
      searchKeyword: "",
      redirect: false,
      profile: false,
      loginInfo: {
        name: "Admin Admin",
      },
    };
  }

  componentDidMount() {
    this.setState({ loginInfo: getData("userInfo") });
  }

  handleChangeLocale = (locale, direction) => {
    this.props.changeLocale(locale);

    const currentDirection = getDirection().direction;
    if (direction !== currentDirection) {
      setDirection(direction);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  isInFullScreen = () => {
    return (
      (document.fullscreenElement && document.fullscreenElement !== null) ||
      (document.webkitFullscreenElement &&
        document.webkitFullscreenElement !== null) ||
      (document.mozFullScreenElement &&
        document.mozFullScreenElement !== null) ||
      (document.msFullscreenElement && document.msFullscreenElement !== null)
    );
  };

  handleSearchIconClick = (e) => {
    if (window.innerWidth < menuHiddenBreakpoint) {
      let elem = e.target;
      if (!e.target.classList.contains("search")) {
        if (e.target.parentElement.classList.contains("search")) {
          elem = e.target.parentElement;
        } else if (
          e.target.parentElement.parentElement.classList.contains("search")
        ) {
          elem = e.target.parentElement.parentElement;
        }
      }

      if (elem.classList.contains("mobile-view")) {
        this.search();
        elem.classList.remove("mobile-view");
        this.removeEventsSearch();
      } else {
        elem.classList.add("mobile-view");
        this.addEventsSearch();
      }
    } else {
      this.search();
    }
  };
  addEventsSearch = () => {
    document.addEventListener("click", this.handleDocumentClickSearch, true);
  };
  removeEventsSearch = () => {
    document.removeEventListener("click", this.handleDocumentClickSearch, true);
  };

  handleDocumentClickSearch = (e) => {
    let isSearchClick = false;
    if (
      e.target &&
      e.target.classList &&
      (e.target.classList.contains("navbar") ||
        e.target.classList.contains("simple-icon-magnifier"))
    ) {
      isSearchClick = true;
      if (e.target.classList.contains("simple-icon-magnifier")) {
        this.search();
      }
    } else if (
      e.target.parentElement &&
      e.target.parentElement.classList &&
      e.target.parentElement.classList.contains("search")
    ) {
      isSearchClick = true;
    }

    if (!isSearchClick) {
      const input = document.querySelector(".mobile-view");
      if (input && input.classList) input.classList.remove("mobile-view");
      this.removeEventsSearch();
      this.setState({
        searchKeyword: "",
      });
    }
  };
  handleSearchInputChange = (e) => {
    this.setState({
      searchKeyword: e.target.value,
    });
  };
  handleSearchInputKeyPress = (e) => {
    if (e.key === "Enter") {
      this.search();
    }
  };

  search = () => {
    this.props.history.push(searchPath + "/" + this.state.searchKeyword);
    this.setState({
      searchKeyword: "",
    });
  };

  toggleFullScreen = () => {
    const isInFullScreen = this.isInFullScreen();

    var docElm = document.documentElement;
    if (!isInFullScreen) {
      if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
      } else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
      } else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen();
      } else if (docElm.msRequestFullscreen) {
        docElm.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    this.setState({
      isInFullScreen: !isInFullScreen,
    });
  };

  handleLogout = () => {
    localStorage.clear();
    this.setState({ redirect: true, profile: false });
  };

  menuButtonClick = (e, menuClickCount, containerClassnames) => {
    e.preventDefault();

    setTimeout(() => {
      var event = document.createEvent("HTMLEvents");
      event.initEvent("resize", false, false);
      window.dispatchEvent(event);
    }, 350);
    this.props.setContainerClassnames(
      ++menuClickCount,
      containerClassnames,
      this.props.selectedMenuHasSubItems
    );
  };
  mobileMenuButtonClick = (e, containerClassnames) => {
    e.preventDefault();
    this.props.clickOnMobileMenu(containerClassnames);
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to='/login' />;
    }

    return (
      <nav className='navbar fixed-top'>
        <div />
        <a className='navbar-logo'>
          <img
            height='50px'
            style={{ borderRadius: "50%" }}
            src='/assets/img/logo.png'
          />
          <span className='logo-mobile d-block d-xs-none' />
        </a>

        <div className='navbar-right'>
          {/* <TopnavDarkSwitch /> */}
          <div className='header-icons d-inline-block align-middle'>
            <button
              className='header-icon btn btn-empty d-none d-sm-inline-block'
              type='button'
              id='fullScreenButton'
              onClick={this.toggleFullScreen}
            >
              {this.state.isInFullScreen ? (
                <i className='simple-icon-size-actual d-block' />
              ) : (
                <i className='simple-icon-size-fullscreen d-block' />
              )}
            </button>
          </div>
          <div className='user d-inline-block'>
            <UncontrolledDropdown className='dropdown-menu-right'>
              <DropdownToggle className='p-0' color='empty'>
                <span className='name mr-1'>{this.state.loginInfo.name} </span>
                <span>
                  <img
                    alt='Profile'
                    src={
                      this.state.loginInfo.profile
                        ? this.state.loginInfo.profile
                        : "/assets/img/logo.png"
                    }
                  />
                </span>
              </DropdownToggle>
              <DropdownMenu className='mt-3' right>
                <DropdownItem divider />
                <DropdownItem onClick={() => this.handleLogout()}>
                  Sign out
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        </div>
      </nav>
    );
  }
}

export default WebNav;
