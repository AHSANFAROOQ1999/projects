import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { RightOutlined } from '@ant-design/icons'
import './MegaMenu.scss'

const MegaMenu = ({ navbar, megaMenuRef, setShowMegaMenu }) => {
  const [subCategories, setSubCategories] = useState([])
  const [superSubCategories, setSuperSubCategories] = useState([])
  return (
    <div className='mega-menu' ref={megaMenuRef}>
      <div className='cats vertical-line'>
        <ul>
          {navbar?.category_structure.map((item, index) => {
            return (
              <li key={item.id}>
                <Link
                  to={'/collection/' + item.handle}
                  onClick={() => setShowMegaMenu(false)}
                >
                  {item.name}
                </Link>
                {item.sub_category.length > 0 && (
                  <RightOutlined
                    onClick={() => {
                      setSubCategories(item.sub_category)
                      setSuperSubCategories([])
                    }}
                  />
                )}
              </li>
            )
          })}
        </ul>
      </div>
      <div className={subCategories[0] ? 'subCats vertical-line' : 'subCats '}>
        <ul>
          {subCategories?.map((item, index) => {
            return (
              <li key={item.id}>
                <Link
                  to={'/collection/' + item.handle}
                  onClick={() => setShowMegaMenu(false)}
                >
                  {item.name}
                </Link>
                {item.super_sub_category.length > 0 && (
                  <RightOutlined
                    onClick={() =>
                      setSuperSubCategories(item.super_sub_category)
                    }
                  />
                )}
              </li>
            )
          })}
        </ul>
      </div>
      <div className='superSubCats'>
        <ul>
          {superSubCategories?.map((item, index) => {
            return (
              <li key={item.id}>
                <Link
                  to={'/collection/' + item.handle}
                  onClick={() => setShowMegaMenu(false)}
                >
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
      <div className='catImg'>
        <img src={navbar?.mega_menu_image} alt={navbar?.mega_menu_image_alt} />
      </div>
    </div>
  )
}

export default MegaMenu
