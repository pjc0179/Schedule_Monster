import React, {useState} from 'react';
import ItemCard from '../../components/characters/MyitemsCard';
import BannerItem from 'components/shop/categories';
import Search from 'components/shop/search';
import ItemList2 from 'components/shop/ItemList';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { ContentsBox, MonsterContainer, MonsterStatus, MonsterImage, ItemList, ItemBox, CategoryBox, ItemContainer } from '../../components/characters/StoreStyle';
import MonsterProfile from 'components/characters/MonsterProfile';

export default function MyItems() {

    const [coin, setCoin] = useState(1000);
    const [affection, setAffection] = useState(10);
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
                url={'/store/myitems/'}
                purpose={'사용'}
                coin={coin}
                setCoin={setCoin}
                affection={affection}
                setAffection={setAffection}
                ></ItemList2>

            </CategoryBox>
            </ItemContainer>

            </ItemList>

            <MonsterProfile coin={coin} affection={affection} myPokemon={'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/heartgold-soulsilver/shiny/132.png'} />

        </ContentsBox>
    );
}

