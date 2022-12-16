import axios from 'axios'
import Helmet from 'react-helmet'
import { Link, useNavigate } from 'react-router-dom'
import React, { useEffect, useRef, useState } from 'react'
import { Breadcrumb, Button, Input, Table, Typography } from 'antd'
import { connect, useDispatch, useSelector } from 'react-redux'
import {
  Add_to_cart,
  Remove_from_cart,
  Update_minicart,
  QuantityDecrement,
  QuantityIncrement,
} from '../../redux/slices/cartSlice'
import defaultImage from '../../assets/img/productImagePlaceholder.png'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import './CartPage.scss'
import {
  setCheckoutId,
  setShowMainComps,
} from '../../redux/slices/checkoutSlice'

export const CartPage = (props) => {
  const dispatch = useDispatch()
  const firstRender = useRef(true)
  // const [cart, setCart] = useState([]);
  const cart = useSelector((state) => state.cart.items)
  const price = useSelector((state) => state.cart)
  const country = useSelector((state) => state.multiLocation.defaultCountry)
  const currency = useSelector((state) => state.multiLocation.defaultCurrency)
  const [deletedLineItems, setDeletedLineItems] = useState([])
  const [cartEmpty, setCartEmpty] = useState(false)
  const [allowCheckout, setAllowCheckout] = useState(false)
  const [checkout_settings, setCheckout_settings] = useState({})
  const [count, setCount] = useState(1)
  const { Text } = Typography
  const navigate = useNavigate()

  useEffect(() => {
    if (firstRender) {
      firstRender.current = false

      if (localStorage.getItem('cart')) {
        let cart = JSON.parse(localStorage.getItem('cart'))
        // cartArray();
        if (cart?.length) {
          setAllowCheckout(true)
        }
        // setCart(cart);
        dispatch(Add_to_cart)
      }

      updateMiniCart()
      dispatch(Update_minicart())
      checkoutSettings()

      //  dispatch(setShowMainComps(true));
    }
  }, [])

  // console.log("cart", cart);

  const quantityIncrement = (e, id, quantity, i) => {
    // debugger

    let newQuantity = parseInt(cart[i]?.detail?.quantity) + 1

    let maxQuantity = quantity

    if (newQuantity <= maxQuantity) {
      updateCart(newQuantity, e)

      dispatch(QuantityIncrement(id))
      dispatch(Update_minicart())
    }
  }

  const quantityDecreament = (e, id, quantity, i) => {
    // debugger

    let newQuantity = parseInt(cart[i]?.detail?.quantity) - 1

    let maxQuantity = quantity

    if (newQuantity <= maxQuantity) {
      // let tempCart = Object.assign([], cart);
      // cart[i].detail.quantity = newQuantity;
      // dispatch(Add_to_cart(cart));
      // setCart([]);
      // setCart(tempCart);
      updateCart(newQuantity, e)

      dispatch(QuantityDecrement(id))
      dispatch(Update_minicart())
    }

    // // console.log("count", count);

    // if (count > 0) {
    //   setCount(count - 1);
    // }
  }

  const deleteLineitem = (id) => {
    // let varId = e.target.closest(".delete-button").getAttribute("variantId");
    let varId = id

    let cart = JSON.parse(localStorage.getItem('cart'))
    // let deletedItems = JSON.parse( localStorage.getItem('deletedItems'))

    for (let i = 0; i < cart.length; i++) {
      const lineItem = cart[i]
      if (lineItem.varId == varId) {
        cart.splice(i, 1)

        dispatch(
          Remove_from_cart([
            {
              varId: lineItem.varId,
            },
          ])
        )

        if (lineItem.detail.id) {
          axios
            .delete(
              process.env.REACT_APP_BACKEND_HOST +
                '/order/delete_line_item?checkout_id=' +
                localStorage.getItem('checkout_id') +
                '&line_item=' +
                lineItem.detail.id
            )
            .then((response) => {
              dispatch(Add_to_cart)
              // setCart(cart);
            })
            .catch((err) => {
              console.log('line item not deleted', err)
            })
        } else {
          // setCart(cart);
          dispatch(Add_to_cart)
        }
        if (!cart.length) {
          setAllowCheckout(false)
        }
      }
    }

    dispatch(Update_minicart(cart))

    localStorage.setItem('cart', JSON.stringify(cart))
  }

  const updateCart = (newQuantity, e) => {
    if (newQuantity !== 0) {
      let variantId = e.target
        .closest('.quantity-picker')
        .getAttribute('variantid')
      // update cart
      let cart = JSON.parse(localStorage.getItem('cart'))
      for (let i = 0; i < cart?.length; i++) {
        const lineItem = cart[i]
        if (lineItem.varId == variantId) {
          lineItem.detail.quantity = newQuantity
          break
        }
      }
      // setCart(cart);
      dispatch(Add_to_cart)
      localStorage.setItem('cart', JSON.stringify(cart))
    }
  }

  const updateMiniCart = () => {
    let cart = JSON.parse(localStorage.getItem('cart'))
    let totalprice = 0
    let totalCount = 0
    if (cart) {
      if (!cart.length) {
        setCartEmpty(true)
      } else {
        setCartEmpty(false)
      }
    }
  }

  const checkoutSettings = () => {
    axios
      .get(
        process.env.REACT_APP_BACKEND_HOST +
          '/storefront/checkout_setting' +
          '?token=' +
          sessionStorage.getItem('comverse_customer_token')
      )
      .then((response) => {
        setCheckout_settings(response.data)
      })
  }

  const checkout = () => {
    // window.fbq("track", "Checkout");

    let cart = JSON.parse(localStorage.getItem('cart'))

    if (cart) {
      let lineItems = []
      for (let i = 0; i < cart?.length; i++) {
        const lineItem = cart[i]
        let item = {
          variant_id: lineItem.detail.variantId,
          vendor: parseInt(lineItem.detail.vendor_id),
          quantity: parseInt(lineItem.detail.quantity),
        }
        if (lineItem.detail.id) {
          item.id = lineItem.detail.id
        }
        lineItems.push(item)
      }
      if (localStorage.getItem('checkout_id')) {
        let body = {
          checkout_id: localStorage.getItem('checkout_id'),
          line_items: lineItems,
          country: country,
        }

        if (sessionStorage.getItem('comverse_customer_id')) {
          body['customer'] = sessionStorage.getItem('comverse_customer_id')
        }
        axios
          .put(process.env.REACT_APP_BACKEND_HOST + '/order/checkout', body)
          .then((response) => {
            // console.log(response)
            // update ids for products added to cart
            let respCart = response.data.lineItems

            for (let i = 0; i < cart.length; i++) {
              const item = cart[i]
              for (let j = 0; j < respCart.length; j++) {
                const respLineItem = respCart[j]
                if (respLineItem.variant === item.varId) {
                  item.detail.id = respLineItem.id
                }
              }
            }
            localStorage.setItem('cart', JSON.stringify(cart))
            // localStorage.removeItem('deletedItems')

            {
              checkout_settings?.customer_accounts == 'required' &&
              !sessionStorage.getItem('comverse_customer_token') ? (
                <>{navigate('/login')}</>
              ) : (
                // navigate('/checkout')
                (window.location.href = '/checkout')
              )
            }

            window.location.href = '/checkout'
            // navigate('/checkout')
          })
          .catch((err) => {
            console.log('CheckoutApi Error: ', err)
            if (err.response.status === 404) {
              let unavailableVariants = err.response.data
              for (let i = 0; i < unavailableVariants.length; i++) {
                const variant = unavailableVariants[i]
                document.querySelector(
                  'tr[variantid="' +
                    variant.variant_id +
                    '"] .quant-unavailable span'
                ).innerHTML = variant.available_quantity
                document
                  .querySelector('tr[variantid="' + variant.variant_id + '"]')
                  .classList.add('quantity-error')
              }
            }
          })
      } else {
        // console.log('checkout create')
        let body = {
          line_items: lineItems,
          country: country,
        }

        if (sessionStorage.getItem('comverse_customer_id')) {
          body['customer'] = sessionStorage.getItem('comverse_customer_id')
        }

        axios
          .post(process.env.REACT_APP_BACKEND_HOST + '/order/checkout', body)
          .then((response) => {
            // console.log(response)
            localStorage.setItem('checkout_id', response.data.checkout_id)
            dispatch(setCheckoutId(response.data.checkout_id))

            // update ids for products added to cart
            let respCart = response.data.lineItems
            for (let i = 0; i < cart.length; i++) {
              const item = cart[i]
              for (let j = 0; j < respCart.length; j++) {
                const respLineItem = respCart[j]
                if (respLineItem.variant === item.varId) {
                  item.detail.id = respLineItem.id
                }
              }
            }

            localStorage.setItem('cart', JSON.stringify(cart))

            window.location.href = '/checkout'
            // navigate('/checkout')
          })
          .catch((err) => {
            if (err.response.status === 404) {
              let unavailableVariants = err.response.data
              for (let i = 0; i < unavailableVariants.length; i++) {
                const variant = unavailableVariants[i]
                document.querySelector(
                  'tr[variantid="' +
                    variant.variant_id +
                    '"] .quant-unavailable span'
                ).innerHTML = variant.available_quantity
                document
                  .querySelector('tr[variantid="' + variant.variant_id + '"]')
                  .classList.add('quantity-error')
              }
            }
          })
      }
    }
    // dispatch(setShowMainComps(false));
  }

  // Cart Table Columns

  const columns = [
    {
      // title: "Product",
      dataIndex: 'image',
      key: 'image',
      // render: (text) => <a>{text}</a>,
    },
    {
      title: 'Product',
      dataIndex: 'title',
      key: 'title',
      // render: (text) => <a>{text}</a>,
    },
    {
      title: 'Price',
      dataIndex: 'variantPrice',
      key: 'variantPrice',
      // render: (text) => <a>{text}</a>,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      // render: (text) => <a>{text}</a>,
    },
    {
      title: 'Remove',
      dataIndex: 'remove',
      key: 'remove',
      // render: (text) => <a>{text}</a>,
    },
  ]

  // ⬇  Below Method is to Map Rows Into Table

  var table = []
  for (var i = 0; i < cart.length; i++) {
    let variantId = cart[i].varId
    let quantity = cart[i]?.detail?.inventoryQuantity
    let index = i
    table[i] = {
      key: i,
      image: (
        <img
          src={cart[i]?.detail?.image ? cart[i]?.detail?.image : defaultImage}
          width='50px'
          alt={cart[i].detail.title}
        />
      ),
      title: cart[i]?.detail?.title,
      variantPrice: <>{currency + ' ' + cart[i]?.detail?.variantPrice}</>,
      // quantity: cart[i]?.detail?.quantity,
      quantity: (
        <div className='quantity-picker'>
          <Input.Group compact size='small'>
            <Button
              type='default'
              onClick={(e) => quantityDecreament(e, variantId, quantity, index)}
            >
              <MinusOutlined />
            </Button>
            <Input
              id='quantity'
              value={cart[i]?.detail?.quantity}
              type='number'
            />
            <Button
              type='default'
              onClick={(e) => quantityIncrement(e, variantId, quantity, index)}
            >
              <PlusOutlined />
            </Button>
          </Input.Group>
        </div>
      ),
      total: (
        <>
          <Text strong>
            {currency +
              ' ' +
              cart[i]?.detail?.quantity * cart[i]?.detail?.variantPrice}
          </Text>
        </>
      ),
      remove: (
        <Button
          className='remove'
          danger
          onClick={() => deleteLineitem(variantId)}
        >
          Remove
        </Button>
      ),
    }
  }

  return (
    <>
      <div className='cart-page'>
        <Helmet>
          <title>Cart | COMVERSE</title>
          <meta name='description' content='' />
          <meta name='keyword' content='' />
        </Helmet>
        <div className='container-xl'>
          <div className='breadcrumbs'>
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to='/'>Home</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to='/cart'>Cart</Link>
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className='cart-wrapper'>
            <Table
              columns={columns}
              dataSource={table}
              tableLayout='auto'
              pagination={table.length > 10 ? true : false}
            />

            <div className='subtotal-wrapper k-row'>
              <div className='add-note'>
                <p>Add a note to your order</p>
              </div>
              <div className='subtotal'>
                <h4>
                  Subtotal: {price.totalprice}
                  <span>{currency}</span>
                </h4>
                <p>Shipping, and discounts will be calculated at checkout.</p>
                <div className='k-row cart-action-btns'>
                  {/* <button className="secondary-button">Continue Shipping</button>
                  <button className="secondary-button">Update Cart</button> */}

                  {allowCheckout ? (
                    <button onClick={checkout} className='checkout-button '>
                      Checkout
                    </button>
                  ) : (
                    <button
                      onClick={checkout}
                      className='checkout-button '
                      disabled
                    >
                      Checkout
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(CartPage)
