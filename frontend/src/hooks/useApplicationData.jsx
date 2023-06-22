import React, { useState, useEffect, useReducer } from "react";
import axios from "axios";

export const ACTIONS = {
  FAV_PHOTO_ADDED: 'FAV_PHOTO_ADDED',
  FAV_PHOTO_REMOVED: 'FAV_PHOTO_REMOVED',
  SET_PHOTO_DATA: 'SET_PHOTO_DATA',
  SET_TOPIC_DATA: 'SET_TOPIC_DATA',
  SELECT_PHOTO: 'SELECT_PHOTO',
  DISPLAY_PHOTO_DETAILS: 'DISPLAY_PHOTO_DETAILS'
};

const appInitialState = {
  favPhotoIds: [],
  selectedPhoto: null,
  photos: [],
  topics: [],
  displayPhotoDetails: false
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.FAV_PHOTO_ADDED: {
      return {
        ...state,
        favPhotoIds: [...state.favPhotoIds, action.payload.photo]
      };
    }
    case ACTIONS.FAV_PHOTO_REMOVED: {
      const filtered = state.favPhotoIds.filter((id) => id !== action.payload.photo
      );
      return {
        ...state,
        favPhotoIds: filtered
      };
    }
    case ACTIONS.SET_PHOTO_DATA:
      return {
        ...state,
        photos: action.payload.photos
      };

    case ACTIONS.SET_TOPIC_DATA: {
      return {
        ...state,
        topics: action.payload.topics
      };
    }
    case ACTIONS.SELECT_PHOTO: {
      return {
        ...state,
        selectedPhoto: action.payload.photo
      };
    }
    case ACTIONS.DISPLAY_PHOTO_DETAILS: {
      return {
        ...state,
        displayPhotoDetails: action.payload.display
      };
    }
    default:
      return state;
  }
}



export default function useApplicationData() {

  // get photos from api
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    axios(`/api/photos`)
      .then(response => setPhotos(response.data));
  }, []);

  // reducer
  const [state, dispatch] = useReducer(reducer, appInitialState);

  // favourite photos
  const toggleFave = (photoId) => {
    // check if already fave
    if (state.favPhotoIds.includes(photoId)) {
      // unfavourite
      return dispatch({ type: ACTIONS.FAV_PHOTO_REMOVED, payload: { photo: photoId } });
    }
    // favourite
    return dispatch({ type: ACTIONS.FAV_PHOTO_ADDED, payload: { photo: photoId } });
  };

  // modal
  const openModal = (photoId) => {
    const findPhoto = photos.find(photo => photo.id === photoId);
    dispatch({ type: ACTIONS.SELECT_PHOTO, payload: { photo: findPhoto } });
    dispatch({ type: ACTIONS.DISPLAY_PHOTO_DETAILS, payload: { display: true } });
  };

  const closeModal = () => {
    dispatch({ type: ACTIONS.SELECT_PHOTO, payload: { photo: null } });
    dispatch({ type: ACTIONS.DISPLAY_PHOTO_DETAILS, payload: { display: false } });
  };

  const selectedPhoto = photos.find((photo) => photo.id === state.selectedPhoto);

  // other
  const setPhotoData = (photos) => {
    dispatch({ type: ACTIONS.SET_PHOTO_DATA, payload: { photos } });
  };

  const setTopicData = (topics) => {
    dispatch({ type: ACTIONS.SET_TOPIC_DATA, payload: { topics } });
  };

  return {
    photos,
    favePhotos: state.favPhotoIds,
    toggleFave,
    modal: state.displayPhotoDetails,
    openModal,
    closeModal,
    selectedPhoto: state.selectedPhoto,
    setPhotoData,
    setTopicData,
  };
}
