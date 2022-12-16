import axios from 'axios'
import Helmet from 'react-helmet'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import thankyou from '../../../../assets/img/thankyou.png'
import Loader from '../../../../components/Loader/Loader'
import ComverseLogo from '../../../../../src/assets/img/ComverseLogo.png'
import defaultImage from '../../../../../src/assets/img/productImagePlaceholder.png'
import { setCheckoutId } from '../../../../redux/slices/checkoutSlice'
import './ThankyouPage.scss'
import { useSelector } from 'react-redux'

const ThankyouPage = () => {
  let orderNo = useParams().id
  // console.log("orderNo", orderNo);
  let checkoutID = localStorage.getItem('checkout_id')

  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cartDetail, setCartDetail] = useState(null)

  const defaultCountry = useSelector(
    (state) => state.multiLocation.defaultCountry
  )

  const defaultCurrency = useSelector(
    (state) => state.multiLocation.defaultCurrency
  )

  const dispatch = useDispatch()
  const getDetails = () => {
    if (checkoutID) {
      axios
        .get(
          process.env.REACT_APP_BACKEND_HOST +
            '/order/checkout_thankyou/' +
            orderNo +
            '?country=' +
            defaultCountry
        )
        .then((response) => {
          // console.log(response)

          setLoading(false)
          setDetail(response.data)
        })

      let body = {
        order_id: orderNo,
        checkout_id: checkoutID,
        country: defaultCountry,
      }

      axios
        .post(
          process.env.REACT_APP_BACKEND_HOST + '/order/shipping_price',
          body
        )
        .then((response) => {
          setCartDetail(response.data)
        })
        .catch((err) => {
          console.log(err)
        })

      localStorage.removeItem('checkout_id')
      localStorage.removeItem('cart')
      localStorage.removeItem('cartTotal')

      dispatch(setCheckoutId(''))
    } else {
      //window.location.href = '/orderDetail/' + orderNo
    }
  }
  useEffect(() => {
    getDetails()
  }, [])
  return (
    <>
      {/* <div>ThankyouPage</div> */}
      <div className='checkout-page'>
        {loading ? (
          <Loader />
        ) : (
          <div className='k-row checkout-wrapper'>
            <div className='checkout-details'>
              <div className='logo'>
                <a href='/'>
                  <img src={ComverseLogo} alt='Comverse' />
                </a>
              </div>

              <div className='thankyou-page'>
                {detail?.name ? (
                  <>
                    <div className='thankyou-logo-wrapper'>
                      <img src={thankyou} alt='Thank u img' />
                      <div>
                        <p>
                          Order no: <span>{detail.order_id}</span>
                        </p>
                        <h2>Thank You</h2>
                      </div>
                    </div>
                    <div>
                      <div className='order-confirm-note'>
                        <h5>Your order is confirmed</h5>
                        <p>
                          You'll receive a confirmation email with your order
                          number shortly
                        </p>
                      </div>
                      <div className='customer-info-wrapper'>
                        <h5>Customer Information</h5>
                        <div className='customer-info'>
                          <div>
                            <div className='divi'>
                              <h5>Contact Information</h5>
                              <p>
                                {detail.customer_email
                                  ? detail.customer_email
                                  : detail.customer_phone}
                              </p>
                            </div>

                            <div className='divi detail'>
                              <h5>Shipping Address</h5>
                              <p>
                                {detail.shipping_address.first_name +
                                  ' ' +
                                  detail.shipping_address.last_name}
                              </p>
                              <p>{detail.shipping_address.phone}</p>
                              <p>
                                {detail.shipping_address.apartment
                                  ? detail.shipping_address.apartment
                                  : null}{' '}
                                {detail.shipping_address.address}
                              </p>
                              <p>{detail.shipping_address.city}</p>
                              <p>{detail.shipping_address.country}</p>
                              <p>{detail.shipping_address.postal_code}</p>
                            </div>

                            {/* <div className="divi">
                            <h5>Shipping Method</h5>
                            <p>Standard</p>
                          </div> */}
                          </div>

                          <div>
                            <div className='divi'>
                              <h5>Payment Method</h5>
                              <p>{detail.payment_method}</p>
                            </div>

                            <div className='divi detail'>
                              <h5>Billing Address</h5>
                              <p>
                                {detail.billing_address.first_name +
                                  ' ' +
                                  detail.billing_address.last_name}
                              </p>
                              <p>{detail.billing_address.phone}</p>
                              <p>
                                {detail.billing_address.apartment
                                  ? detail.billing_address.apartment
                                  : null}{' '}
                                {detail.billing_address.address}
                              </p>
                              <p>{detail.billing_address.city}</p>
                              <p>{detail.billing_address.country}</p>
                              <p>{detail.billing_address.postal_code}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div></div>
                    </div>
                  </>
                ) : null}
              </div>
            </div>

            {cartDetail ? (
              <div className='cart-details'>
                <div className='cart-details__wrap'>
                  <div className='cart__lineitem-wrap'>
                    {cartDetail.list_items.map((lineItem, key) => {
                      {
                        return (
                          // 'vendor-splitting' class for spliting
                          <div className='' key={key}>
                            <Helmet>
                              <title>ThankYou Page | COMVERSE</title>
                              <meta
                                name='description'
                                content='this Page is about te ThankYou Page'
                              />
                              <meta
                                name='keyword'
                                content='ThankYou Page details '
                              />
                            </Helmet>
                            {/* <h5 className="vendor-title">Vendor: {lineItem.vendor}</h5> */}
                            {lineItem.items.map((item, key) => {
                              return (
                                <div key={key}>
                                  <div className='cart__lineitem'>
                                    <div className='cart__lineitem-img'>
                                      {/* <div className="item-quantity">{item.quantity}</div> */}
                                      <img
                                        src={
                                          item.image ? item.image : defaultImage
                                        }
                                        alt={item.product}
                                      />
                                      <span className='line-item-quant'>
                                        {' '}
                                        {item.quantity}{' '}
                                      </span>
                                    </div>
                                    <div className='cart__lineitem-info-wrap'>
                                      <div class='cart__lineitem-info'>
                                        <h5>{item.product}</h5>
                                        <p>{item.variant_name}</p>
                                      </div>
                                      <div class='cart__lineitem-price'>
                                        <h5>
                                          {defaultCurrency} {item.price}
                                        </h5>
                                        <p>Shipping: {item.shipping}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )
                      }
                    })}
                  </div>
                  {/* <div className="cart__discountCode-wrap">
                    <Input type="text" placeholder='Discount Code' />
                    <button className="primary-button">Apply</button>
                  </div> */}
                  <div className='cart__SubtotalPrice-wrap'>
                    <p>
                      <span>Subtotal</span>
                      <h4>
                        {defaultCurrency} {cartDetail.total_price.subtotal}
                      </h4>
                    </p>
                    <p>
                      <span>Total Shipping</span>
                      <h4>
                        {defaultCurrency}
                        {cartDetail.total_price.shipping_amount}
                      </h4>
                    </p>
                  </div>
                  <div className='cart__totalPrice-wrap'>
                    <p>
                      <h4>Total</h4>
                      <h2>
                        <small> {defaultCurrency}</small>
                        {cartDetail.total_price.total}
                      </h2>
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </>
  )
}

export default ThankyouPage
