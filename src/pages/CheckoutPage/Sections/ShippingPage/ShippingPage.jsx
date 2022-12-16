import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form, Field } from 'formik'
import { LeftOutlined } from '@ant-design/icons'
import { setCheckout } from '../../../../redux/slices/checkoutSlice'

const ShippingPage = ({
  nextStep,
  PrevStep,
  shippingAddress,
  shippingMethods,
  setSelectedShippingMethod,
  totalObj,
  setTotalObj,
  setTotal,
  total,
  checkoutLineItems,
}) => {
  const [initialObj, setInitialObj] = useState({}) // for getting shipping ids innitially
  const [initialFormObj, setInitialFormObj] = useState({}) // for getting shipping ids innitially
  const [totalShipping, setTotalShipping] = useState(0) // setting api reponse
  const [radioObj, setRadioObj] = useState({}) //used for computing

  const dispatch = useDispatch()
  const checkout = useSelector((state) => state.checkout.checkoutObj)

  const defaultCountry = useSelector(
    (state) => state.multiLocation.defaultCountry
  )
  const defaultCurrency = useSelector(
    (state) => state.multiLocation.defaultCurrency
  )

  const continueToPayment = (formValues) => {
    // debugger
    if (Object.keys(formValues).length === 0) {
      formValues = initialObj
    } else if (
      Object.keys(initialFormObj).length !== Object.keys(formValues).length
    ) {
      for (let key in initialFormObj) {
        if (!Object.keys(formValues).includes(key)) {
          formValues[key] = ''
        }
      }
    }
    for (let key in formValues) {
      if (
        formValues[key] === null ||
        formValues[key] === undefined ||
        formValues[key] === ''
      ) {
        let methodFound = shippingMethods?.find((method) => {
          return method.shipping_id == key
        })
        formValues[key] = methodFound?.shipping_rule[0].name
      }
    }

    //console.log(Object.formValues(formValues)[0] !== '')
    // if (Object.formValues(formValues)[0] !== '') {
    //   dispatch(
    //     setCheckout({
    //       ...checkout,
    //       shippingMethod: formValues[Object.keys(formValues)[0]],
    //     })
    //   )
    // } else {
    //   dispatch(
    //     setCheckout({
    //       ...checkout,
    //       shippingMethod:
    //         shippingMethods[Object.keys(shippingMethods)[0]].shipping_rule[0]
    //           .name,
    //     })
    //   )
    // }

    // fitering line items ids to be sent to backend

    const dataToSend = []
    let selectedRules = []

    // map selected shipping method
    shippingMethods?.map((method) => {
      let shippingId = method.shipping_id
      let ship_productGroup = method.product_group
      let productGroup
      if (!Array.isArray(ship_productGroup)) {
        productGroup = []
        productGroup.push(ship_productGroup)
      } else {
        productGroup = method.product_group
      }

      //console.log('productGroup', productGroup)
      // since we get wither a single product_group or array of product_group
      // If not array then we need to simply separate products by single product_group
      // if array then we need to separate products by mapping product_group ids from product_group array

      if (Array.isArray(productGroup)) {
        // first separate products by product group
        let selectedProductIds = []
        productGroup.map((pid) => {
          //console.log('pid', pid)
          return method?.shipping_rule?.map((ship, index) => {
            // console.log('ship', ship)

            // for multiple selected shipping try mapping selected rules
            // setting selected product ids

            if (ship.name === formValues[shippingId]) {
              // separating item ids by group id
              checkoutLineItems?.map((lineItem) => {
                return lineItem.items?.map((item) => {
                  if (item.product_group === pid) {
                    selectedProductIds.push(item.id)
                  }
                })
              })
              //console.log('selectedProductIds', selectedProductIds)
            }
          })
        })

        dataToSend.push({
          shipping_id: shippingId,
          line_items: selectedProductIds,
          selected_rule: formValues[shippingId],
        })

        selectedRules = [...selectedRules, formValues[shippingId]]
        // setting redux state
        dispatch(
          setCheckout({
            ...checkout,
            selectedShippingMethods: selectedRules,
          })
        )
      }
    })

    //console.log('dataToSend', dataToSend)

    let checkout_id = localStorage.getItem('checkout_id')
      ? localStorage.getItem('checkout_id')
      : null

    let body = {
      checkout_id: checkout_id,
      shipping_methods: dataToSend,
      country: defaultCountry,
    }
    if (sessionStorage.getItem('comverse_customer_id')) {
      body['customer'] = sessionStorage.getItem('comverse_customer_id')
    }

    axios
      .put(process.env.REACT_APP_BACKEND_HOST + '/order/checkout', body)
      .then((response) => {
        // debugger
        setTotalShipping(response.data?.total_shipping)

        // console.log('response', response)
      })
      .catch((error) => console.log(error))
  }

  const computeTotal = () => {
    let shippingTotal = 0
    //debugger
    setTotal(totalObj?.subtotal)

    for (const key in radioObj) {
      shippingTotal = shippingTotal + radioObj[key]
      setTotalObj({ ...totalObj, shippingtotal: shippingTotal })

      setTotal((total) => total + radioObj[key])
    }
  }

  // making radio object for inital default selected rules
  const computeInitialTotal = () => {
    if (
      shippingMethods.length &&
      shippingMethods.length !== Object.keys(radioObj).length
    ) {
      let obj = {}
      shippingMethods?.map((method, index) => {
        obj[index] = method.shipping_rule[0]?.shipping_amount
      })
      setRadioObj(obj)
    }
  }

  const displayLineItems = (ship_productGroup) => {
    let productGroup
    if (!Array.isArray(ship_productGroup)) {
      productGroup = []
      productGroup.push(ship_productGroup)
    } else {
      productGroup = ship_productGroup
    }

    if (Array.isArray(productGroup)) {
      return productGroup?.map((productGroupId) => {
        return checkoutLineItems?.map((lineItem) => {
          return lineItem.items?.map((item) => {
            if (item.product_group === productGroupId) {
              return (
                <div className='item'>
                  <div className='img'>
                    <img src={item.image} alt='product image' />
                  </div>
                  <p> {item.product}</p>
                </div>
              )
            }
          })
        })
      })
    }
  }

  useEffect(() => {
    computeTotal()
  }, [radioObj])

  const initializeObj = () => {
    //debugger
    // creating object for formik
    let initalValuesRadioArr
    if (shippingMethods.length) {
      initalValuesRadioArr = shippingMethods?.map((method, index) => {
        return `${method.shipping_id}`
      })

      // setting initial values for checking later in palceOrder

      if (initalValuesRadioArr.length) {
        let initalValuesRadioObj = {}
        initalValuesRadioArr?.forEach(
          (key, index) => (initalValuesRadioObj[key] = '')
        )
        setInitialObj(initalValuesRadioObj)
      }

      // setting initial values for formik
      if (initalValuesRadioArr.length) {
        let initalValuesRadioObj = {}
        initalValuesRadioArr?.forEach(
          (key, index) =>
            (initalValuesRadioObj[key] =
              '' ||
              (checkout?.selectedShippingMethods &&
                checkout?.selectedShippingMethods[index]))
        ) //{Shipping id: 'shipping rule name', : ''}
        setInitialFormObj(initalValuesRadioObj)

        // setting initial values for checking later in palceOrder

        return initalValuesRadioObj
      }
    }
  }
  useEffect(() => {
    if (shippingMethods.length) {
      initializeObj()
    }
    computeInitialTotal()
  }, [shippingMethods])

  return (
    <>
      <Formik
        initialValues={initialFormObj}
        onSubmit={(values) => {
          //console.log(values)
          setSelectedShippingMethod(values)
          continueToPayment(values)
          nextStep()
        }}
      >
        {({ values }) => (
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
            </div>
            <div className='shipping-method-wrapper'>
              <h2>Shipping Method</h2>
              {shippingMethods?.map((method, radioIndex) => {
                return (
                  <>
                    <div className='item-above-methods'>
                      {displayLineItems(
                        method.product_group,
                        method.shipping_id
                      )}
                    </div>
                    {/* <p>Shipping ID : {method.shipping_id}</p> */}
                    <div className='shipping-method'>
                      {method.shipping_rule?.map((rule, index) => {
                        return (
                          <div className='table-wrapper'>
                            <div className='input-label'>
                              <Field
                                name={`${method.shipping_id}`}
                                value={rule.name}
                                type='radio'
                                key={index}
                                onClick={() => {
                                  setRadioObj({
                                    ...radioObj,
                                    [radioIndex]: rule.shipping_amount,
                                  })

                                  // computeTotal(radioIndex, rule.shipping_amount)
                                }}
                                // checked={
                                //   checkout?.selectedShippingMethods &&
                                //   checkout.selectedShippingMethods[
                                //     radioIndex
                                //   ] === rule.name

                                //   ///===   values.shippingMethods[0].shipping_id
                                //  }
                                checked={
                                  index === 0
                                    ? rule.name
                                    : values[method.shipping_id] === rule.name
                                }

                                // checked={index === 0}
                              />
                              <p className='label'>{rule.name}</p>
                            </div>

                            <p className='desc'>
                              {rule.shipping_amount} {defaultCurrency}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </>
                )
              })}
            </div>

            <p className='note'>
              During checking out for delivery in your country, certain duties
              may be applicable specific to your destination. Kees has no
              control over these charges and the same may vary.
            </p>
            <div className='buttons'>
              <p onClick={() => PrevStep()}>
                <LeftOutlined />
                Return to Information
              </p>
              <button
                type={checkout?.shippingMethod !== null ? '' : 'submit'}
                className='continue-btn-active'
                //disabled={radioObj === null}
              >
                Continue to Payment
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  )
}

export default ShippingPage
