import axios from 'axios'
import { Badge } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const CheckoutLineItemsPage = ({
  setTotalObj,
  checkoutLineItems,
  setCheckoutLineItems,
  setAppliedPromocodes,
}) => {
  const defaultCountry = useSelector(
    (state) => state.multiLocation.defaultCountry
  )
  const defaultCurrency = useSelector(
    (state) => state.multiLocation.defaultCurrency
  )

  const getLineItems = () => {
    let checkout_id = localStorage.getItem('checkout_id')
      ? localStorage.getItem('checkout_id')
      : null

    axios
      .post(process.env.REACT_APP_BACKEND_HOST + '/order/checkout_line_items', {
        checkout_id: checkout_id,
        country: defaultCountry,
      })
      .then((response) => {
        // console.log('getLineItems', response)
        if (response) {
          setCheckoutLineItems(response.data?.list_items)
          // cartDetail: response.data,
          let subTotal = 0
          setAppliedPromocodes(response.data?.applied_promocodes)

          response.data.list_items.forEach((pg) => {
            pg.items.forEach((item) => {
              subTotal += item.total_price
            })
          })
          //console.log('subTotal', subTotal)
          //response.data.total_price = { subtotal: subTotal, total: subTotal }
          setTotalObj({ subtotal: subTotal, total: subTotal })
          this.setState({
            cartDetail: response.data,
            discountApplied: response.data.is_promocode
              ? response.data.is_promocode
              : null,
          })
        }
      })
  }

  useEffect(() => {
    getLineItems()
  }, [])

  return (
    <div className='line-items-wrapper'>
      {checkoutLineItems?.map((lineItem, index) => {
        // console.log('lineItem', lineItem)
        return lineItem.items?.map((item, index) => {
          //  console.log('item', item)
          return (
            <div className='line-Item' key={item.id}>
              <div className='line-item-img'>
                <img src={item.image} alt={item.title} />
                <Badge count={item.quantity} overflowCount={10}></Badge>
              </div>

              <div className='mid-wrapper'>
                <h2 className='title'>{item.product}</h2>
                <p className='variant-name'>
                  {item.variant_name === 'Dfault Title'
                    ? null
                    : item.variant_name}
                </p>
              </div>

              <p className='quantity'>
                {defaultCurrency} {item.total_price}
              </p>
            </div>
          )
        })
      })}
    </div>
  )
}

export default CheckoutLineItemsPage
