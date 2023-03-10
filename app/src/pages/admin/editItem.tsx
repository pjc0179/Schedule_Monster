import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import produce from 'immer';
import * as API from '../../api';
import { asyncitemListFetch } from './slice/itemListSlice';
import { useDispatch, useSelector } from 'react-redux';
import { ItemType } from 'types/shopTypes';
import {
  EditItemBoxContainer,
  UploadFileBox,
  InputBox,
  AddAndEditBtn,
  DelBtn,
} from './adminCss';
import { resetItem } from './util/util';
import { AppDispatch, RootState } from 'store/store';
const ImgBox = styled.div`
  display: flex;
  justify-content: center;
`;
const Img = styled.img`
  height: 150px;
  width: 150px;
  border-radius: 0.5rem;
  border: 0.5px solid #a2bcff; ;
`;

function EditItem({ itemData }: any) {
  const urlInput = useRef<any>();
  const dispatch = useDispatch<AppDispatch>();
  const categoryList = useSelector((state: RootState) => {
    return state.categoryListReducer.categoryList;
  });
  const [check, setCheck] = useState(false);
  const [itemState, setItemState] = useState<ItemType>({
    _id: itemData._id,
    itemName: itemData.itemName,
    price: itemData.price,
    exp: itemData.exp,
    itemImage: itemData.itemImage,
    itemInfo: itemData.itemInfo,
    categoryName: itemData.categoryName,
  });

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItemState(
      produce((draft: ItemType) => {
        draft.itemName = e.target.value;
      }),
    );
  };
  const onChangePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItemState(
      produce((draft: ItemType) => {
        draft.price = e.target.value;
      }),
    );
  };
  const onChangeInfo = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setItemState(
      produce((draft: ItemType) => {
        draft.itemInfo = e.target.value;
      }),
    );
  };
  const onChangeImg = () => {
    setItemState(
      produce((draft: ItemType) => {
        draft.itemImage = urlInput.current.value;
      }),
    );
  };
  const onChangeExp = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItemState(
      produce((draft: ItemType) => {
        draft.exp = e.target.value;
      }),
    );
  };
  const onChangeCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemState(
      produce((draft: ItemType) => {
        draft.categoryName = e.target.value;
      }),
    );
  };
  useEffect(() => {
    setItemState({
      _id: itemData._id,
      itemName: itemData.itemName,
      price: itemData.price,
      exp: itemData.exp,
      itemImage: itemData.itemImage,
      itemInfo: itemData.itemInfo,
      categoryName: itemData.categoryName,
    });
    urlInput.current.value = itemData.itemImage;
  }, [itemData]);

  useEffect(() => {
    setCheck(false);
    dispatch(asyncitemListFetch());
    setItemState(resetItem);
    urlInput.current.value = '';
  }, [check]);

  return (
    <EditItemBoxContainer>
      <ImgBox>
        <Img
          src={itemState.itemImage}
          alt="???????????? ?????????  ????????? ????????? ????????????"
        ></Img>
      </ImgBox>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (
            window.confirm(
              `${
                itemState._id === '' ? '?????????????????????????' : '?????????????????????????'
              }`,
            )
          ) {
            try {
              if (itemState._id === '') {
                API.post('/items/register', {
                  itemName: itemState.itemName,
                  itemImage: itemState.itemImage,
                  itemInfo: itemState.itemInfo,
                  price: itemState.price,
                  exp: itemState.exp,
                  categoryName: itemState.categoryName,
                });
              } else {
                API.put('/items/update', {
                  _id: itemState._id,
                  itemName: itemState.itemName,
                  itemImage: itemState.itemImage,
                  price: itemState.price,
                  exp: itemState.exp,
                  categoryName: itemState.categoryName,
                  itemInfo: itemState.itemInfo,
                });
              }
            } catch {
            } finally {
              setCheck(true);
            }
          }
        }}
      >
        <UploadFileBox>
          <label htmlFor="upload">?????????url?????????</label>
          <input
            type="text"
            defaultValue={itemState.itemImage}
            id="upload"
            ref={urlInput}
            required
          />
          <button type="button" onClick={onChangeImg}>
            url ????????? ????????????
          </button>
        </UploadFileBox>
        <InputBox>
          <div>??????</div>
          <input
            type="text"
            value={itemState.itemName}
            onChange={onChangeName}
            required
          />
          <div>??????</div>
          <input
            type="number"
            value={itemState.price}
            onChange={onChangePrice}
            required
          />
          <div>?????????</div>
          <input
            type="number"
            value={itemState.exp}
            onChange={onChangeExp}
            required
          />
          <div>????????????</div>
          <select onChange={onChangeCategory} value={itemState.categoryName}>
            <option value="">==???????????????==</option>
            {categoryList.map((category: any): JSX.Element => {
              return (
                <option key={category._id} value={category.categoryName}>
                  {category.categoryName}
                </option>
              );
            })}
          </select>
          <div>????????????</div>
          <textarea
            name=""
            cols={30}
            rows={10}
            value={itemState.itemInfo}
            onChange={onChangeInfo}
            required
          ></textarea>
        </InputBox>

        <AddAndEditBtn>{itemState._id === '' ? '??????' : '??????'}</AddAndEditBtn>
        {itemState._id === '' ? (
          <></>
        ) : (
          <DelBtn
            type="button"
            onClick={(e) => {
              if (window.confirm('?????? ???????????????????')) {
                try {
                  e.preventDefault();

                  API.delete(`/items/delete/${itemState._id}`);
                } catch {
                } finally {
                  setCheck(true);
                }
              }
            }}
          >
            ??????
          </DelBtn>
        )}
      </form>
    </EditItemBoxContainer>
  );
}

export default EditItem;
