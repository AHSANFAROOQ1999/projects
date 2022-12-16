import React, { useState } from 'react'
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  RightOutlined,
} from '@ant-design/icons'
import { Link } from 'react-router-dom'

const MobileMegaMenu = ({
  navbar,
  setMobileMenu,
  setMobileMegaMenu,
  mobileMegaMenuRef,
}) => {
  const [showMobileCat, setShowMobileCat] = useState(true)
  const [showMobileSubCat, setShowMobileSubCat] = useState(false)
  const [showMobileSuperSubCat, setShowMobileSuperSubCat] = useState(false)

  const [subCategories, setSubCategories] = useState([])
  const [superSubCategories, setSuperSubCategories] = useState([])
  const [mobileSubCatHeader, setMobileSubCatHeader] = useState('')
  const [mobileSupSubCatHeader, setMobileSupSubCatHeader] = useState('')
  return (
    <div className='mobile-megamenu' ref={mobileMegaMenuRef}>
      <div className='mobile-megamenu-top'>
        <ArrowLeftOutlined
          onClick={() => {
            // categories displayed onl
            if (showMobileCat) {
              setMobileMenu(true)
              setMobileMegaMenu(false)
            } else if (showMobileSubCat) {
              setShowMobileSubCat(false)
              setMobileMenu(false)
              setShowMobileCat(true)

              //showMobileCat(true)
            } else if (showMobileSuperSubCat) {
              setShowMobileSuperSubCat(false)
              setShowMobileSubCat(true)
              setShowMobileCat(false)
            }
          }}
        />
        {showMobileSubCat && (
          <span className='cat-header'>{mobileSubCatHeader}</span>
        )}
        {showMobileSuperSubCat && (
          <span className='cat-header'>{mobileSupSubCatHeader}</span>
        )}
      </div>

      {showMobileCat && (
        <ul>
          {navbar?.category_structure.map((item, index) => {
            return (
              <>
                <li key={item.id}>
                  <Link
                    to={'/collection/' + item.handle}
                    onClick={() => setMobileMegaMenu(false)}
                  >
                    {item.name}
                  </Link>
                  {item.sub_category.length > 0 ? (
                    <span className='mobile-megamenu-RightDivider'>
                      <RightOutlined
                        onClick={() => {
                          setSubCategories(item.sub_category)
                          setMobileSubCatHeader(item.name)
                          setShowMobileCat(false)
                          setShowMobileSubCat(true)
                        }}
                      />
                    </span>
                  ) : null}
                </li>
              </>
            )
          })}
        </ul>
      )}
      {showMobileSubCat && (
        <ul>
          {subCategories?.map((item, index) => {
            return (
              <>
                <li key={item.id}>
                  <Link
                    to={'/collection/' + item.handle}
                    onClick={() => setMobileMegaMenu(false)}
                  >
                    {item.name}{' '}
                  </Link>
                  {item.super_sub_category.length > 0 ? (
                    <span className='mobile-megamenu-RightDivider'>
                      <RightOutlined
                        onClick={() => {
                          setSuperSubCategories(item.super_sub_category)
                          setMobileSupSubCatHeader(item.name)
                          setShowMobileCat(false)
                          setShowMobileSubCat(false)
                          setShowMobileSuperSubCat(true)
                        }}
                      />
                    </span>
                  ) : null}
                </li>
              </>
            )
          })}
        </ul>
      )}
      {showMobileSuperSubCat && (
        <ul>
          {superSubCategories?.map((item, index) => {
            return (
              <>
                <li key={item.id}>
                  <Link
                    to={'/collection/' + item.handle}
                    onClick={() => setMobileMegaMenu(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              </>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default MobileMegaMenu
