import moment from 'moment'
import { Collapse } from 'antd'
import { message, Button } from 'antd'
import Axios from 'axios'
import React, { useEffect, useState } from 'react'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import './WalletPage.scss'
import { useSelector } from 'react-redux'
import Helmet from 'react-helmet'

const { Panel } = Collapse
const WalletPage = (props) => {
  const [wallet, setwallet] = useState({})
  const [redeemPoints, setredeemPoints] = useState({})
  const [loyaltyPoints, setloyaltyPoints] = useState({})
  const currency = useSelector((state) => state.currency)
  let wallett = ''
  const [history, sethistory] = useState([])
  let showRedeemError = false
  let redeemError = false
  let coupon_id = ''
  const token = sessionStorage.getItem('comverse_customer_token')
  const customer_id = sessionStorage.getItem('comverse_customer_id')
  const defaultCountry = useSelector(
    (state) => state.multiLocation.defaultCountry
  )
  const defaultCurrency = useSelector(
    (state) => state.multiLocation.defaultCurrency
  )
  const onChange = (key) => {
    // console.log(key);
  }

  useEffect(() => {
    if (customer_id && token) {
      // console.log("loged in");
    } else {
      window.location.href = '/'
    }
    getwallet()
  }, [defaultCountry])

  const getwallet = async () => {
    await Axios.get(
      process.env.REACT_APP_BACKEND_HOST +
        '/storefront/get_wallet/' +
        customer_id +
        '?country=' +
        defaultCountry,
      {
        headers: {
          pushpa: sessionStorage.getItem('comverse_customer_token'),
        },
      }
    )
      .then((response) => {
        setwallet(response.data)
        wallett = response?.data?.id
        setredeemPoints(response?.data.loyalty_points?.points)
      })
      .catch(function (error) {
        console.log('Wallet Api Error', error)
      })
    getHistory()
  }

  const getHistory = async () => {
    // debugger
    await Axios.get(
      process.env.REACT_APP_BACKEND_HOST +
        '/storefront/get_wallet_history/' +
        wallett +
        '?country=' +
        defaultCountry,
      {
        headers: {
          pushpa: sessionStorage.getItem('comverse_customer_token'),
        },
      }
    ).then((response) => {
      sethistory(response?.data)
    })
  }

  const handleChange = (event) => {
    if (event.target.value <= redeemPoints) {
      setloyaltyPoints(event.target.value)
    } else {
      redeemError = 'Input Points are greater then avialable Loyalty Points'
      showRedeemError = true
      error(redeemError)
    }
  }

  message.config({
    top: 0,
    duration: 2,
    maxCount: 1,
  })

  const error = (err) => {
    debugger
    message.error(err)
  }

  const success = (err1) => {
    message.success(err1)
  }

  const redeemCoupan = (id) => {
    let body = {
      coupon_id: id,
      customer_id: sessionStorage.getItem('comverse-customer-id'),
    }
    Axios.post(
      process.env.REACT_APP_BACKEND_HOST +
        '/storefront/redeem_coupon' +
        '?token=' +
        token,
      body
    )
      .then((response) => {
        getwallet()
        success(response.data.detail)
      })
      .catch((err) => {
        console.log('Points', err)
        error(err.data.detail)
      })
  }

  const redeemLoyaltyPoints = () => {
    // debugger;
    let body = {
      points: loyaltyPoints,
      customer_id: sessionStorage.getItem('comverse_customer_id'),
    }
    Axios.post(
      process.env.REACT_APP_BACKEND_HOST +
        '/storefront/redeem_loyalty_points' +
        '?token=' +
        token,
      body
    )
      .then((response) => {
        // debugger
        getwallet()
        success(response.data.details)
        // console.log("Points", response);
      })
      .catch((err) => {
        console.log('Redeem Err', err)
        redeemError = err.response.data.details
        showRedeemError = true
        error(err.response.data.details)
      })
  }

  return (
    <>
      <div className='wallet-main-container'>
        <Helmet>
          <title>Wallet | COMVERSE</title>
          <meta name='description' content='' />
          <meta name='keyword' content='' />
        </Helmet>
        <div className='div-styling balance'>
          <p className='title'>TOTAL BALANCE</p>
          {wallet?.value ? (
            <p className='details'>
              {wallet.value} {defaultCurrency}
            </p>
          ) : (
            <p className='details'>0.00 {defaultCurrency}</p>
          )}
        </div>
        <div className='div-styling'>
          <p className='title'>Your Loyalty Points</p>
          {wallet?.loyalty_points?.points > 0 ? (
            <>
              <p className='details'>{wallet?.loyalty_points?.points} Points</p>
            </>
          ) : (
            <p className='details'>0 Points</p>
          )}
        </div>
        <Collapse
          accordion
          expandIconPosition='right'
          defaultActiveKey={['1']}
          onChange={onChange}
        >
          {wallet?.loyalty_points?.points > 0 ? (
            <>
              <Panel header='Redeem Loyalty Points  ' key='1'>
                {wallet ? (
                  <>
                    <div className='ui input redeem-input'>
                      <div>
                        <input
                          className='points'
                          // value={loyaltyPoints}
                          onChange={handleChange}
                          type='text'
                          placeholder='Type points'
                          max={redeemPoints}
                        />
                      </div>
                      <div>
                        <p className='total-value'>
                          &divide; &nbsp;
                          {wallet?.loyalty_points?.amount_equal_point} = &nbsp;
                          {loyaltyPoints /
                            wallet?.loyalty_points?.amount_equal_point >
                          0
                            ? loyaltyPoints /
                              wallet?.loyalty_points?.amount_equal_point
                            : 0}
                        </p>
                      </div>
                    </div>
                    <Button
                      className='button'
                      type='submit'
                      onClick={redeemLoyaltyPoints}
                    >
                      REDEEM
                    </Button>

                    {showRedeemError ? error() : null}
                  </>
                ) : null}
              </Panel>
            </>
          ) : null}
          <Panel header='COUPONS' key='2'>
            {wallet.coupons?.length ? (
              <>
                {wallet.coupons?.map((coupon, key) => {
                  return (
                    <>
                      <div className='coupans' key={key}>
                        <div>
                          <p className='coupan-code'>
                            {coupon.name} {coupon.value}
                          </p>
                        </div>
                        {new Date(coupon.expiry_date) < Date.now() ? (
                          <Button
                            className='redeem expired'
                            type='submit'
                            disabled
                          >
                            Expired
                          </Button>
                        ) : (
                          <Button
                            className='redeem redeem-sucessful'
                            type='submit'
                            onClick={(e) => redeemCoupan(coupon.id)}
                          >
                            Redeem
                          </Button>
                        )}
                      </div>
                    </>
                  )
                })}
              </>
            ) : (
              <p className='detail'>No Coupons Found</p>
            )}
          </Panel>
          <Panel header='HISTORY' key='3'>
            {history?.length ? (
              <>
                {history.map((his, index) => {
                  return (
                    <div className='coupans history' key={index}>
                      <div className='coupans'>
                        <div className='arrow-div'>
                          {his.action == 'Debited' ? (
                            <ArrowUpOutlined style={{ color: 'red' }} />
                          ) : (
                            <ArrowDownOutlined style={{ color: 'green' }} />
                          )}
                        </div>
                        <p>
                          {his.action} by {his.type}
                        </p>
                      </div>
                      <div>
                        <p className='time'>
                          {moment(his.created_at).format(
                            'h:mm:ss a, MMM Do YYYY'
                          )}
                        </p>
                        {his.action == 'Debited' ? (
                          <p className='debit_amount'>{his.value}</p>
                        ) : (
                          <p className='credit_amount'>{his.value}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </>
            ) : (
              <p className='detail'>No History Found</p>
            )}
          </Panel>
        </Collapse>
      </div>
    </>
  )
}

export default WalletPage
