import React, { useState, useEffect } from 'react';
import {
  ContentsBox,
  ItemList,
  ItemContainer,
  CategoryBox,
} from '../../components/characters/StoreStyle';
import ItemList2 from 'components/shop/ItemList';
import BannerItem from 'components/shop/categories';
import Search from 'components/shop/search';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import MonsterProfile from '../../components/characters/MonsterProfile';
import * as API from '../../api';

export default function Items() {

  // const [storeItems, setStoreItems] = useState<any[]>([]);

  // useEffect(() => {
  //   async function fetchData() {
  //       const data = await API.get('/items/all');
  //       setStoreItems(data);
  //   }; 
  //   fetchData();
  // }, []);




  const [category, setCategory] = useState('all');
  const [inputState, setInputState] = useState('');
  const { id } = useParams();
//   console.log(id);
  const itemCategoryList = useSelector(
    (state: any): any => state.itemCategories,
  );

  return (
    <ContentsBox>
      <ItemList>

        <BannerItem
          categories={itemCategoryList}
          setCategory={setCategory}
        ></BannerItem>

        <Search setState={setInputState}></Search>

        <ItemContainer>
          <CategoryBox>
        
            <ItemList2
              category={category === 'all' ? 'all' : category}
              inputValue={inputState}
              url={'/store/item/'}
              purpose={'구매'}
              // items={storeItems}
              // setItem={setStoreItems}
            ></ItemList2>

          </CategoryBox>
        </ItemContainer>

      </ItemList>


      <MonsterProfile/>
      

    </ContentsBox>
  );
}
