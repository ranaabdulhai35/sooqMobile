import {View, Text, ActivityIndicator} from 'react-native';
import React, {useState} from 'react';
import httpRequest from '../../BusinessLogics/Requests/axios';
import {useSelector} from 'react-redux';
import {TouchableOpacity} from 'react-native-gesture-handler';
import * as SVGS from '../../Ui/Assets/Svgs';
import {styles} from '../../Screens/FindWork/jobCard';
import {COLORS} from '../../BusinessLogics/Constants';

const FavouriteAddButton = ({id, type, isFavourite}) => {
  const [favouriteLoad, setFavouriteLoad] = useState(false);
  const [added, setAdded] = useState(false);
  const state = useSelector(state => state.auth);
  const favourite_add = async () => {
    try {
      const data = JSON.stringify({favourite_id: id, type: type});
      const response = await httpRequest.post('/utils/favourite_add', data, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `${state.token}`,
        },
      });
      if (response.status == 200) {
        console.log('response', response.data);
        setFavouriteLoad(false);
        if (response?.data?.message == 'Added to favourite') {
          setAdded(true);
        } else {
          setAdded(false);
        }
      }
    } catch (e) {
      console.log("couldn't add in favourites", e.response.data);
      setFavouriteLoad(false);
    }
  };
  return (
    <TouchableOpacity
      onPress={() => {
        setFavouriteLoad(true);
        favourite_add();
      }}
      style={styles.likeButton}>
      {favouriteLoad ? (
        <ActivityIndicator size={20} color={COLORS.PRIMARY} />
      ) : added || isFavourite ? (
        <SVGS.LikeActive />
      ) : (
        <SVGS.Like />
      )}
    </TouchableOpacity>
  );
};

export default FavouriteAddButton;
