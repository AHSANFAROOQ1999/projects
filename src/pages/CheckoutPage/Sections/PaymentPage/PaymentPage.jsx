import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { LeftOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { setCheckout } from '../../../../redux/slices/checkoutSlice'
import * as Yup from 'yup'

const PaymentPage = ({
  PrevStep,
  checkoutSetting,
  shippingAddress,
  selectedShippingMethod,
  total,
}) => {
  const [paymentMethods, setPaymentMethods] = useState()
  //const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
  const [showBillingAddressForm, setShowBillingAddressForm] = useState(false)
  const [totalShipping, setTotalShipping] = useState(0)
  //const [billingAddress, setBillingAddress] = useState({})
  const [payByWallet, setPayByWallet] = useState(false)
  const [walletDetails, setWalletDetails] = useState({})
  const [showPaymentMethods, setShowPaymentMethods] = useState(false) // shown when user unselected the payByWallet option

  // for billing address form
  const [countries, setCountries] = useState([])
  const [cities, setCities] = useState([])

  const defaultCountry = useSelector(
    (state) => state.multiLocation.defaultCountry
  )

  const dispatch = useDispatch()
  const checkout = useSelector((state) => state.checkout.checkoutObj)
  const loggedIn = useSelector((state) => state.account.loggedIn)

  const navigate = useNavigate()
  const getPaymentMethods = () => {
    // get payment methods
    axios
      .get(
        process.env.REACT_APP_BACKEND_HOST +
          '/order/payment_method_list?country=' +
          defaultCountry
      )
      .then((response) => {
        //console.log('getPaymentMethods', response)

        setPaymentMethods(response.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const placeOrder = (formValues) => {
    dispatch(setCheckout({ ...checkout, ...formValues }))
    //console.log('this is checkout', checkout)

    //this.setState({ loading: true })

    // window.fbq('track', 'Place Order',{
    //   emailOrPhone : this.state.customerEmailPhone.value,
    //   shippingPhoneno : this.state.phoneNo.value
    // });
    // console.log(window.fbq);

    // handling when user does not select anything and leave things as it is
    if (formValues.selectedPaymentMethod === null) {
      formValues.selectedPaymentMethod = paymentMethods[0]?.gateway_name
    }
    const checkoutId = localStorage.getItem('checkout_id')
      ? localStorage.getItem('checkout_id')
      : null

    let body = {
      payment_method: formValues.selectedPaymentMethod,
      checkout_id: checkoutId, // can get from redux
      billing_address: {},
      paid_by_wallet: payByWallet,
      country: defaultCountry,
    }
    if (formValues.addressType === 'shippingAddress') {
      body.billing_address = shippingAddress
    }
    if (formValues.addressType === 'billingAddress') {
      // billing detials comes from the form that opens when user clicks on the billing address

      let billingAddress = {
        first_name: formValues.firstName,
        last_name: formValues.lastName,
        phone: formValues.phone,
        address: formValues.address,
        apartment: formValues.placeType,
        city: formValues.city,
        country: formValues.country,
        postal_code: formValues.postalCode,
      }
      body.billing_address = billingAddress
    }

    axios
      .put(process.env.REACT_APP_BACKEND_HOST + '/order/checkout', body)

      .then((response) => {
        setTotalShipping(parseInt(response.total_shipping))
        /// formValues.selectedPaymentMethod === 'Cash on Delivery (COD)' || payByWallet
        if (checkoutId) {
          let orderBody = {
            checkout_id: checkoutId,
            country: defaultCountry,
          }
          axios
            .post(
              process.env.REACT_APP_BACKEND_HOST + '/order/place_order',
              orderBody
            )
            .then((response) => {
              // debugger

              //window.location.href = '/thankyou/' + response.data.order_id
              navigate('/thankyou/' + response.data.order_id)
            })
            .catch((err) => {
              console.log(err)
            })
        } else {
          window.location.href =
            process.env.REACT_APP_BACKEND_HOST +
            `/paymentgateway/pay2m_request?checkout_id=${this.state.checkoutId}`
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
  const getWallet = () => {
    axios
      .get(
        process.env.REACT_APP_BACKEND_HOST +
          '/storefront/get_wallet/' +
          sessionStorage.getItem('comverse_customer_id') +
          '?country=' +
          defaultCountry,
        {
          headers: {
            pushpa: sessionStorage.getItem('comverse_customer_token'),
          },
        }
      )
      .then((response) => {
        //console.log('getWallet', response)

        setWalletDetails(response.data)

        if (response.data.value > 0) {
          // debugger
          setPayByWallet(true)
        }
      })
  }

  // for billing address form

  const getCountries = () => {
    axios
      .get(process.env.REACT_APP_BACKEND_HOST + '/order/countries')
      .then((response) => {
        //console.log('getCountries', response)
        setCountries(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const getCities = async (countryKey) => {
    //debugger
    let countryId
    if (countryKey) {
      countryId = countries?.find(
        (country) => country.value === countryKey
      )?.key
    } else {
      countryId = countries[0]?.key
    }
    if (countryId) {
      await axios
        .get(
          process.env.REACT_APP_BACKEND_HOST +
            '/order/cities?country_id=' +
            countryId
        )
        .then((response) => {
          setCities(response.data)
          // console.log('getCities', response)
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }

  const validationSchema = Yup.object().shape({
    // first form
    // firstName: Yup.string()
    //   .min(2, 'Too Short!')
    //   .max(70, 'Too Long!')
    //   .when('lastName', {
    //     is: checkoutSetting?.full_name === 'first_name',
    //     then: Yup.string().required('Required'),
    //     otherwise: Yup.string(),
    //   }),
    firstName: Yup.string()
      .min(2, 'Too Short!')
      .max(70, 'Too Long!')
      .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field ')
      .required('Required'),

    lastName:
      checkoutSetting?.full_name !== 'first_name'
        ? Yup.string()
            .min(2, 'Too Short!')
            .max(70, 'Too Long!')
            .matches(
              /^[aA-zZ\s]+$/,
              'Only alphabets are allowed for this field '
            )
            .required('Required')
        : Yup.string()
            .min(2, 'Too Short!')
            .max(70, 'Too Long!')
            .matches(
              /^[aA-zZ\s]+$/,
              'Only alphabets are allowed for this field '
            ),
    address: Yup.string()
      .min(2, 'Too Short!')
      .max(70, 'Too Long!')
      .required('Required'),

    phone: Yup.string()
      .min(10, 'Please Enter Valid Phone No.')
      .max(13, 'Please Enter Valid Phone No.')
      .matches(/^((\+92)?(0092)?(92)?(0)?)(3)([0-9]{9})$/)
      .required('Required'),

    placeType:
      checkoutSetting?.address_second_line === 'optonal'
        ? Yup.string().min(2, 'Too Short!').max(70, 'Too Long!')
        : Yup.string()
            .min(2, 'Too Short!')
            .max(70, 'Too Long!')
            .required('Required'),
    country: Yup.string().required('Select Country'),
    city: Yup.string().required('Select City'),
    postalCode:
      checkoutSetting?.postal_code === 'optional'
        ? Yup.string().min(2, 'Too Short!').max(70, 'Too Long!')
        : Yup.string()
            .min(2, 'Too Short!')
            .max(70, 'Too Long!')
            .required('Required'),
  })

  useEffect(() => {
    getPaymentMethods()

    if (loggedIn) {
      getWallet()
    }
    // for billing address form
    getCountries()
    // getCities()
  }, [])

  return (
    <Formik
      initialValues={{
        selectedPaymentMethod: null,
        payByWallet: true,
        addressType: 'shippingAddress' || checkout?.addressType,

        // billing address form
        firstName: '',
        lastName: '',
        address: '',
        phone: '',
        placeType: '',
        country: '',
        city: '',
        postalCode: '',
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        // console.log(values)
        placeOrder(values)
        if (values.addressType === 'billingAddress') {
          if (!values.country) {
            values.country = countries[0].value
          }
          if (!values.city) {
            values.city = cities[0].value
          }
        }
        //nextStep()
      }}
    >
      {({ values, setFiedlValue, isValid }) => (
        <Form>
          <div className='change-info'>
            <div>
              <p>Contact</p>
              <p className='info'>{shippingAddress?.phone}</p>
              <p className='change-btn' onClick={() => PrevStep(1)}>
                Change
              </p>
            </div>
            <div>
              <p>Ship to</p>
              <p className='info'>{shippingAddress?.address}</p>
              <p className='change-btn' onClick={() => PrevStep(1)}>
                Change
              </p>
            </div>
            <div>
              <p>Method</p>
              <p className='info'>
                {Object.values(selectedShippingMethod).map((method, index) => (
                  <span>{method},</span>
                ))}
              </p>

              <p className='change-btn' onClick={() => PrevStep()}>
                Change
              </p>
            </div>
          </div>
          <div className='payment-method-wrapper'>
            <h2>Payment</h2>
            <p>All transactions are secure and encrypted.</p>
            <div className='payment-method'>
              {!loggedIn ? (
                <>
                  {paymentMethods?.map((method, index) => (
                    <div className='table-wrapper'>
                      <div className='input-label' key={index}>
                        <Field
                          name={'selectedPaymentMethod'}
                          value={method.gateway_name}
                          type='radio'
                          key={method.id}
                          checked={
                            index === 0
                              ? method.gateway_name
                              : values.selectedPaymentMethod ===
                                method.gateway_name
                          }
                          //checked={index === 0}
                        />
                        <p className='label'>{method.gateway_name}</p>
                      </div>

                      <p className='desc'>{method.description}</p>
                    </div>
                  ))}
                </>
              ) : checkoutSetting?.is_wallet && payByWallet ? (
                <div className='wallet-cod'>
                  <div className='table-wrapper'>
                    <div className='input-label'>
                      <Field
                        name='payByWallet'
                        value={true}
                        type='checkbox'
                        onClick={() => {
                          setShowPaymentMethods(!showPaymentMethods)
                          setFiedlValue('payByWallet', !payByWallet)
                        }}
                        checked={values.payByWallet === true}
                      />
                      <p className='label'>Pay by your Wallet</p>
                    </div>

                    <p>PKR {walletDetails.value}</p>
                  </div>
                  {showPaymentMethods && (
                    <>
                      {paymentMethods?.map((method, index) => (
                        <div className='table-wrapper'>
                          <div className='input-label' key={index}>
                            <Field
                              name={'selectedPaymentMethod'}
                              value={method.gateway_name}
                              type='radio'
                              key={method.id}
                              //checked={index === 0}
                              checked={
                                index === 0
                                  ? method.gateway_name
                                  : values.selectedPaymentMethod ===
                                    method.gateway_name
                              }
                            />
                            <p className='label'>{method.gateway_name}</p>
                          </div>

                          <p className='desc'>{method.description}</p>
                        </div>
                      ))}
                    </>
                  )}
                  {total > walletDetails.value && (
                    <>
                      <p className='cod-remaining'>
                        Pay Remaining Amount Through:
                      </p>
                      {paymentMethods?.map((method, index) => (
                        <div className='table-wrapper'>
                          <div className='input-label'>
                            <Field
                              name={'selectedPaymentMethod'}
                              value={method.gateway_name}
                              type='radio'
                              key={method.id}
                              checked={
                                index === 0
                                  ? method.gateway_name
                                  : values.selectedPaymentMethod ===
                                    method.gateway_name
                              }
                            />
                            <p className='label'>{method.gateway_name}</p>
                          </div>
                          <p className='desc'>{method.description}</p>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              ) : (
                <>
                  {paymentMethods?.map((method, index) => (
                    <div className='table-wrapper'>
                      <div className='input-label' key={index}>
                        <Field
                          name={'selectedPaymentMethod'}
                          value={method.gateway_name}
                          type='radio'
                          key={method.id}
                          //checked={index === 0}
                          checked={
                            index === 0
                              ? method.gateway_name
                              : values.selectedPaymentMethod ===
                                method.gateway_name
                          }
                          onClick={() => {
                            dispatch(
                              setCheckout({
                                ...checkout,
                                selectedPaymentMethod: method.gateway_name,
                              })
                            )
                          }}
                        />
                        <p className='label'>{method.gateway_name}</p>
                      </div>

                      <p className='desc'>{method.description}</p>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
          <div className='address-wrapper'>
            <h2>Billing address</h2>
            <p>Select the address that matches your card or payment method.</p>
            <div className='address'>
              <div className='input-label'>
                <Field
                  name='addressType'
                  value='shippingAddress'
                  type='radio'
                  onClick={() => {
                    setShowBillingAddressForm(false)
                    dispatch(
                      setCheckout({
                        ...checkout,
                        addressType: 'shippingAddress',
                      })
                    )
                  }}

                  // checked={true}
                />
                <p className='label'>Same as shipping address</p>
              </div>
              <div className='input-label'>
                <Field
                  name='addressType'
                  value='billingAddress'
                  type='radio'
                  onClick={() => {
                    setShowBillingAddressForm(true)

                    dispatch(
                      setCheckout({
                        ...checkout,
                        addressType: 'billingAddress',
                      })
                    )
                  }}
                  checked={values.addressType === 'billingAddress'}
                />
                <p className='label'>Use a different billing address</p>
              </div>
            </div>
            {showBillingAddressForm && (
              <div className='billing-address-form'>
                <div className='billing-address'>
                  <h3>Billing address</h3>

                  <div className='half-inputs'>
                    <Field
                      name='firstName'
                      type='text'
                      placeholder='First Name'
                    />

                    <Field
                      name='lastName'
                      type='text'
                      placeholder='Last Name'
                    />
                  </div>
                  <div className='half-inputs'>
                    <ErrorMessage
                      component='span'
                      name='firstName'
                      className='yup-vald'
                    />
                    <ErrorMessage
                      component='span'
                      name='lastName'
                      className='yup-vald'
                    />
                  </div>
                  <Field name='address' type='text' placeholder='Address' />
                  <ErrorMessage
                    component='span'
                    name='address'
                    className='yup-vald '
                  />

                  <Field name='phone' type='number' placeholder='Phone No.' />
                  <ErrorMessage
                    component='span'
                    name='phone'
                    className='yup-vald '
                  />

                  <Field
                    name='placeType'
                    type='text'
                    placeholder={
                      checkoutSetting?.address_second_line === 'optional'
                        ? 'Apartment, suite, unit, building, floor, etc. (optional)'
                        : 'Apartment, suite, unit, building, floor, etc. (required)'
                    }
                  />
                  <ErrorMessage
                    component='span'
                    name='placeType'
                    className='yup-vald '
                  />

                  <Field
                    name='country'
                    // component='select'
                    as='select'
                    onClick={() => getCities(values.country)}
                  >
                    {countries?.map((country) => (
                      <Field
                        as='option'
                        value={country.value}
                        key={country.key}
                      >
                        {/* style={{ backgroundImage: logo }} inside each option tag*/}
                        {country.text}
                      </Field>
                    ))}
                  </Field>
                  {values?.country && (
                    <ErrorMessage
                      component='span'
                      name='country'
                      className='yup-vald'
                    />
                  )}

                  {/* handle default value for a country as when no country selected then considering the first values */}
                  {/* {!touched.country && setFieldValue('country', countries[0].value)} */}
                  <div className='half-inputs'>
                    <Field
                      name='city'
                      // component='select'
                      as='select'
                    >
                      {cities?.map((city) => (
                        <Field as='option' value={city.value} key={city.key}>
                          {city.text}
                        </Field>
                      ))}
                    </Field>
                    {/* {!touched.city && setFieldValue('country', cities[0].value)} */}
                    <Field
                      name='postalCode'
                      type='number'
                      placeholder='Postal code (Optional)'
                    />
                  </div>

                  <div className='half-inputs'>
                    {values.city && (
                      <ErrorMessage
                        component='span'
                        name='city'
                        className='yup-vald'
                      />
                    )}

                    <ErrorMessage
                      component='span'
                      name='postalCode'
                      className='yup-vald-second'
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className='buttons'>
            <p onClick={() => PrevStep()}>
              <LeftOutlined />
              Return to Shipping
            </p>
            <button
              type='submit'
              disabled={isValid}
              // disabled={
              //   !(values.selectedPaymentMethod || values.payByWallet) &&
              //   !values.addressType
              // }
              //   className={
              //     (values.selectedPaymentMethod || values.payByWallet) &&
              //     values.addressType
              //       ? 'continue-btn-active'
              //       : 'continue-btn-nonactive'
              //   }
              className='continue-btn-active'
            >
              Place Order
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default PaymentPage
