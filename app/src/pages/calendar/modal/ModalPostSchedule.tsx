import { useDispatch, useSelector } from 'react-redux';
import { BtnBox, PickColor } from './ModalStyle';

import { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/esm/locale';
import {
  ErrorWord,
  Input,
  InputBox,
  ScheduleBox,
  SchedulePicker,
  SelectCal,
} from 'components/input/inputs';
import { ModalBtn } from 'components/button/buttons';
import { useNavigate } from 'react-router-dom';
import TwitterPicker from 'react-color/lib/components/twitter/Twitter';
import { mainColor } from 'assets/styles';
import { closeModal } from '../slice/modalSlice';
import { FieldErrors, useForm } from 'react-hook-form';
import { checkTodo } from 'types/calendarTypes';
import * as API from 'api';
import { add, format } from 'date-fns';
import { RootState } from 'store/store';
import { updateCalendar } from '../slice/todoSlice';

const Schedule = ({ dates }: { dates: string | any }) => {
  const year: number = Number(dates.slice(0, 4));
  const month: number = Number(dates.slice(4, 6));
  const day: number = Number(dates.slice(-2));
  const todayData = new Date(dates);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>();
  const [open, setOpen] = useState<boolean>(false);
  const [color, setColor] = useState(`${mainColor}`);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    handleSubmit,
    register,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({ mode: 'onChange' });
  const list = useSelector(
    (state: RootState) => state.persistedReducer.calendarList,
  );
  const calendarId = useSelector(
    (state: RootState) => state.persistedReducer.calendarId,
  );

  useEffect(() => {
    if (!year || !month || !day) {
      dispatch(closeModal());
      navigate('/calendar');
    } else {
      setStartDate(new Date(year, month - 1, day));
      setEndDate(add(new Date(year, month - 1, day), { minutes: 30 }));
    }
  }, []);

  useEffect(() => {
    if (!startDate || !endDate) {
      setError('date', { message: '?????? ????????? ?????? ????????? ?????????' });
    } else if (startDate >= endDate) {
      setError('date', {
        message: '?????? ????????? ?????? ???????????? ?????? ?????????',
      });
    } else {
      clearErrors('date');
    }
  }, [endDate, startDate, setError, clearErrors]);

  const onValid = async (input: checkTodo) => {
    if (!startDate || !endDate) {
      setError('date', { message: '?????? ????????? ?????? ????????? ?????????' });
    } else if (startDate >= endDate) {
      setError('date', {
        message: '?????? ????????? ?????? ???????????? ?????? ?????????',
      });
    } else {
      const data = {
        calendarId: calendarId,
        startDate: format(startDate, 'yyyyMMdd'),
        startTime: format(startDate, 'HHmm'),
        endDate: format(endDate, 'yyyyMMdd'),
        endTime: format(endDate, 'HHmm'),
        title: input.title,
        labelColor: color,
        isTodo: false,
      };

      try {
        await API.post(`/schedule/day`, data);
        alert('????????? ?????????????????????');
        dispatch(closeModal());

       const monthData={
        calendarId: `${calendarId}`,
        startYearMonth: `${year}${month}`,
      }
const getThisCalendar = await API.post(`/schedule/month`,monthData);
dispatch(updateCalendar(getThisCalendar));

        navigate('/calendar');
      } catch (err) {
        alert(err);
      }
    }
  };

  const onInvalid = (errors: FieldErrors) => {
    alert('??????');
   
  };

  return (
    <form onSubmit={handleSubmit(onValid, onInvalid)}>
      <span>{/* {year}??? {month}??? {day}??? */}</span>

      <InputBox>
        <Input
          type="text"
          placeholder="????????? ??????????????????"
          {...register('title', {
            required: '????????? ????????? ?????????',
            minLength: {
              value: 2,
              message: '2?????? ???????????? ????????? ?????????',
            },
            maxLength: {
              value: 20,
              message: '20?????? ????????? ????????? ?????????',
            },
          })}
          errors={errors.title}
        />
        
        <PickColor
          type="button"
          onClick={() => setOpen((curr) => !curr)}
          labelColor={color}
        >
          ??????
        </PickColor>
        {errors.calendar && (
          <ErrorWord>{`${errors.calendar?.message}`}</ErrorWord>
        )}
        {errors.title && <ErrorWord>{`${errors.title?.message}`}</ErrorWord>}
        {open && (
          <TwitterPicker
            color={color}
            onChangeComplete={(color) => {
              setColor(color.hex);
            }}
            triangle={'top-right'}
            width={'380px'}
          />
        )}
        <ScheduleBox>
          <SchedulePicker
            wrapperClassName="datePicker"
            locale={ko}
            selected={startDate}
            onChange={(date: Date) => setStartDate(date)}
            selectsStart
            startDate={todayData}
            showTimeSelect
            dateFormat="yyyy??? M??? d??? h:mm aa"
          />
          <p>&nbsp;-&nbsp;</p>
          <SchedulePicker
            wrapperClassName="datePicker"
            locale={ko}
            selected={endDate}
            onChange={(date: Date) => setEndDate(date)}
            selectsStart
            minDate={startDate}
            startDate={startDate}
            showTimeSelect
            dateFormat="yyyy??? M??? d??? h:mm aa"
          />
        </ScheduleBox>
        {errors.date && <ErrorWord>{`${errors.date?.message}`}</ErrorWord>}
        
       
        <BtnBox>
          <ModalBtn
            type="button"
            onClick={() => {
              dispatch(closeModal());
              navigate('/calendar');
            }}
          >
            ??????
          </ModalBtn>
          <ModalBtn type="submit">??????</ModalBtn>
        </BtnBox>
      </InputBox>
    </form>
  );
};

export default Schedule;
