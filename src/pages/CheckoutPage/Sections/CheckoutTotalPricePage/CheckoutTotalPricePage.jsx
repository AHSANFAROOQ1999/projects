import axios from 'axios'
import { Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { useSelector } from 'react-redux'

const CheckoutTotalPricePage = ({
  totalObj,
  total,
  appliedPromocodes,
  setAppliedPromocodes,
}) => {
  const [showPromoMsg, setShowPromoMsg] = useState(false)
  const [promoMsg, setPromoMsg] = useState('')
  // const checkoutId = useSelector((state) => state.checkout.checkoutId)
  const defaultCountry = useSelector(
    (state) => state.multiLocation.defaultCountry
  )
  const defaultCurrency = useSelector(
    (state) => state.multiLocation.defaultCurrency
  )

  const applyDiscountCode = (values) => {
    const checkoutId = localStorage.getItem('checkout_id')

    let data = {
      promo_code: values.discountCode,
      checkout_id: checkoutId,
      country: defaultCountry,
    }
    //console.log('data', data)
    if (sessionStorage.getItem('comverse_customer_id')) {
      data.customer_id = sessionStorage.getItem('comverse_customer_id')
    }
    axios
      .post(process.env.REACT_APP_BACKEND_HOST + '/discount/apply_promo', data)
      .then((response) => {
        // console.log('response', response)
        if (response.status === 200) {
          setShowPromoMsg(true)
          setPromoMsg('Dicount Code Applied')
          if (!appliedPromocodes.includes(values.discountCode)) {
            setAppliedPromocodes((appliedPromocodes) => [
              ...appliedPromocodes,
              values.discountCode,
            ])
          }
          //setAppliedPromocodes([values.discountCode])
        }
      })
      .catch((err) => {
        // console.log(err.response)
        if (err.response.data.detail === 'Promo code already applied') {
          // console.log('applied')
          setShowPromoMsg(true)
          setPromoMsg('Promo Code Already Applied')
        }

        if (err.response.data.detail === 'No promo code found') {
          setShowPromoMsg(true)
          setPromoMsg('No promo code found')
        }
      })
  }
  const removeDiscountCode = (promo) => {
    const checkoutId = localStorage.getItem('checkout_id')

    let data = {
      promo_code: promo,
      checkout_id: checkoutId,
    }
    if (sessionStorage.getItem('comverse_customer_id')) {
      data.customer_id = sessionStorage.getItem('comverse_customer_id')
    }
    axios
      .delete(process.env.REACT_APP_BACKEND_HOST + '/discount/apply_promo', {
        data: data,
      })
      .then((response) => {
        if (response.status === 200) {
          setShowPromoMsg(true)
          setPromoMsg('Dicount Code Removed')
        }
        if (response.status === 404) {
          setShowPromoMsg(true)
          setPromoMsg('Discount Code Not Removed')
        }
      })
      .catch((err) => {
        console.log(err)
      })
    // }
  }

  const displayPromocodes = () => {
    return appliedPromocodes?.map((code) => (
      <Tag closable onClose={() => removeDiscountCode(code)}>
        {code}
      </Tag>
    ))
  }
  useEffect(() => {
    displayPromocodes()
  }, [appliedPromocodes])

  return (
    <div className='total-price-wrapper'>
      <div className='form'>
        <Formik
          initialValues={{
            discountCode: '',
          }}
          onSubmit={(values) => {
            // console.log(values)
            applyDiscountCode(values)
          }}
        >
          {({ values }) => (
            <Form>
              <Field
                name='discountCode'
                type='text'
                placeholder='Discount Code'
              />
              <ErrorMessage component='div' name='discountCode' />
              <button type='submit'>Apply</button>
            </Form>
          )}
        </Formik>

        {displayPromocodes()}
        {showPromoMsg && <p>{promoMsg}</p>}

        <div className='vertical-line-border'></div>

        <div className='price'>
          <div className='subtotal'>
            <p>Subtotal</p>
            <p>
              {defaultCurrency} {totalObj?.subtotal}
            </p>
          </div>
          {totalObj?.shippingtotal ? (
            <>
              <div className='shipping'>
                <p>Total Shipping</p>
                <p>
                  {defaultCurrency} {totalObj?.shippingtotal}
                </p>
              </div>
              <div className='vertical-line-border'></div>
            </>
          ) : null}

          <div className='total'>
            <p>Total</p>
            <p>
              {defaultCurrency} {total ? total : totalObj?.total}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutTotalPricePage
