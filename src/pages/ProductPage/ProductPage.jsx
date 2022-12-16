import axios from 'axios'
import { connect, useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import tic from '../../assets/svg/tic.svg'
import { useMediaQuery } from 'react-responsive'
import SizeImg from '../../assets/svg/sizeChartIcon.svg'
import React, { useEffect, useState, useRef } from 'react'
import Loader from '../../components/Loader/Loader'
import whatsappIcon from '../../assets/svg/whatsappIcon.svg'
import deliveryIcon from '../../assets/svg/deliveryIcon.svg'
import defaultImage from '../../assets/img/productImagePlaceholder.png'
import { Add_to_cart, Update_minicart } from '../../redux/slices/cartSlice'
import { Button, Input, Breadcrumb, Rate } from 'antd'
import ProductsCarousel from '../HomePage/Sections/ProductsCarousel/ProductsCarousel'
import {
  HeartOutlined,
  HeartFilled,
  MinusOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  WhatsAppOutlined,
  LinkedinFilled,
  TwitterOutlined,
  FacebookFilled,
} from '@ant-design/icons'
import arrowLeft from '../../assets/svg/arrowLeft.svg'
import arrowRight from '../../assets/svg/arrowRight.svg'
import Slider from 'react-slick'
import ProductDetailsTabs from './ProductDetailsTabs/ProductDetailsTabs'
import './ProductPage.scss'
import { Helmet } from 'react-helmet'
import InnerImageZoom from 'react-inner-image-zoom'
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.min.css'
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from 'react-share'
import { Radio } from 'antd'

import SizeChartModal from '../../features/SizeChart/SizeChartModal/SizeChartModal'
import { productReducer } from '../../redux/slices/productPageSlice'

export const ProductPage = (props) => {
  // debugger;
  // console.log("props", props);
  const dispatch = useDispatch()

  let params = useParams().handle
  // console.log("paramsHook", params);

  let handle = params

  const [panes, setPanes] = useState([])
  const [product, setProduct] = useState({})
  const [activeIndex, setActiveIndex] = useState(0)

  const [inWishList, setInWishList] = useState(false)
  const [showSoldOut, setShowSoldOut] = useState(false)
  const [sizeChartModal, setSizeChartModal] = useState([])
  const [relatedProducts, setRelatedProducts] = useState({})
  const [visitedProducts, setvisitedProductss] = useState([])
  const [selectedVariant, setSelectedVariant] = useState({})
  const [thumbnailsImages, setThumbnailsImages] = useState([])
  const [count, setCount] = useState(1)
  const [wishListStyle, setWishListStyle] = useState(<HeartOutlined />)
  const [wishListStatus, setWishListStatus] = useState('Add to')
  const [selectedSwatch, setSelectedSwatch] = useState([])

  const country = useSelector((state) => state.multiLocation.defaultCountry)
  const currency = useSelector((state) => state.multiLocation.defaultCurrency)

  const isMobile = useMediaQuery({ query: '(max-width: 430px)' })
  const isDesktop = useMediaQuery({ query: '(min-width: 767px)' })

  const firstRender = useRef(true)
  const sliderRef = useRef()
  const customer_id = sessionStorage.getItem('comverse_customer_id')

  // console.log("selectedVariant", selectedVariant);
  // console.log("Product", product);

  useEffect(() => {
    window.scrollTo(0, 0)
    if (firstRender.current) {
      fetchVisitedProducts()
      firstRender.current = false
    }

    fetchProduct()
  }, [handle, country])

  useEffect(() => {
    dispatch(productReducer(product))
  }, [product])

  const settings = {
    infinite: false,
    slidesToShow: 5,
    slidesToScroll: 1,
    // vertical: true,
    // verticalSwiping: true,
    arrows: false,
    // prevArrow: <img src={arrowLeft} alt="prev arrow" />,
    // nextArrow: <img src={arrowRight} alt="next arrow" />,
    // afterChange: function (currentSlide) {
    //   console.log('after change', currentSlide)
    //   sliderRef.current.slickGoTo(currentSlide)
    // setSelectedImage(currentSlide);
    //},
  }

  const fetchProduct = async () => {
    let urlToHit = ''
    customer_id
      ? (urlToHit =
          process.env.REACT_APP_BACKEND_HOST +
          '/storefront/product/' +
          handle +
          '?country=' +
          country +
          '&customer_id=' +
          customer_id)
      : (urlToHit =
          process.env.REACT_APP_BACKEND_HOST +
          '/storefront/product/' +
          handle +
          '?country=' +
          country)
    await axios
      .get(urlToHit)
      .then((response) => {
        setVisitedProducts(response?.data?.category)

        // console.log("ProductPage Response: ", response);
        // debugger;

        let panes = [],
          thumbnailsImages = []
        setRelatedProducts({
          title: 'Related Products',
          products: response?.data?.related_products,
        })

        setSizeChartModal(response?.data?.sizechart)

        if (response.data.images) {
          let count = 0
          if (response.data.images?.length) {
            response.data?.images?.map((pro, key) => {
              panes.push({
                render: () => (
                  <div key={key}>
                    {pro?.cdn_link?.includes('.mp4') ? (
                      <video
                        width='100%'
                        height='100%'
                        autoPlay={true}
                        loop
                        muted
                      >
                        <source src={pro?.cdn_link} type='video/mp4' />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <InnerImageZoom
                        className='product-img'
                        moveType={'pan'}
                        zoomType={'hover'}
                        src={pro?.cdn_link}
                        alt={response?.data?.title}
                      />
                    )}
                  </div>
                ),
              })
              if (isMobile) {
                thumbnailsImages.push(
                  <div key={key}>
                    {pro.cdn_link.includes('.mp4') ? (
                      <>
                        <video
                          width='100%'
                          height='100%'
                          autoPlay={true}
                          loop
                          muted
                        >
                          <source src={pro?.cdn_link} type='video/mp4' />
                          Your browser does not support the video tag.
                        </video>
                      </>
                    ) : (
                      <img
                        className='pro-thumbnail-img'
                        zoomType={'hover'}
                        onClick={changeMainImage}
                        value={count}
                        src={pro?.cdn_link}
                        alt={response?.data?.title}
                      />
                    )}
                  </div>
                )
              } else {
                thumbnailsImages.push(
                  <div key={key}>
                    {pro?.cdn_link.includes('.mp4') ? (
                      <PlayCircleOutlined
                        onClick={changeMainImage}
                        className='video-thumbnail'
                        value={count}
                        name='video play'
                      />
                    ) : (
                      <>
                        <img
                          className='pro-thumbnail-img'
                          onClick={changeMainImage}
                          value={count}
                          src={pro?.cdn_link}
                          alt={response?.data?.title}
                        />
                      </>
                    )}
                  </div>
                )
              }
              count++
            })
          } else {
            panes.push({
              render: () => (
                <></>
                // <Tab.Pane>
                //   <img className="" src={defaultImage} alt="" />
                // </Tab.Pane>
              ),
            })
            thumbnailsImages.push(
              <div>
                <img
                  className='pro-thumbnail-img'
                  src={defaultImage}
                  alt={response?.data?.title}
                />
              </div>
            )
          }
        }
        setProduct(response?.data)
        // console.log(product.review.average_rating);
        setPanes(panes)
        setThumbnailsImages(thumbnailsImages)

        let variants = response?.data?.variants
        for (let i = 0; i < variants?.length; i++) {
          if (variants[i]?.variant_detail?.inventory > 0) {
            setSelectedVariant(variants[i])
            break
          }
        }

        isInWishlist()
        // () => {this.isInWishlist() }
        // if soldout
        if (product?.sold_out) {
          setSelectedVariant(variants[0])
        } else {
          // // active class for selected variant options
          // let allSwatches = document.querySelectorAll(".swatch");
          // for (let i = 0; i < allSwatches?.length; i++) {
          //   const swatch = allSwatches[i];
          //   swatch.classList.remove("active");
          // }
          // let option1, option2, option3;
          // option1 = selectedVariant.option1;
          // option2 = selectedVariant.option2;
          // option3 = selectedVariant.option3;
          // debugger;
          // if (option1 != null) {
          //   document
          //     .querySelector(
          //       '.swatch[value="' +
          //         option1.toLowerCase().replace(/\s+/g, "") +
          //         '"]'
          //     )
          //     .classList.add("active");
          // }
          // if (option2 != null) {
          //   document
          //     .querySelector(
          //       '.swatch[value="' +
          //         option2.toLowerCase().replace(/\s+/g, "") +
          //         '"]'
          //     )
          //     .classList.add("active");
          // }
          // if (option3 != null) {
          //   document
          //     .querySelector(
          //       '.swatch[value="' +
          //         option3.toLowerCase().replace(/\s+/g, "") +
          //         '"]'
          //     )
          //     .classList.add("active");
          // }
        }
      })
      .catch(function (error) {
        console.log(error)
        // window.location.href= '/404'
      })
  }

  const fetchVisitedProducts = () => {
    // debugger;
    let visited_products_handles = localStorage.getItem('visited_products')
    if (visited_products_handles) {
      // let body = {
      //   category_handles: visited_products_handles
      //     .replaceAll(" ", "")
      //     .split(","),
      //   country: country,
      // };

      axios
        .get(
          process.env.REACT_APP_BACKEND_HOST +
            '/storefront/visited_products' +
            '?category_handles=' +
            visited_products_handles.replaceAll(' ', '').split(',') +
            '&country=' +
            country
        )
        .then((response) => {
          setvisitedProductss(response.data)
          // return response.data;
        })
    }
  }

  const setVisitedProducts = (catName) => {
    // console.log("Context CatName: ", catName);
    if (catName) {
      catName = catName.replace(' ', '')
      let visitedProducts = localStorage.getItem('visited_products')
      if (visitedProducts) {
        visitedProducts = visitedProducts.split(',')
        visitedProducts = visitedProducts.map((x) => x.replace(' ', ''))
        if (visitedProducts.indexOf(catName) < 0) {
          if (visitedProducts.length >= 11) {
            // debugger
            visitedProducts.shift()
            visitedProducts.push(catName)
            localStorage.setItem('visited_products', visitedProducts)
          } else {
            localStorage.setItem(
              'visited_products',
              catName + ' , ' + localStorage.getItem('visited_products')
            )
          }
        }
      } else {
        localStorage.setItem('visited_products', catName)
      }
    }
  }

  const buyItNow = () => {
    addToCart()
    window.location.href = '/cart'
  }

  const quantityDecreament = () => {
    if (count > 0) {
      setCount(count - 1)
    }
  }

  const quantityIncreament = () => {
    let quantity = document.getElementById('quantity')

    if (count < selectedVariant?.variant_detail?.inventory) {
      setCount(parseInt(quantity.value) + 1)
    }
  }

  const changeMainImage = (e) => {
    setActiveIndex(e.target.getAttribute('value'))
  }

  // const changeSelectedVariant = (ele) => {
  //   let swatch = ele.target.closest(".swatch");
  //   let currentSwatchOption = swatch.getAttribute("option");
  //   let currentOptionSwatches = document.querySelectorAll(
  //     "[option=" + currentSwatchOption + "]"
  //   );

  //   //change active classes
  //   for (let index = 0; index < currentOptionSwatches?.length; index++) {
  //     currentOptionSwatches[index].classList.remove("active");
  //   }
  //   // let val = swatch.getAttribute('value')
  //   swatch.classList.add("active");

  //   // change selected variant
  //   let optionsTitle = "";
  //   let selectedOptions = document.querySelectorAll(".swatch.active");
  //   // let option1 = null, option2 = null, option3 = null, optionTitle, optionValue
  //   for (let i = 0; i < selectedOptions?.length; i++) {
  //     optionsTitle += selectedOptions[i].getAttribute("value") + "/";
  //   }

  //   optionsTitle = optionsTitle.substring(0, optionsTitle?.length - 1);
  //   let variantExist = false;
  //   product?.variants?.map((variant) => {
  //     // debugger;
  //     if (variant.title.toLowerCase().replace(/\s+/g, "") == optionsTitle) {
  //       // debugger;
  //       variantExist = true;
  //       setSelectedVariant(variant);
  //       setShowSoldOut(false);
  //     }
  //   });
  //   if (!variantExist) {
  //     setShowSoldOut(true);
  //   }
  // };

  // let selectedSwatch = "";

  const changeSelectedVariant = (e, index) => {
    debugger
    // setSelectedSwatch(e.target.value);
    let tempSwatches = selectedSwatch
    tempSwatches[index] = e.target.value
    setSelectedSwatch(tempSwatches)

    console.log('selectedSwatch', selectedSwatch)

    for (let i = 0; i < product?.variants?.length; i++) {
      let variantFound = true
      debugger
      for (let j = 0; j < product?.options?.length; j++) {
        let variant = product?.variants[i]
        let optionValue = selectedSwatch[j]
        if (variant['option' + (j + 1)] !== optionValue) {
          debugger
          variantFound = false
          continue
        }
      }

      if (variantFound) {
        setSelectedVariant(product?.variants[i])
        break
      } else {
        continue
      }
    }
    console.log('selectedVariant', selectedVariant)
  }

  const addToCart = () => {
    // debugger;

    let productImg = product?.images?.length
      ? product?.images[0].cdn_link
      : null

    let productDetail = {
      title: product?.title,
      brand: product?.brand,
      variantId: selectedVariant?.id,

      image: productImg,
      quantity: document.getElementById('quantity').value,
      variantPrice: selectedVariant?.variant_detail?.original_price,
      variantTitle: selectedVariant?.title,
      productHandle: handle,
      inventoryQuantity: selectedVariant?.variant_detail?.inventory,
      vendor_id: product?.vendor_id,
    }

    if (localStorage.getItem('cart')) {
      //update variant in cart

      let cart = JSON.parse(localStorage.getItem('cart'))
      // console.log(cart)
      let variantFound = false

      dispatch(
        Add_to_cart([
          {
            varId: productDetail?.variantId,
            detail: productDetail,
          },
        ])
      )
      dispatch(Update_minicart())
    } else {
      let cart = [
        {
          varId: productDetail?.variantId,
          detail: productDetail,
        },
      ]
      // localStorage.setItem('cart', JSON.stringify(cart))

      dispatch(Add_to_cart(cart))
      dispatch(Update_minicart())
    }

    document.querySelector('.pro-added-to-cart').classList.add('show')

    let cartTotal = parseInt(localStorage.getItem('cartTotal'))

    if (cartTotal) {
      let varPrice =
        parseInt(productDetail?.quantity) *
        parseInt(productDetail?.variantPrice?.original_price)
      localStorage.setItem('cartTotal', cartTotal + varPrice)
    } else {
      localStorage.setItem(
        'cartTotal',
        parseInt(productDetail?.quantity) *
          parseInt(productDetail?.variantPrice?.original_price)
      )
    }

    updateMiniCart()

    setTimeout(() => {
      if (document.querySelector('.pro-added-to-cart')) {
        document.querySelector('.pro-added-to-cart').classList.remove('show')
      }
    }, 3000)
  }

  const postWishList = (variant_id) => {
    axios
      .post(
        process.env.REACT_APP_BACKEND_HOST + '/storefront/wishlist',
        variant_id,
        {
          headers: {
            pushpa: sessionStorage.getItem('comverse_customer_token'),
          },
        }
      )
      .then((response) => {
        setWishListStatus('Remove from')
      })
  }

  const deleteWishList = (variantID) => {
    let doesExist = false
    let i = 0
    let wishlist = JSON.parse(localStorage.getItem('wishList'))
    if (localStorage.getItem('wishList')) {
      for (i; i < wishlist?.length; i++) {
        if (wishlist[i].variant_id == variantID) {
          doesExist = true
          break
        }
      }
    }

    axios
      .delete(
        process.env.REACT_APP_BACKEND_HOST +
          '/storefront/wishlist?variiant_id=' +
          variantID,
        {
          headers: {
            pushpa: sessionStorage.getItem('comverse_customer_token'),
          },
        }
      )
      .then((response) => {
        if (doesExist) {
          wishlist.splice(i, 1)
          localStorage.setItem('wishList', JSON.stringify(wishlist))
          setWishListStatus('Add to')
          setWishListStyle(<HeartOutlined />)
        }
      })
  }

  const addToWishList = () => {
    // debugger;

    if (sessionStorage.getItem('comverse_customer_token')) {
      let variant_id = { variant_id: selectedVariant.id }

      let wishlistObj = JSON.parse(localStorage.getItem('wishList'))
      let doesExist = false
      let singleProductDetail = []
      let productImg = product?.images?.length
        ? product?.images[0].cdn_link
        : null
      let productDetail = {
        title: product?.title,
        variant_id: selectedVariant?.id,
        image: productImg,
        product_handle: handle,
        variant_price: selectedVariant?.variant_detail?.original_price,
        vendor_id: product?.vendor_id,
        sku: selectedVariant?.sku,
      }
      singleProductDetail.push(productDetail)
      if (wishlistObj) {
        let i = 0
        for (i; i < wishlistObj?.length; i++) {
          if (wishlistObj[i].variant_id == productDetail.variant_id) {
            doesExist = true
            break
          }
        }
        if (!doesExist) {
          wishlistObj.push(productDetail)
          postWishList(variant_id)
          setWishListStyle(<HeartFilled />)
        } else {
          doesExist = false
          wishlistObj.splice(i, 1)
          deleteWishList(selectedVariant.id)
          setWishListStyle(<HeartOutlined />)
        }
        localStorage.setItem('wishList', JSON.stringify(wishlistObj))
      } else {
        localStorage.setItem('wishList', JSON.stringify(singleProductDetail))
      }
    } else {
      let wishlistObj = JSON.parse(localStorage.getItem('wishList'))
      let doesExist = false
      let singleProductDetail = []
      let productImg = product?.images?.length
        ? product?.images[0].cdn_link
        : null
      let productDetail = {
        title: product?.title,
        variant_id: selectedVariant?.id,
        image: productImg,
        product_handle: handle,
        variant_price: selectedVariant?.variant_detail?.original_price,
        vendor_id: product?.vendor_id,
        sku: selectedVariant?.sku,
      }
      singleProductDetail.push(productDetail)
      if (wishlistObj) {
        let i = 0
        for (i; i < wishlistObj?.length; i++) {
          if (wishlistObj[i].variant_id == productDetail.variant_id) {
            doesExist = true
            break
          }
        }
        if (!doesExist) {
          wishlistObj.push(productDetail)
          setWishListStatus('Remove from')
          setWishListStyle(<HeartFilled />)
        } else {
          doesExist = false
          wishlistObj.splice(i, 1)
          setWishListStatus('Add to')
          setWishListStyle(<HeartOutlined />)
        }

        localStorage.setItem('wishList', JSON.stringify(wishlistObj))
      } else {
        localStorage.setItem('wishList', JSON.stringify(singleProductDetail))
      }
    }
  }

  const isInWishlist = () => {
    let wishlistObj = JSON.parse(localStorage.getItem('wishList'))
    let i = 0
    for (i; i < wishlistObj?.length; i++) {
      if (wishlistObj[i].variant_id === product?.variants[0].id) {
        setInWishList(true)
        break
      }
    }

    if (inWishList) {
      setWishListStatus('Remove from')
      setWishListStyle(<HeartFilled />)
    } else {
      setWishListStatus('Add to')
      setWishListStyle(<HeartOutlined />)
    }
  }

  const updateMiniCart = () => {
    // debugger;
    let cart = JSON.parse(localStorage.getItem('cart'))
    let totalprice = 0
    let totalCount = 0

    for (let i = 0; i < cart?.length; i++) {
      // debugger;
      const lineitem = cart[i]
      totalCount += parseInt(lineitem?.detail?.quantity)
      totalprice += lineitem?.detail?.variantPrice * lineitem?.detail?.quantity
    }

    let quant = document.querySelector('.cart-total-quantity')
    if (quant) {
      document.querySelector('.cart-total-quantity').innerHTML = totalprice
    }
    // document.querySelector('.cart-count').innerHTML = totalCount
    let count = document.querySelector('.cart-count')
    if (count) {
      document.querySelector('.cart-count').innerHTML = totalCount
    }
  }

  let visitedproducts = {
    title: 'RECOMENDED FOR YOU',
    products: visitedProducts,
  }

  return (
    <div className='product-page-wrapper'>
      <Helmet>
        <title>
          {product.seo_title
            ? product?.seo_title + ' | COMVERSE'
            : product?.title
            ? product?.title + ' | COMVERSE'
            : 'COMVERSE | Redefining Commerse'}
        </title>
        <meta name='description' content='' />
        <meta name='keyword' content='' />
      </Helmet>
      <div className='container-xl'>
        <div className='product-page'>
          {product?.title ? (
            <>
              <div className='breadcrumbs'>
                <Breadcrumb>
                  <Breadcrumb.Item>
                    <Link to='/'>Home</Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>
                    <Link to=''>Product</Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>
                    <Link to=''>{product?.title}</Link>
                  </Breadcrumb.Item>
                </Breadcrumb>
              </div>

              <div className='pro-left-wrapper'>
                <div className='product-images'>
                  <div className='pro-main-image'>
                    <div className='main-img-div'>
                      <InnerImageZoom
                        src={
                          product?.images &&
                          product?.images[activeIndex]?.cdn_link
                        }
                        alt={product?.title}
                        className='main-img-slider'
                      />
                    </div>
                  </div>
                  <div className='pro-image-mobile'>
                    <Slider {...settings}>
                      {thumbnailsImages ? thumbnailsImages : null}
                    </Slider>
                  </div>

                  <div className='pro-thumbnails'>
                    <Slider {...settings}>
                      {thumbnailsImages ? thumbnailsImages : null}
                    </Slider>
                  </div>
                </div>

                <div className='product-details'>
                  <div className='product-details-inner'>
                    <div className='pro-detail-wrapper'>
                      <h2 className='pro-title'>{product?.title}</h2>
                      <div className='product-rating'>
                        <Rate
                          allowHalf
                          defaultValue={product?.review?.average_rating}
                        />
                        <span>({product?.review?.comments_count})</span>
                      </div>
                      {/* <div className="k-row"> */}
                      <div className='pro-sku k-row'>
                        <h5>SKU</h5>
                        <p>
                          {selectedVariant?.sku ? selectedVariant?.sku : null}
                        </p>
                      </div>
                      {product?.warranty ? (
                        <div className='pro-warranty k-row'>
                          <h5>Warranty</h5>
                          <p>{product?.warranty}</p>
                        </div>
                      ) : null}

                      {product?.brand ? (
                        <div className='pro-brand k-row'>
                          <h5>Brand</h5>
                          <p>{product?.brand}</p>
                        </div>
                      ) : null}

                      {product?.vendor_key ? (
                        <div className='pro-brand k-row'>
                          <h5>Vendor</h5>
                          <Link to={'/vendor/' + `${product?.vendor_key}`}>
                            <p>{product?.vendor_name}</p>
                          </Link>
                        </div>
                      ) : null}

                      <div className='price-and-whatsapp'>
                        <div className='pro-price k-row'>
                          <h5>Price</h5>
                          {selectedVariant?.variant_detail ? (
                            <p>
                              {selectedVariant?.variant_detail?.original_price <
                              selectedVariant?.variant_detail?.compare_price ? (
                                <>
                                  <span className='compare-at-price'>
                                    {selectedVariant?.variant_detail?.currency}:
                                    &nbsp;
                                    {
                                      selectedVariant?.variant_detail
                                        ?.compare_price
                                    }
                                  </span>
                                  <span className='original-price'>
                                    {selectedVariant?.variant_detail?.currency}:
                                    &nbsp;
                                    {
                                      selectedVariant?.variant_detail
                                        ?.original_price
                                    }
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span className=''>
                                    {selectedVariant?.variant_detail?.currency}:
                                    &nbsp;
                                    {
                                      selectedVariant?.variant_detail
                                        ?.original_price
                                    }
                                  </span>
                                </>
                              )}
                            </p>
                          ) : null}
                        </div>
                      </div>

                      <div className='whatsapp-and-quantity'>
                        <div className='k-row quantity-picker-wrapper'>
                          <div className='quantity'>
                            <div>
                              <h5>Quantity</h5>
                            </div>
                            <div>
                              {' '}
                              <Input.Group compact size='small'>
                                <Button
                                  type='default'
                                  onClick={quantityDecreament}
                                >
                                  <MinusOutlined />
                                </Button>
                                <Input
                                  id='quantity'
                                  className='quantity-picker'
                                  placeholder={count}
                                  defaultValue={count}
                                  value={count}
                                  type='number'
                                  onChange={(e) => {
                                    if (
                                      e.target.value <
                                      selectedVariant?.inventory
                                    ) {
                                      setCount(e.target.value)
                                      // console.log(e.target.value, count);
                                    }
                                  }}
                                />
                                <Button
                                  type='default'
                                  onClick={quantityIncreament}
                                >
                                  <PlusOutlined />
                                </Button>
                              </Input.Group>
                            </div>
                          </div>
                        </div>
                        <div>
                          {product.whatsapp ? (
                            <div className='order-by-whatsapp'>
                              <h5>Order by:</h5>

                              {/* <p>Whatsapp</p> */}
                              <a href='https://wa.me/+923000342366'>
                                Whatsapp
                                <img src={whatsappIcon} alt='Whatsapp' />
                              </a>
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className='swatch-delivery-wrapper'>
                        {/* <div className="pro-var-swatch">
                          {product?.id
                            ? product?.options?.map((opt, index) => {
                                index++;
                                return (
                                  <div key={index}>
                                    <div
                                      className={
                                        'swatch-option-wrap swatch-option-' +
                                        index
                                      }
                                    >
                                      <h5>{opt.name}</h5>
                                      <div className='swatch-options k-row'>
                                        {opt.values
                                          .split(',')
                                          .reverse()
                                          .map((val, key) => {
                                            return (
                                              <Radio
                                                key={key}
                                                onClick={(e) =>
                                                  changeSelectedVariant(e)
                                                }
                                                className="swatch"
                                                option={"option" + index}
                                                value={val
                                                  .toLowerCase()
                                                  .replace(/\s+/g, '')}
                                              >
                                                <p>{val}</p>
                                              </Radio>
                                            );
                                          })}
                                      </div>
                                    </div>
                                  </div>
                                )
                              })
                            : null}
                        </div> */}

                        <div className='pro-var-swatch'>
                          {product?.id
                            ? product?.options?.map((option, index) => {
                                return (
                                  <div key={index}>
                                    <h5>{option?.name}</h5>

                                    <Radio.Group
                                      onChange={(e) =>
                                        changeSelectedVariant(e, index)
                                      }
                                      // value={value}
                                    >
                                      {option?.values
                                        .split(',')
                                        .map((value, key) => {
                                          return (
                                            <Radio key={key} value={value}>
                                              {value}
                                            </Radio>
                                          )
                                        })}
                                    </Radio.Group>
                                  </div>
                                )
                              })
                            : null}

                          {/* {selectedSwatch != ""
                            ? product?.variants?.map((variant, key) => {
                                debugger;
                                if (variant?.title == selectedSwatch) {
                                  setSelectedVariants(variant);
                                }
                              })
                            : null} */}
                        </div>

                        <div className='k-row delivery-wrapper'>
                          {product?.cod_available ? (
                            <div className='k-row cod-availability'>
                              <img src={tic} alt='Cash On delivery' />
                              <p>COD Available</p>
                            </div>
                          ) : null}

                          {product?.tat ? (
                            <div className='k-row deivery-time'>
                              <img src={deliveryIcon} alt='Delivery Icon' />
                              <p>{product?.tat + ' Days'}</p>
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className='size_chartt'>
                        {sizeChartModal?.length ? (
                          <>
                            <img src={SizeImg} width='18px' />
                            <SizeChartModal sizeChart={sizeChartModal} />
                          </>
                        ) : null}
                      </div>

                      <div className='k-row add-to-cart-wrapper'>
                        {showSoldOut ? (
                          <>
                            <Button
                              className='add-to-cart'
                              onClick={addToCart}
                              disabled
                            >
                              Sold Out
                            </Button>
                            <Button
                              className='buy-it-now'
                              onClick={buyItNow}
                              disabled
                            >
                              Buy It Now
                            </Button>
                          </>
                        ) : selectedVariant?.id &&
                          selectedVariant?.variant_detail?.inventory > 0 ? (
                          <>
                            <Button
                              id='AddToCart'
                              className='add-to-cart'
                              onClick={addToCart}
                            >
                              Add to Cart
                            </Button>
                            <Button className='buy-it-now' onClick={buyItNow}>
                              Buy It Now
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              className='add-to-cart'
                              onClick={addToCart}
                              disabled
                            >
                              Sold Out
                            </Button>
                            <Button
                              className='buy-it-now'
                              onClick={buyItNow}
                              disabled
                            >
                              Buy It Now
                            </Button>
                          </>
                        )}
                      </div>
                      <p className='pro-added-to-cart'>Product added to cart</p>
                    </div>

                    <div className='k-row wish-list-button'>
                      <Button onClick={addToWishList}>{wishListStyle}</Button>

                      <p onClick={addToWishList}>{wishListStatus} Wishlist</p>
                    </div>

                    <div className='pro-detail-tabs'>
                      {product?.title ? (
                        <ProductDetailsTabs product={product} />
                      ) : null}
                      <div></div>
                    </div>

                    <div className='share-pro-wrapper'>
                      Share this:
                      <FacebookShareButton
                        url={
                          'https://comverseglobal.com/product/' + product.handle
                        }
                        quote={'Comverse - Redefining Commerce'}
                        hashtag='#Comverseglobal.com'
                      >
                        <FacebookFilled />
                      </FacebookShareButton>
                      <TwitterShareButton
                        url={
                          'https://comverseglobal.com/product/' + product.handle
                        }
                        quote={'Comverse - Redefining Commerce'}
                        hashtag='#Comverseglobal.com'
                      >
                        <TwitterOutlined />
                      </TwitterShareButton>
                      <LinkedinShareButton
                        url={
                          'https://comverseglobal.com/product/' + product.handle
                        }
                        quote={'Comverse - Redefining Commerce'}
                        hashtag='#Comverseglobal.com'
                      >
                        <LinkedinFilled />
                      </LinkedinShareButton>
                      <WhatsappShareButton
                        url={
                          'https://comverseglobal.com/product/' + product.handle
                        }
                        quote={'Comverse - Redefining Commerce'}
                        hashtag='#Comverseglobal.com'
                      >
                        <WhatsAppOutlined />
                      </WhatsappShareButton>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className='home-loader'>
              <Loader />
            </div>
          )}
        </div>
      </div>
      {product?.title ? (
        product?.related_products?.length ? (
          <ProductsCarousel data={relatedProducts} />
        ) : null
      ) : null}

      {visitedProducts?.length ? (
        <ProductsCarousel data={visitedproducts} />
      ) : null}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    cart: state.cart,
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(ProductPage)
