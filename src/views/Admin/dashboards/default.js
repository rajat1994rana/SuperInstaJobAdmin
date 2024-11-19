import React, { Fragment, useState, useEffect } from "react";
import { injectIntl } from "react-intl";
import { Row } from "reactstrap";
import { Link } from "react-router-dom";
import { Colxx, Separator } from "components/common/CustomBootstrap";
import GradientWithRadialProgressCard from "components/cards/GradientWithRadialProgressCard";
import { dashBoard } from "Apis/admin";
import { NotificationManager } from "components/common/react-notifications";
const DefaultDashboard = React.memo(() => {
  const [dashBoardData, setDashboardData] = useState({
    activeFreelancers: 0,
    activeUser: 0,
    totalFreelancers: 0,
    totalUser: 0,
    totalCategories: 0,
    totalSubCategories: 0,
    totalJobs: 0,
    blackListUser: 0,
  });
  useEffect(() => {
    dashBoard()
      .then((res) => {
        const { data } = res;
        console.log(data);
        updateData(data.data);
      })
      .catch((err) => {
        if (err.response) {
          const { data } = err.response;
          NotificationManager.warning(
            data.error_message,
            "Something went wrong",
            4000,
            null,
            null,
            ""
          );
        }
      });
  }, []);
  const updateData = (data) => {
    setDashboardData({ ...data });
  };
  return (
    <Fragment>
      <Row>
        <Colxx xxs='12'>
          <h1>Dashboard</h1>
          <Separator className='mb-5' />
        </Colxx>
      </Row>
      <Row>
        <Colxx lg='12' md='12'>
          <Row>
            <Colxx lg='4' xl='4' className='mb-4'>
              <Link to='/users'>
                <GradientWithRadialProgressCard
                  icon='iconsminds-male-female'
                  title={`${dashBoardData.totalUser} Total Users`}
                  detail=''
                />
              </Link>
            </Colxx>
            <Colxx lg='4' xl='4' className='mb-4'>
              <Link to='/users/1'>
                <GradientWithRadialProgressCard
                  icon='iconsminds-male-female'
                  title={`${dashBoardData.activeUser} Active Users`}
                  detail=''
                />
              </Link>
            </Colxx>
            <Colxx lg='4' xl='4' className='mb-4'>
              <Link to='/freelancers'>
                <GradientWithRadialProgressCard
                  icon='simple-icon-people'
                  title={`${dashBoardData.totalFreelancers} Total Freelancers`}
                  detail=''
                />
              </Link>
            </Colxx>
            <Colxx lg='4' xl='4' className='mb-4'>
              <Link to='/freelancers/1'>
                <GradientWithRadialProgressCard
                  icon='simple-icon-people'
                  title={`${dashBoardData.activeFreelancers} Active Freelancers`}
                  detail=''
                />
              </Link>
            </Colxx>
            <Colxx lg='4' xl='4' className='mb-4'>
              <Link to='/categories'>
                <GradientWithRadialProgressCard
                  icon='iconsminds-diploma-2'
                  title={`${dashBoardData.totalCategories} Total Catagories`}
                  detail=''
                />
              </Link>
            </Colxx>
            <Colxx lg='4' xl='4' className='mb-4'>
              <Link to='/sub-categories'>
                <GradientWithRadialProgressCard
                  icon='iconsminds-newsvine'
                  title={`${dashBoardData.totalSubCategories} Total Sub Categories`}
                  detail=''
                />
              </Link>
            </Colxx>
            <Colxx lg='4' xl='4' className='mb-4'></Colxx>
            <Colxx lg='4' xl='4' className='mb-4'>
              <Link to='/bookings/3'>
                <GradientWithRadialProgressCard
                  icon='iconsminds-billing'
                  title={`$${dashBoardData.blackListUser} Blocked Users`}
                  detail=''
                />
              </Link>
            </Colxx>
            <Colxx lg='2' xl='2' className='mb-4'></Colxx>
            <Colxx lg='4' xl='4' className='mb-4'></Colxx>
          </Row>
        </Colxx>
      </Row>
    </Fragment>
  );
});
export default injectIntl(DefaultDashboard);
