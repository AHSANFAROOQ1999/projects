import axios from 'axios'
import * as Yup from 'yup'
import './AddressChangeModal.scss'
import { connect } from 'react-redux'
import React, { useEffect, useState } from 'react'
import { useFormik, FormikProvider, ErrorMessage } from 'formik'
import { Modal, Button, message, Menu, Select, Input, Form } from 'antd'

export const AddressChangeModal = (props) => {
  const [visible, setVisible] = useState(false)
  const [cityOptions, setCities] = useState()
  const [countryOptions, setCountries] = useState()
  const { Option } = Select

  useEffect(() => {
    getCountries()
  }, [])

  // console.log("countryOptions", countryOptions);

  const getCountries = () => {
    axios
      .get(process.env.REACT_APP_BACKEND_HOST + '/order/countries')
      .then((response) => {
        setCountries(response.data, () => {
          if (countryOptions.value) {
            debugger
            let country = response.data.find(
              (countryOptions) => countryOptions.value === countryOptions.value
            )
            if (country) {
              getCities(country.key)
            }
          } else {
            setCountries({
              country: { value: response.data[0].value, valid: true },
            })
            getCities(response.data[0].key)
          }
        })
      })
  }

  const getCities = (countryKey) => {
    let countryId = countryOptions?.find(
      (country) => country.value.toUpperCase() === countryKey
    )?.key
    axios
      .get(
        process.env.REACT_APP_BACKEND_HOST +
          '/order/cities?country_id=' +
          countryId
      )
      .then((response) => {
        setCities(response.data)
      })
  }

  const success = () => {
    message.success('Password Changed Successfully')
  }

  const error = (error) => {
    message.error(error)
  }

  const formError = () => {
    message.error('Incomplete Form')
  }

  const showModal = () => {
    setVisible(true)
  }

  const handleCancel = () => {
    setVisible(false)
  }

  const countries = (
    <Menu>
      {countryOptions?.map((country, key) => {
        return <Menu.Item key={key}>{country.text}</Menu.Item>
      })}
    </Menu>
  )

  const changeAddress = useFormik({
    initialValues: {
      first_name: '',
      last_name: '',
      phone: '',
      address: '',
      apartment: '',
      city: '',
      country: '',
      postal_code: '',
      primary_address: false,
    },
    validationSchema: Yup.object({
      first_name: Yup.string()
        .required('Required')
        .min(2, 'Too Short!')
        .max(20, 'Too Long!')
        .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field '),
      last_name: Yup.string()
        .required('Required')
        .min(2, 'Too Short!')
        .max(20, 'Too Long!')
        .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field '),
      phone: Yup.string()
        .required('Required')
        .min(10, 'Please Enter Valid Phone No')
        .max(13, 'Please Enter Valid Phone No')
        .matches(/^((\+92)?(0092)?(92)?(0)?)(3)([0-9]{9})$/),

      address: Yup.string()
        .required('Required')
        .min(5, 'Too short, enter valid address')
        .max(500, 'Too long, enter valid address'),

      apartment: Yup.string()
        .required('Required')
        .min(5, 'Too short, enter valid appartment')
        .max(500, 'Too long, enter valid appartment'),

      // country: Yup.string().required("Required"),

      // city: Yup.string().required("Required"),

      postal_code: Yup.string()
        .required('Required')
        .min(2, 'Too short, enter valid postal code')
        .max(10, 'Too long, enter valid postal code'),
    }),

    onSubmit: (formData) => {
      debugger
      if (formData.country == '' || formData.city == '') {
        formError()
      } else {
        let data = { address: formData }
        axios
          .put(
            process.env.REACT_APP_BACKEND_HOST + '/storefront/account',
            data,
            {
              headers: {
                pushpa: sessionStorage.getItem('comverse_customer_token'),
              },
            }
          )
          .then((response) => {
            // console.log('customer detail updated', response)
            props.resetCustomerDetail(response.data)
            setVisible(false)
          })
          .catch((err) => {
            console.log(err.response)
            // sessionStorage.removeItem("comverse_customer_token");
            // sessionStorage.removeItem("comverse_customer_email");
            // window.location.href = "/login";
          })
      }
    },
  })

  return (
    <>
      <Button className='change-password-btn' onClick={showModal}>
        Create New Address
      </Button>
      <Modal
        visible={visible}
        title='Edit Address'
        onCancel={handleCancel}
        footer={[
          <Button key='back' onClick={() => setVisible(false)}>
            Cancel
          </Button>,
          <Button
            key='submit'
            type='submit'
            onClick={changeAddress.handleSubmit}
          >
            Save
          </Button>,
        ]}
      >
        <FormikProvider value={changeAddress}>
          <form onSubmit={changeAddress.handleSubmit}>
            <Input
              placeholder='First name'
              label='First name'
              name='first_name'
              {...changeAddress.getFieldProps('first_name')}
              className={` ${
                changeAddress.touched.first_name &&
                changeAddress.errors.first_name &&
                'invalid'
              } `}
            />
            {changeAddress.touched.first_name &&
            changeAddress.errors.first_name ? (
              <div>{changeAddress.errors.first_name}</div>
            ) : null}

            <Input
              placeholder='Last name'
              label='Last name'
              name='last_name'
              {...changeAddress.getFieldProps('last_name')}
              className={` ${
                changeAddress.touched.last_name &&
                changeAddress.errors.last_name &&
                'invalid'
              } `}
            />
            {changeAddress.touched.last_name &&
            changeAddress.errors.last_name ? (
              <div>{changeAddress.errors.last_name}</div>
            ) : null}
            <Input
              placeholder='Appartment'
              label='Appartment'
              name='apartment'
              {...changeAddress.getFieldProps('apartment')}
              className={` ${
                changeAddress.touched.apartment &&
                changeAddress.errors.apartment &&
                'invalid'
              } `}
            />
            {changeAddress.touched.apartment &&
            changeAddress.errors.apartment ? (
              <div>{changeAddress.errors.apartment}</div>
            ) : null}
            <Input
              placeholder='Address'
              label='Address'
              name='address'
              {...changeAddress.getFieldProps('address')}
              className={` ${
                changeAddress.touched.address &&
                changeAddress.errors.address &&
                'invalid'
              } `}
            />
            {changeAddress.touched.address && changeAddress.errors.address ? (
              <div>{changeAddress.errors.address}</div>
            ) : null}
            <Input
              placeholder='Phone'
              label='Phone'
              name='phone'
              type='number'
              {...changeAddress.getFieldProps('phone')}
              className={` ${
                changeAddress.touched.phone &&
                changeAddress.errors.phone &&
                'invalid'
              } `}
            />
            {changeAddress.touched.phone && changeAddress.errors.phone ? (
              <div>{changeAddress.errors.phone}</div>
            ) : null}

            <Select
              showSearch
              style={{ width: 200 }}
              // defaultValue="Pakistan"
              placeholder='Select Country'
              onChange={(data) => {
                console.log('the data values', data)
                changeAddress.values.country = data
                console.log(changeAddress.values)
                getCities(data)
              }}
              // value={changeAddress.values.country}
              optionFilterProp='children'
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              filterSort={(optionA, optionB) =>
                optionA.children
                  .toLowerCase()
                  .localeCompare(optionB.children.toLowerCase())
              }
            >
              {countryOptions?.map((country, key) => {
                return (
                  <Option value={country.value} key={key}>
                    {country.text}
                  </Option>
                )
              })}
            </Select>

            <Select
              showSearch
              style={{ width: 200 }}
              placeholder='Select City'
              // value={changeAddress.values.city}
              onChange={(data) => {
                console.log('the data values', data)
                changeAddress.values.city = data
                console.log(changeAddress.values)
              }}
              // onChange={(value) =>
              //   changeAddress.setFieldValue("city", value.value)
              // }
              optionFilterProp='children'
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              filterSort={(optionA, optionB) =>
                optionA.children
                  .toLowerCase()
                  .localeCompare(optionB.children.toLowerCase())
              }
            >
              {cityOptions?.map((city, key) => {
                return <Option value={city.text}>{city.text}</Option>
              })}
            </Select>

            <Input
              placeholder='Postal code'
              label='Postal Code'
              type='number'
              name='postal_code'
              {...changeAddress.getFieldProps('postal_code')}
              className={` ${
                changeAddress.touched.postal_code &&
                changeAddress.errors.postal_code &&
                'invalid'
              } `}
            />
          </form>
        </FormikProvider>
      </Modal>
    </>
  )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(AddressChangeModal)
