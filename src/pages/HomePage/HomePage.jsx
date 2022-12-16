import axios from 'axios'
import { connect, useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react'
import Loader from '../../components/Loader/Loader'
import BrandsSlider from './Sections/BrandsSlider/BrandsSlider'
import SingleBanner from './Sections/SingleBanner/SingleBanner'
import FeaturedIcons from './Sections/FeaturedIcons/FeaturedIcons'
import CategoriesCarousel from './Sections/CategoriesCarousel/CategoriesCarousel'
import BannerSlider from './Sections/BannerSlider/BannerSlider'
import TwoBanners from './Sections/TwoBanners/TwoBanners'
import ProductsCarousel from './Sections/ProductsCarousel/ProductsCarousel'
import CategoriesTabs from './Sections/CategoriesTabs/CategoriesTabs'
import './HomePage.scss'

export const HomePage = (props) => {
  const [homepage, setHomePage] = useState({})
  const country = useSelector((state) => state.multiLocation.defaultCountry)

  useEffect(() => {
    getHomePage()
  }, [country])

  const getHomePage = () => {
    // debugger;
    axios
      .get(
        process.env.REACT_APP_BACKEND_HOST +
          '/storefront/homepage' +
          '?country=' +
          country
      )
      .then((response) => {
        setHomePage(response.data.homepage)
      })
      .catch(function (error) {
        console.log('HomePage Api Error', error)
      })
  }
  return (
    <>
      <div className='page-height homepage'>
        {homepage?.length ? (
          homepage.map((section, index) => {
            return (
              <div key={index}>
                {section.type === 'banner_slider' ? (
                  <BannerSlider data={section} />
                ) : null}

                {section.type === 'categories_carousel' ? (
                  <CategoriesCarousel data={section} />
                ) : null}

                {section.type === 'brands_slider' ? (
                  <BrandsSlider data={section} />
                ) : null}

                {section.type === 'products_carousel' ? (
                  <ProductsCarousel data={section} />
                ) : null}

                {section.type === 'single_banner' ? (
                  <SingleBanner data={section} />
                ) : null}

                {section.type === 'categories_tabs' ? (
                  <CategoriesTabs data={section} />
                ) : null}

                {section.type === 'two_banners' ? (
                  <TwoBanners data={section} />
                ) : null}

                {section.type === 'features_icons' ? (
                  <FeaturedIcons data={section} />
                ) : null}
              </div>
            )
          })
        ) : (
          <div className='home-loader'>
            <Loader />
          </div>
        )}
      </div>
    </>
  )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage)
