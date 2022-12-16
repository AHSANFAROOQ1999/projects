import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Helmet from 'react-helmet'
import Loader from '../../components/Loader/Loader'
import './CheckoutPage.scss'

import InformationPage from './Sections/InformationPage/InformationPage'
import ShippingPage from './Sections/ShippingPage/ShippingPage'
import PaymentPage from './Sections/PaymentPage/PaymentPage'
import CheckoutLineItemsPage from './Sections/CheckoutLineItemsPage/CheckoutLineItemsPage'
import CheckoutTotalPricePage from './Sections/CheckoutTotalPricePage/CheckoutTotalPricePage'
import { useDispatch } from 'react-redux'
//import { setShowMainComps } from '../../redux/slices/checkoutSlice'

function CheckoutPage({ logo }) {
  const [activeStep, setActiveStep] = useState(1)

  // from CheckoutTotalPricePage
  const [totalObj, setTotalObj] = useState({})
  const [total, setTotal] = useState(0)

  // from CheckoutLineItems
  const [appliedPromocodes, setAppliedPromocodes] = useState([])
  // if user logged in
  const [user, setUser] = useState(null)
  // from information page
  const [checkoutSetting, setCheckoutSetting] = useState(null)
  const [shippingAddress, setShippingAddress] = useState({})
  const [shippingMethods, setShippingMethods] = useState([])
  const [checkoutLineItems, setCheckoutLineItems] = useState([])

  // from shipping page
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(null)

  // handling page change
  const nextStep = () => {
    setActiveStep(activeStep + 1)
  }
  const PrevStep = (step) => {
    if (step) {
      setActiveStep(step)
    } else {
      setActiveStep(activeStep - 1)
    }
  }

  const dispatch = useDispatch()

  //get customer addresses if customer is loged in
  const getLoggedInUser = () => {
    if (sessionStorage.getItem('comverse_customer_token')) {
      // let customerToken = sessionStorage.getItem('comverse_customer_token')

      // get customer addresses
      axios
        .get(process.env.REACT_APP_BACKEND_HOST + '/storefront/account', {
          headers: {
            pushpa: sessionStorage.getItem('comverse_customer_token'),
          },
        })
        .then((response) => {
          ///debugger
          //  console.log(response.data)
          setUser(response.data)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

  useEffect(() => {
    getLoggedInUser()
  }, [])

  return (
    <>
      <div className='checkout-page-wrapper'>
        <div className='left-page-wrapper'>
          <div className='form-wrapper'>
            <a
              href={'/'}
              //</div> onClick={() => dispatch(setShowMainComps(true))}
            >
              <img src={logo} className='logo' alt='Logo' />
            </a>
            <div className='form-steps'>
              <p className={activeStep === 1 && 'step-bold'}>Cart</p>{' '}
              <span>-</span>
              <p className={activeStep === 2 && 'step-bold'}>Information</p>
              <span>-</span>
              <p className={activeStep === 3 && 'step-bold'}>Shipping</p>
              <span>-</span>
              <p className={activeStep === 4 && 'step-bold'}>Payment</p>
            </div>
            <div className='form'>
              {activeStep === 1 && (
                <InformationPage
                  nextStep={nextStep}
                  checkoutSetting={checkoutSetting}
                  setCheckoutSetting={setCheckoutSetting}
                  setShippingAddress={setShippingAddress}
                  setShippingMethods={setShippingMethods}
                  user={user}
                />
              )}
              {/*Second page*/}
              {activeStep === 2 && (
                <ShippingPage
                  nextStep={nextStep}
                  PrevStep={PrevStep}
                  shippingAddress={shippingAddress}
                  shippingMethods={shippingMethods}
                  setSelectedShippingMethod={setSelectedShippingMethod}
                  totalObj={totalObj}
                  setTotalObj={setTotalObj}
                  setTotal={setTotal}
                  total={total}
                  checkoutLineItems={checkoutLineItems}
                />
              )}
              {activeStep === 3 && (
                <PaymentPage
                  nextStep={nextStep}
                  PrevStep={PrevStep}
                  checkoutSetting={checkoutSetting}
                  shippingAddress={shippingAddress}
                  selectedShippingMethod={selectedShippingMethod}
                  total={total}
                  user={user}
                />
              )}
            </div>
          </div>
        </div>
        <div className='right-page-wrapper'>
          <CheckoutLineItemsPage
            setTotalObj={setTotalObj}
            checkoutLineItems={checkoutLineItems}
            setCheckoutLineItems={setCheckoutLineItems}
            setAppliedPromocodes={setAppliedPromocodes}
          />
          <CheckoutTotalPricePage
            totalObj={totalObj}
            total={total}
            setAppliedPromocodes={setAppliedPromocodes}
            appliedPromocodes={appliedPromocodes}
          />
        </div>
      </div>
    </>
  )
}

export default CheckoutPage
