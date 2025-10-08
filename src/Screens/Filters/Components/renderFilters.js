import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {COLORS, FONTS} from '../../../Constants';
import {HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO} from '../../../Utils/helpers';
import * as SVGS from '../../../Assets/svgs/index';
import RenderButtons from './renderButtons';
import RenderSizes from './renderSizes';
import ColorBlocks from '../../../Components/Common/colorBlocks';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';

const RenderFilters = ({item, onPress, selected}) => {
  const state = useSelector(state => state.auth);
  const {t} = useTranslation();
  const [expand, setExpand] = useState(false);

  return (
    <View style={{marginBottom: HEIGHT_BASE_RATIO(24)}}>
      <TouchableOpacity
        style={{
          width: '100%',
          flexDirection: state.language == 'ar' ? 'row-reverse' : 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        onPress={() => {
          setExpand(!expand);
        }}>
        <Text
          style={{
            ...FONTS.JakartaSansMedium_16,
            color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
          }}>
          {item?.name}
        </Text>
        {expand ? (
          state.darkTheme ? (
            <SVGS.contract />
          ) : (
            <SVGS.contractBlack />
          )
        ) : state.darkTheme ? (
          <SVGS.expand />
        ) : (
          <SVGS.expandBlack />
        )}
      </TouchableOpacity>
      <View
        style={{
          flexWrap: 'wrap',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          marginTop: HEIGHT_BASE_RATIO(16),
          gap: 8,
        }}>
        {expand &&
          item?.name == t('category') &&
          item?.options?.map(item => {
            return (
              <RenderButtons
                item={item}
                selected={selected}
                onPress={onPress}
              />
            );
          })}
        {expand &&
          item?.name == t('subCategory') &&
          item?.options?.map(item => {
            return (
              <RenderButtons
                item={item}
                selected={selected}
                onPress={onPress}
              />
            );
          })}
        {/* {expand && item?.name == t('subCategory') && !item?.options && (
          <Text
            style={[
              FONTS.JakartaSansMedium_14,
              {color: state.darkTheme ? COLORS.WHITE : COLORS.DARK ,alignSelf:state?.language?'flex-end':},
            ]}>
            {t('selectACategory')}
          </Text>
        )} */}
        {expand &&
          item?.name == t('sizes') &&
          item?.options?.map(item => {
            return (
              <RenderSizes selected={selected} onPress={onPress} text={item} />
            );
          })}
        {expand &&
          item?.name == t('weight') &&
          item?.options?.map(item => {
            return (
              <RenderSizes selected={selected} onPress={onPress} text={item} />
            );
          })}
        {expand &&
          item?.name == t('length') &&
          item?.options?.map(item => {
            return (
              <RenderSizes selected={selected} onPress={onPress} text={item} />
            );
          })}
        {expand &&
          item?.name == t('colors') &&
          item?.options?.map(item => {
            return (
              <TouchableOpacity
                onPress={() => {
                  onPress(item?.name);
                }}
                style={{
                  backgroundColor: item?.code,
                  width:
                    selected == item?.name
                      ? WIDTH_BASE_RATIO(44)
                      : WIDTH_BASE_RATIO(36),
                  height:
                    selected == item?.name
                      ? HEIGHT_BASE_RATIO(46)
                      : HEIGHT_BASE_RATIO(40),
                  marginRight: WIDTH_BASE_RATIO(12),
                  borderRadius: 8,
                  borderColor: state.darkTheme
                    ? COLORS.DARK_BTN_BG
                    : COLORS.Brown,
                  borderWidth: 1,
                }}></TouchableOpacity>
            );
          })}
      </View>
    </View>
  );
};

export default RenderFilters;
