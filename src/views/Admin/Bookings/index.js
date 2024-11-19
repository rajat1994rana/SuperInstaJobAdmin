import React, { Fragment, useState, useEffect } from 'react';
import { Row, Col, Label } from 'reactstrap';
import ListPageHeading from 'containers/pages/ListPageHeading';
import Pagination from 'containers/pages/Pagination';
import ImagePreView from 'components/PerviewImage/ModalView';
import { BookingListData, allCategories } from 'Apis/admin';
import { NotificationManager } from 'components/common/react-notifications';
import { convertDate, convertDateTime } from 'constants/defaultValues';
import { additional, dateRange, paymentType, bookingStatus } from './constants';
const BookingList = React.memo((props) => {
	const [pageInfo, setPageInfo] = useState(additional);
	const [totalBooking, setTotalPost] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedPageSize, setSelectedPageSize] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchText, setSearchtext] = useState(undefined);
	const [viewImage, setViewImage] = useState(false);
	const [imagePath] = useState('');
	const [categories, setCategories] = useState([]);
	const [filters, setFilters] = useState({
		serviceId: '',
		dateRange: 0,
		statusBooking: '',
	});
	useEffect(() => {
		allCategories()
			.then(({ data }) => {
				setCategories(data.data.result);
			})
			.catch();
	}, []);
	useEffect(() => {
		BookingListData(
			currentPage,
			selectedPageSize,
			searchText,
			props.match?.params?.status || '',
			filters
		)
			.then((res) => {
				const { data } = res;
				const { result, pagination } = data.data;
				setIsLoading(false);
				setTotalPost(result);
				additional.totalItemCount = pagination.totalRecord;
				additional.selectedPageSize = pagination.limit;
				additional.totalPage = pagination.totalPage;
				setPageInfo({ ...additional });
			})
			.catch((err) => {
				setIsLoading(false);
				if (err.response) {
					const { data } = err.response;
					NotificationManager.warning(
						data.error_message,
						'Something went wrong',
						3000,
						null,
						null,
						''
					);
				}
			});
	}, [selectedPageSize, currentPage, searchText, filters]);
	const onSearchKey = (event) => {
		setSearchtext(event.target.value);
	};
	const changePageSize = (value) => {
		setIsLoading(true);
		setSelectedPageSize(value);
	};
	const onChangePage = (value) => {
		setCurrentPage(value);
	};
	const DeleteDataLocal = (key) => {
		totalBooking.splice(key, 1);
		setTotalPost([...totalBooking]);
	};
	const handleLocalData = ({ target: { name, value } }) => {
		setFilters({ ...filters, [name]: value });
	};

	const startIndex = (currentPage - 1) * selectedPageSize;
	const endIndex = currentPage * selectedPageSize;
	return isLoading ? (
		<div className='loading' />
	) : (
		<Fragment>
			<ListPageHeading
				match={props.match}
				heading='Bookings'
				changePageSize={changePageSize}
				selectedPageSize={selectedPageSize}
				totalItemCount={pageInfo.totalItemCount}
				startIndex={startIndex}
				endIndex={endIndex}
				onSearchKey={onSearchKey}
				orderOptions={pageInfo.orderOptions}
				pageSizes={pageInfo.pageSizes}
			/>
			<Row className='mb-4'>
				<Col md='2'></Col>
				<Col md='4'>
					<Label>Service Name</Label>
					<select
						onChange={handleLocalData}
						name='serviceId'
						className='form-control'
					>
						<option value=''>--Select Service--</option>
						{categories.map(({ name, id }) => (
							<option key={id} value={id}>
								{name}
							</option>
						))}
					</select>
				</Col>
				<Col md='4'>
					<Label>Booking Status</Label>
					<select
						onChange={handleLocalData}
						name='statusBooking'
						className='form-control'
					>
						<option value=''>--Select Booking Status</option>
						{Object.keys(bookingStatus).map((value) => (
							<option key={value} value={value}>
								{bookingStatus[value]}
							</option>
						))}
					</select>
				</Col>
				<Col md='2'></Col>
			</Row>
			<table className='table table-striped animate__animated  animate__zoomIn animate__fadeInDown'>
				<thead>
					<tr>
						<th>#</th>
						<th>User Name</th>
						<th>Provider Name</th>
						<th>Service Name</th>
						<th>Total Price</th>
						<th>Payment Type</th>
						<th>Booking Status</th>
						<th>Start/End Time</th>
						<th>Booking Date</th>
					</tr>
				</thead>
				<tbody>
					{totalBooking.map((Booking, key) => (
						<tr key={Booking.id}>
							<td>{key + 1}</td>
							<td>{Booking.userName}</td>
							<td>{Booking.providerName}</td>
							<td>{JSON.parse(Booking.serviceDetails)?.name}</td>
							<td>{Booking.totalPrice}</td>
							<td>
								<span className='badge badge-pill badge-success'>
									{paymentType[Booking.paymentType]}
								</span>
							</td>
							<td>
								<span className='badge badge-pill badge-primary'>
									{bookingStatus[Booking.status]}
								</span>
							</td>
							<td>
								{convertDateTime(Booking.bookingStartTime)} /{' '}
								{convertDateTime(Booking.bookingEndTime)}
							</td>
							<td>{convertDate(Booking.bookingDate)}</td>
						</tr>
					))}
					{totalBooking.length === 0 && (
						<tr className=''>
							<td colSpan='9'>
								<h2 className='bg-red'>No record Found</h2>
							</td>
						</tr>
					)}
				</tbody>
			</table>
			<ImagePreView
				imagePath={imagePath}
				showModel={viewImage}
				onClose={(value) => setViewImage(value)}
			/>
			<Pagination
				currentPage={currentPage}
				totalPage={pageInfo.totalPage}
				onChangePage={(i) => onChangePage(i)}
			/>
		</Fragment>
	);
});

export default BookingList;
