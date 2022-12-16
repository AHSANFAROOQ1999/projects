import './Header.scss'
import { connect, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import React, { useEffect, useState } from 'react'
import { Button, Select, Input } from 'antd'
import { UserOutlined, HeartFilled, CameraOutlined } from '@ant-design/icons'
import SearchSuggestions from './Sections/SearchSuggestion/SearchSuggestion'
import walleticon from '../../assets/svg/wallet.svg'
import MiniCart from './Sections/MiniCart/MiniCart'
import SearchByImage from '../../features/SearchByImage/SearchByImage'

export const Header = (props) => {
  // console.log("Header Props", props);

  const { Option } = Select
  const [show, setshow] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState()
  const [categories, setCategories] = useState(
    props?.header?.navigation_bar?.category_structure
  )

  const loggedIn = useSelector((state) => state.account.loggedIn)
  // console.log("loggedIn", loggedIn);

  const [isModalVisible, setIsModalVisible] = useState(false)
  const { Search } = Input

  const isMobile = useMediaQuery({ query: '(max-width: 769px)' })
  const isDesktop = useMediaQuery({ query: '(min-width: 800px)' })

  useEffect(() => {
    // debugger;
    // first
    // return () => {
    //   second
    // }
  }, [selectedCategory, loggedIn])

  // console.log("Cat Options", props.header);
  // console.log("selectedCategory", selectedCategory);

  const categoriesOptions =
    props.header?.navigation_bar?.category_structure?.map((cat) => {
      return {
        key: cat.handle,
        name: cat.name,
        value: cat.handle,
      }
    })
  categoriesOptions?.unshift({ key: '', name: 'All Categories', value: '' })
  // console.log("categoriesOptions", categoriesOptions);
  const showModal = () => {
    setshow(true)
    console.log(show, 'show')
    debugger
  }
  const hideModal = () => {
    setshow(false)
    console.log(show, 'hide')
    debugger
  }
  return (
    <>
      {!isMobile && (
        <div className='nav-header'>
          <div className='container-xl'>
            <div className='k-row'>
              <div className='logo flex--1'>
                <Link to='/'>
                  <div>
                    <img
                      src={
                        props.header ? props.header?.header?.logo_image : null
                      }
                      alt='Logo'
                    />
                  </div>
                </Link>
              </div>
              <div className='search-bar'>
                <div className='search-bar-inner k-row'>
                  <div className='search-by-cat'>
                    <Select
                      // showSearch
                      // style={{ width: 200 }}
                      placeholder='All Categories'
                      className='search-by-cat-dropdown'
                      onChange={(e, data) => {
                        //debugger
                        if (data.children && categoriesOptions) {
                          setSelectedCategory(
                            categoriesOptions.filter((cat) => {
                              return cat.name === data.children[0]
                            })
                          )
                        }
                      }}
                      // onChange={(data) => dchange(data)}
                    >
                      {categoriesOptions?.map((category, key) => {
                        // debugger;
                        return <Option key={key}>{category.name} </Option>
                      })}
                    </Select>
                  </div>

                  <div className='search-input'>
                    {/* <Input placeholder='Search for products'  action={{ type: 'submit', content: '' , icon:'search' }} /> */}
                    <SearchSuggestions
                      selectedCategory={selectedCategory}
                      // updateSearchQuery={updateSearchQuery}
                    />
                  </div>
                </div>
              </div>
              <div className='flex--1 k-row justify-content--end'>
                {props.header?.header?.show_vender_signup ? (
                  <div className='sell-with-us'>
                    <Link to='/sellwithus'>
                      <p> SELL WITH US</p>
                    </Link>
                  </div>
                ) : null}
                {/* <div className="search-by-image">
                  <Button onClick={showModal}>
                    <CameraOutlined />
                    <SearchByImage showModal={show} hideModal={hideModal} />
                  </Button>
                </div> */}
                <div className='wish-list'>
                  <Link to='/wishlist'>
                    <HeartFilled />
                  </Link>
                </div>
                {loggedIn &&
                sessionStorage.getItem('comverse_customer_token') ? (
                  <div className='wallet'>
                    <Link to='/wallet'>
                      <img src={walleticon} alt='wallet icon' />
                    </Link>
                  </div>
                ) : null}
                <div className='account'>
                  {loggedIn ? (
                    <Link to='/account'>
                      <UserOutlined />
                    </Link>
                  ) : (
                    <Link to='/login'>
                      <UserOutlined />
                    </Link>
                  )}
                </div>

                <MiniCart />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.account.loggedIn,
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
