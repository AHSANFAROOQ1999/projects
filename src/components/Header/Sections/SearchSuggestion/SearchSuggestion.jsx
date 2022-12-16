import React, { useState } from 'react'
import { Input, AutoComplete } from 'antd'
import './SearchSuggestion.scss'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useCallback } from 'react'
import debounce from 'lodash.debounce'

const SearchSuggestion = ({ selectedCategory }) => {
  //const [searchQuery, setSearchQuery] = useState('')
  let navigate = useNavigate()
  const [data, setData] = useState([])
  const country = useSelector((state) => state.multiLocation.defaultCountry)

  const renderItem = (title, image, link) => ({
    value: title,
    label: (
      <Link to={`/product/${link}`}>
        <img src={image} style={{ width: '50px', marginTop: '20px' }} />
        {title}
      </Link>
    ),
  })

  const options = [
    {
      options: data?.map((item) =>
        renderItem(item.title, item.image, item.handle)
      ),
    },
  ]

  const handleSearchChange = (value) => {
    // debugger;
    // console.log("VALUE", value);

    let query = value
    if (value.length === 0) {
      setData([])
    } else {
      let toHit =
        process.env.REACT_APP_BACKEND_HOST +
        '/storefront/search_products?q=' +
        query +
        '&limit=5'

      if (selectedCategory && selectedCategory[0].name != 'All Categories') {
        toHit =
          process.env.REACT_APP_BACKEND_HOST +
          '/storefront/search_products?q=' +
          query +
          '&limit=5' +
          '&category=' +
          selectedCategory[0]?.key
      }
      // console.log("url to hit", toHit);
      axios
        .get(toHit + '&country=' + country)
        .then((response) => {
          // console.log(response);
          setData(response.data.results)
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }

  const onEnter = (e) => {
    e.stopPropagation()

    let query = e.target.value
    navigate('/search/' + query)
  }

  return (
    <AutoComplete
      dropdownMatchSelectWidth={310}
      options={options}
      onSearch={(value) => handleSearchChange(value)}
      className='search-input'
    >
      <Input.Search
        size='large'
        placeholder='What are you looking for?'
        enterButton={true}
        onPressEnter={(e) => onEnter(e)}
      />
    </AutoComplete>
  )
}

export default SearchSuggestion
