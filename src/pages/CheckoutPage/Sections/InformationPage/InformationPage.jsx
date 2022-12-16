import axios from 'axios'
import * as Yup from 'yup'
import { Select } from 'antd'
import { LeftOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { Link } from 'react-router-dom'
import {
  setCheckout,
  // setShowMainComps,
} from '../../../../redux/slices/checkoutSlice'
import ReactFlagsSelect from 'react-flags-select'

const InformationPage = ({
  nextStep,
  checkoutSetting,
  setCheckoutSetting,
  setShippingAddress,
  setShippingMethods,
  user,
}) => {
  const [countries, setCountries] = useState([])
  const [cities, setCities] = useState([])

  const [addresses, setAddresses] = useState([])

  const defaultCountry = useSelector(
    (state) => state.multiLocation.defaultCountry
  )

  const checkout = useSelector((state) => state.checkout.checkoutObj)
  const loggedIn = useSelector((state) => state.account.loggedIn)

  // const [selectedCountry, setSelectedCountry] = useState(
  //   '' || checkout?.country
  // )
  // const [selectedCity, setSelectedCity] = useState('' || checkout?.city)

  //const [disableBtn, setDisableBtn] = useState(false)

  const dispatch = useDispatch()
  const { Option } = Select
  // getting chekout setting
  const getCheckoutSettings = () => {
    axios
      .get(
        process.env.REACT_APP_BACKEND_HOST + '/storefront/checkout_setting',
        {
          headers: {
            pushpa: sessionStorage.getItem('comverse_customer_token'),
          },
        }
      )
      .then((response) => {
        // console.log('getCheckoutSettings', response)
        setCheckoutSetting(response.data)
      })
  }
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
    if (countryKey && countries.length > 0) {
      countryId = countries?.find(
        (country) => country.value.toUpperCase() === countryKey
      )?.key
    } else if (countryKey && countries.length === 0) {
      countryId = checkout?.country.key
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

  const continueToShipping = (formValues) => {
    dispatch(
      setCheckout({
        ...checkout,
        ...formValues,
      })
    )

    const shipping_address = {
      first_name: formValues.firstName,
      last_name: formValues.lastName,
      phone: formValues.phone,
      address: formValues.address,
      apartment: formValues.placeType,
      country: formValues.country.name,
      city: formValues.city,
      postal_code: formValues.postalCode,
    }
    const checkout_id = localStorage.getItem('checkout_id')
      ? localStorage.getItem('checkout_id')
      : null
    if (checkoutSetting?.customer_contacts === 'email') {
      var email = formValues.emailOrPhone
    } else {
      var phoneNo = formValues.emailOrPhone
    }
    const body = {
      shipping_address: shipping_address,
      checkout_id: checkout_id,
      email: email,
      phone: phoneNo,
      country: defaultCountry,
    }

    if (sessionStorage.getItem('comverse_customer_id')) {
      body['customer'] = sessionStorage.getItem('comverse_customer_id')
    }

    axios
      .put(process.env.REACT_APP_BACKEND_HOST + '/order/checkout', body)
      .then((response) => {
        //console.log(response)
        setShippingAddress(response.data?.shipping_address)
        //setCheckoutLineItems(response.data?.lineItems)
        getShippings()

        localStorage.setItem('shippingAddress', JSON.stringify(response.data))
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const getShippings = () => {
    let checkout_id = localStorage.getItem('checkout_id')
      ? localStorage.getItem('checkout_id')
      : null

    let body = {
      checkout_id: checkout_id,
      country: defaultCountry,
    }

    axios
      .post(process.env.REACT_APP_BACKEND_HOST + '/order/shipping_price', body)
      .then((response) => {
        // console.log('getShippings', response)

        setShippingMethods(response.data?.total_price) //?.total_price[0].shipping_rule
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const getUserAddresses = () => {
    axios
      .get(process.env.REACT_APP_BACKEND_HOST + '/storefront/account', {
        headers: {
          pushpa: sessionStorage.getItem('comverse_customer_token'),
        },
      })
      .then((response) => {
        setAddresses(response.data?.address)
      })
      .catch((err) => console.log(err))
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
    emailOrPhone: Yup.string().required('Required'),
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
    country: Yup.object().required('Select Country'),
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
    getCheckoutSettings()

    getCountries()
    if (checkout?.country) {
      // if country is already selected and in redux then getting corresponding cities

      getCities(checkout?.country)
    }
    if (user) {
      getUserAddresses()
    }
  }, [user]) // since user is not upadting and thus addresses in the dropdown were not updating so putting user here as when user sets then component re renders settinf addresses in the dropdown

  return (
    <>
      <Formik
        initialValues={{
          // contact information
          emailOrPhone: '' || checkout?.emailOrPhone || user?.email,
          // shipping address
          // first form
          firstName: '' || checkout?.firstName,
          lastName: '' || checkout?.lastName,
          address: '' || checkout?.address,
          phone: '' || checkout?.phone,
          placeType: '' || checkout?.placeType,
          country: '' || checkout?.country, // { key: '', value: '', name: '' } , here country is obj bcz for countr flag component need to assign flag/country code for the selected property, and country key/id for city, and name for api call body
          city: '' || checkout?.city,
          postalCode: '' || checkout?.postalCode,
        }}
        validationSchema={validationSchema}
        validateOnMount={true}
        onSubmit={(values) => {
          // console.log(values)

          // if user does not select as the first values of country and city were his choice then these values are selected
          // if (!values.country) {
          //   values.country = countries[0].value
          // }
          // if (!values.city) {
          //   values.city = cities[0].value
          // }
          continueToShipping(values)
          nextStep()
        }}
      >
        {({
          values,
          handleChange,
          touched,
          validateForm,
          isValid,
          setFieldValue,
        }) => (
          <Form>
            <div className='contact-info'>
              <h2>Contact Information</h2>
              {!user && (
                <p>
                  Already have an account?
                  <Link
                    to={'/login'}
                    // onClick={() => dispatch(setShowMainComps(true))}
                  >
                    Log in
                  </Link>
                </p>
              )}
            </div>
            <Field
              name='emailOrPhone'
              type={
                checkoutSetting?.customer_contacts === 'email'
                  ? 'email'
                  : 'number'
              }
              placeholder={
                user?.email
                  ? user?.email
                  : checkoutSetting?.customer_contacts === 'email'
                  ? 'Email'
                  : 'Number'
              }
              disabled={user?.email}
            />
            <ErrorMessage
              component='span'
              name='emailOrPhone'
              className='yup-vald'
            />
            <div className='shipping-address'>
              <div className='upper-part'>
                <h2>Shipping Address</h2>
                {user && (
                  <Select
                    //labelInValue
                    // defaultValue={{
                    //   // value: 'lucy',
                    //   label: 'Select Address',
                    // }}
                    style={{
                      width: 150,
                    }}
                    placeholder='Select Address'
                    onChange={(value) => setFieldValue('address', value)}
                  >
                    {addresses?.map((address) => {
                      // console.log(address)
                      return (
                        <Option value={address.address}>
                          {address.address}
                        </Option>
                      )
                    })}
                  </Select>
                )}
              </div>

              <div className='half-inputs'>
                <Field name='firstName' type='text' placeholder='First Name' />
                <Field name='lastName' type='text' placeholder='Last Name' />
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
                className='yup-vald'
              />

              <Field name='phone' type='number' placeholder='Phone No.' />
              <ErrorMessage
                component='span'
                name='phone'
                className='yup-vald'
              />

              <Field
                name='placeType'
                type='text'
                placeholder={
                  checkoutSetting?.address_second_line === 'optional'
                    ? 'Apartment, suite, unit, building, floor, etc. (Optional)'
                    : 'Apartment, suite, unit, building, floor, etc. (Required)'
                }
              />
              <ErrorMessage
                component='span'
                name='placeType'
                className='yup-vald'
              />

              <ReactFlagsSelect
                name='country'
                countries={countries.map((country) =>
                  country.value.toUpperCase()
                )}
                //searchable
                //searchPlaceholder='Search countries'
                customLabels={
                  {
                    // US: 'EN-US',
                    // GB: 'EN-GB',
                    // FR: 'FR',
                    // DE: 'DE',
                    // IT: 'IT',
                  }
                }
                placeholder={'Select Country'}
                selected={values.country && values.country.value}
                onSelect={(code) => {
                  // console.log('code', code)
                  let country = countries.find(
                    (country) => country.value === code
                  )
                  setFieldValue('country', {
                    key: country.key,
                    value: country.value,
                    name: country.text,
                  })

                  getCities(code)
                }}
              />
              <ErrorMessage
                component='span'
                name='country'
                className='yup-vald'
              />

              {/* handle default value for a country as when no country selected then considering the first values */}
              {/* {!touched.country && setFieldValue('country', countries[0].value)} */}
              <div className='half-inputs'>
                <Select
                  name='city'
                  showSearch
                  placeholder={'Select City' || cities[0]?.text}
                  optionFilterProp='children'
                  onChange={(value) => {
                    setFieldValue('city', value)
                  }}
                  onSearch={(value) => {
                    setFieldValue('city', value)
                  }}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                  defaultValue={checkout?.city || cities[0]?.text}
                  showArrow={false}
                >
                  {cities?.map((city) => (
                    <Option value={city.value} key={city.key}>
                      {city.text}
                    </Option>
                  ))}
                </Select>

                {/* {!touched.city && setFieldValue('country', cities[0].value)} */}
                <Field
                  name='postalCode'
                  type='number'
                  placeholder={
                    checkoutSetting?.postal_code === 'optional'
                      ? 'Postal Code (Optional)'
                      : 'Postal Code (Required)'
                  }
                />
              </div>
              <div className='half-inputs'>
                <ErrorMessage
                  component='span'
                  name='city'
                  className='yup-vald '
                />
                <ErrorMessage
                  component='span'
                  name='postalCode'
                  className='yup-vald'
                />
              </div>
            </div>

            <div className='buttons'>
              <Link to='/cart'>
                <LeftOutlined />
                Return to cart
              </Link>

              <button
                type={'submit'}
                // disabled={disableBtn}
                className={
                  isValid && values.country && values.city
                    ? 'continue-btn-active'
                    : 'continue-btn-nonactive'
                }
                // onClick={() => {
                //   // disableBtnAfterFirstClick(isValid)

                //   // formik validation is handled here using yup and form does not submit or go next until isValid is true, where isValid shows all the errors
                //   // but here country and city are handled without fomrik and yup so disbaling button if any of them is not selected and settinf disable false when one of them is slected and then button is clicked again and other one is checked
                //   if (selectedCountry?.name === undefined) {
                //     //
                //     setDisableBtn(true)
                //     setShowCountryErrorMsg(true)
                //   } else {
                //     setShowCountryErrorMsg(false)
                //   }
                //   if (selectedCity === undefined) {
                //     setDisableBtn(true)
                //     setShowCityErrorMsg(true)
                //   } else {
                //     setShowCityErrorMsg(false)
                //   }
                // }}
              >
                Continue to Shipping
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  )
}

export default InformationPage
