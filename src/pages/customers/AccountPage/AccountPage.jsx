import axios from 'axios'
import moment from 'moment'
import { Link, Navigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import { logoutReducer } from '../../../redux/slices/accountSlice'
import PasswordChangeModal from './sections/PasswordChangeModal/PasswordChangeModal'
import AddressChangeModal from './sections/AddressChangeModal/AddressChangeModal'
import { Table } from 'antd'
import Helmet from 'react-helmet'

export const AccountPage = (props) => {
  const dispatch = useDispatch()
  const [routeTo, setRouteTo] = useState(false)
  const [customerDetail, setCustomerDetail] = useState({})

  useEffect(() => {
    // debugger;
    if (props.loggedIn) {
      axios
        .get(process.env.REACT_APP_BACKEND_HOST + '/storefront/account', {
          headers: {
            pushpa: sessionStorage.getItem('comverse_customer_token'),
          },
        })
        .then((response) => {
          // console.log('customer detail', response)
          setCustomerDetail(response.data)
        })
        .catch((err) => {
          if (err.response.status === 400) {
            sessionStorage.removeItem('comverse_customer_id')
            sessionStorage.removeItem('comverse_customer_token')
            sessionStorage.removeItem('comverse_customer_email')
            localStorage.removeItem('wishList')
            window.location.href = '/login'
          }
        })
    }
  }, [])

  const resetCustomerDetail = (customer) => {
    setCustomerDetail(customer)
  }
  const columns = [
    {
      title: 'Order No',
      dataIndex: 'orderno',
      key: 'orderno',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Payment Status',
      dataIndex: 'payment',
      key: 'payment',
    },
    {
      title: 'Track Order',
      dataIndex: 'trackorder',
      key: 'trackorder',
    },
    {
      title: 'Fullfillment Status',
      dataIndex: 'fulfillment_status',
      key: 'status',
    },
    {
      title: 'Review Status',
      dataIndex: 'reviewstatus',
      key: 'reviewstatus',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
    },
  ]
  var table = []
  for (var i = 0; i < customerDetail.orders?.length; i++) {
    table[i] = {
      key: i,
      orderno: customerDetail.orders[i]?.order_id,
      date: moment(customerDetail.orders[i]?.created_at).format('MMMM Do YYYY'),
      payment: customerDetail.orders[i]?.payment_status,
      trackorder: (
        <Link to={'/orderDetail/' + customerDetail.orders[i]?.order_id}>
          Track
        </Link>
      ),
      fulfillment_status: customerDetail.orders[i]?.fulfillment_status,
      reviewstatus: customerDetail.orders[i]?.order_status,
      total: customerDetail.orders[i]?.total_price,
    }
  }

  const logout = () => {
    if (!props.logOut) {
      // debugger;
      dispatch(logoutReducer())
      setRouteTo('/')
    }
  }
  return (
    <>
      <div className='account-page'>
        <Helmet>
          <title>Account | COMVERSE</title>
          <meta name='description' content='' />
          <meta name='keyword' content='' />
        </Helmet>
        {routeTo ? <Navigate to={routeTo} /> : null}
        <div className='container-xl'>
          {customerDetail.email ? (
            <>
              <div className='account-page-section account-info'>
                <div className='section-header'>
                  <h2 className='section-header-title'>My Account</h2>
                  <div className='section-header-action'>
                    <PasswordChangeModal
                      token={sessionStorage.getItem('comverse_customer_token')}
                    />
                    {/* <ChangePasswordModel token={token} /> */}
                    <button onClick={logout} className='logout'>
                      Logout
                    </button>
                  </div>
                </div>
                <div className='section-body'>
                  <h4>
                    {customerDetail.first_name + ' ' + customerDetail.last_name}
                  </h4>
                  <p>{customerDetail.email}</p>
                </div>
              </div>

              {/* <div className='heading'>
              <div className="account-detail">
                <h1>MY ACCOUNT</h1>
                <h4>{customerDetail.first_name + ' ' + customerDetail.last_name }</h4>
                <p>{customerDetail.email}</p>
              </div>
              <div className="logout-wrapper">
                /* <a href="/">Change Password</a> 
                <ChangePasswordModel token={token} />
                <button onClick={logout} className="logout">Logout</button>
              </div>
            </div> */}

              <div className='account-page-section order-details'>
                <div className='section-header'>
                  <h2 className='section-header-title'>Order Histroy</h2>
                </div>
                <div className='section-body'>
                  <div className='order-table-wrap'>
                    {customerDetail.orders.length ? (
                      <Table
                        columns={columns}
                        dataSource={table}
                        pagination={table.length > 10 ? true : false}
                      />
                    ) : (
                      <h5>No order history</h5>
                    )}
                  </div>
                </div>
              </div>

              {/* <div className="customer-order-detail-wrapper">
            <div className='table-heading'>
              <h1>ORDER HISTORY</h1>
            </div>
            {
              customerDetail.orders.length ? 
                <table className='order-history'>
                  <tr>
                    <th>order</th>
                    <th>date</th>
                    <th>payment status</th>
                    <th>track order</th>
                    <th>fullfillment status</th>
                    <th>review status</th>
                    <th>total</th>
                  </tr>

                  {
                    customerDetail.orders.map( (order) => {
                      return<>
                      <tr>
                        <td>{order.name}</td>
                        <td>{order.created_at}</td>
                        <td>{order.payment_status}</td>
                        <td><a href="/">Track</a></td>
                        <td>{order.fulfillment_status}</td>
                        <td>{order.order_status}</td>
                        <td>QAR{  order.total_price}</td>
                      </tr>
                      </>
                    })
                  }                
                  

                </table>
              : <h5>No order history</h5> 
            }
            </div> */}

              <div className='account-page-section account-addressess'>
                <div className='section-header'>
                  <h2 className='section-header-title'>Customer Addresses</h2>
                  <div className='section-header-action'>
                    <AddressChangeModal
                      address={{}}
                      buttonName='Create new address'
                      resetCustomerDetail={resetCustomerDetail}
                    />

                    {/* <Model
                      address={{}}
                      buttonName="Create new address"
                      resetCustomerDetail={resetCustomerDetail}
                    /> */}
                  </div>
                </div>
                <div className='section-body'>
                  <div className='customer-addressess-wrap'>
                    {customerDetail.address.length ? (
                      customerDetail.address.map((address, key) => {
                        return (
                          <div
                            addressId={address.id}
                            key={key}
                            className='customer-address-item'
                          >
                            <div>
                              <div className='customer-details'>
                                <span className='customer-name'>
                                  {address.first_name + ' ' + address.last_name}
                                </span>
                                <br />
                                <span className='customer-address'>
                                  {(address.apartment != null
                                    ? address.apartment
                                    : '') +
                                    ' ' +
                                    address.address}
                                </span>
                                <span className='customer-address'>
                                  {address.city}
                                </span>
                                <br />
                                <span className='postal-code'>
                                  {address.postal_code}
                                </span>
                                <span className='country'>
                                  {address.country}
                                </span>
                                <span className='phone-no'>
                                  {address.phone}
                                </span>
                              </div>
                              {/* edit address model */}
                              <div className='action-wrapper'>
                                {/* <Model
                                  address={address}
                                  buttonName="Edit address"
                                  resetCustomerDetail={resetCustomerDetail}
                                />
                                <Popup
                                  content="Delete Address"
                                  trigger={
                                    <ConfirmationModel
                                      token={token}
                                      id={address.id}
                                    />
                                  }
                                /> */}
                              </div>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <h4>No Address Available</h4>
                    )}
                  </div>
                </div>
              </div>

              {/* <div className='customer-details-wrapper'>
              <div className='heading'>
                <h1>Customer Addresses</h1>
                <div>
                  <Model address={{}} buttonName="Create new address" resetCustomerDetail={resetCustomerDetail} />
                </div>
              </div>
              <div className="customer-addresses">
                
              </div>
            </div> */}
            </>
          ) : (
            <></>
            // <Dimmer active inverted>
            //   <Loader inverted>Loading</Loader>
            // </Dimmer>
          )}
        </div>
      </div>
    </>
  )
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.account.loggedIn,
    logOut: state.account.logoutReducer,
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(AccountPage)
