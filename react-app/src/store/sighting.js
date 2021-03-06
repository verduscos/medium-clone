const GET_SIGHTINGS = "session/GET_SIGHTING";
const GET_SIGHTINGS_BY_CATEGORY = "session/GET_SIGHTINGS_BY_CATEGORY"
const GET_USER_SIGHTINGS = "session/GET_USER_SIGHTINGS"
const GET_FAVORITES = "session/GET_FAVORITES"
const CREATE_SIGHTING = "session/CREATE_SIGHTING"
const EDIT_SIGHTING = "session/EDIT_SIGHTING"
const DELETE_SIGHTING = "session/DELETE_SIGHTING"
const SEARCH = "session/SEARCH"



const getFavorites = (sightings) => ({
  type: GET_FAVORITES,
  payload: sightings
})

const getSightings = (sightings) => ({
  type: GET_SIGHTINGS,
  payload: sightings
})

const searchSightings = (searchStr) => ({
  type: SEARCH,
  payload: searchStr
})

const getSightingsByCategory = (sightings) => ({
  type: GET_SIGHTINGS_BY_CATEGORY,
  payload: sightings
})

const getSightingsByUser = (sightings) => ({
  type: GET_USER_SIGHTINGS,
  payload: sightings
})

const createSighting = (sighting) => ({
  type: CREATE_SIGHTING,
  payload: sighting
})

const deleteSighting = (sightingId) => ({
  type: DELETE_SIGHTING,
  payload: sightingId
})

const editSighting = (sighting) => ({
  type: EDIT_SIGHTING,
  payload: sighting
})



export const getAllFavorites = (Id) => async (dispatch) => {
  console.log("90909090")
  const response = await fetch(`/api/likes/${Id}`);
  console.log("BEFORE STATUS CHECK")

  if (response.status >= 400) {
    throw response;
  }
  console.log("AFTER STATUS CHECK")
  const data = await response.json();
  dispatch(getFavorites(data));
  console.log(data, 'DATA HERERERE');
  return data;
}

export const searchAllSightings = (searchStr) => async (dispatch) => {
  const response = await fetch(`/api/sightings/search/${searchStr}`);
  if (response.status >= 400) {
    throw response
  }

  console.log("HITTING THINK")
  const data = await response.json();
  dispatch(searchSightings(data));
  return data;

}

export const getAllSightings = () => async (dispatch) => {
  const response = await fetch(`/api/sightings/`);

  if (response.status >= 400) {
    throw response
  }

  const data = await response.json();
  dispatch(getSightings(data.sightings));
  console.log(data, 'DATA HERERERE');
  return data;
}

export const getAllSightingsByCategory = (category) => async (dispatch) => {
  const response = await fetch(`/api/sightings/${category}`);
  if (response.status >= 400) {
    throw response
  }

  const data = await response.json();
  dispatch(getSightingsByCategory(data.sightings));
  return data
}

export const getAllUserSightings = (userId) => async (dispatch) => {
  const response = await fetch(`/api/sightings/user/${userId}`);
  if (response.status >= 400) {
    throw response
  } else {


    const data = await response.json();
    dispatch(getSightingsByUser(data.sightings));
    return data
  }
}

export const createASighting = (payload) => async (dispatch) => {
  const response = await fetch(`/api/sightings/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      user_id: payload.user_id,
      date: payload.date,
      title: payload.title,
      description: payload.description,
      category: payload.category,
      location: payload.location,
      image_url: payload.url
    })
  })
  const data = await response.json()
  if (data.errors) {
    return data
  } else {
    dispatch(createSighting(data))
    return data
  }
}

export const updateSighting = (payload) => async (dispatch) => {
  const response = await fetch(`/api/sightings/${payload.sighting_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      user_id: payload.user_id,
      title: payload.title,
      description: payload.description,
      category: payload.category,
      image_url: payload.url
    })
  })

  const data = await response.json()
  if (data.errors) {
    return data
  } else {
    dispatch(editSighting(data))
    return data
  }
}

export const deleteASighting = (sightingId) => async (dispatch) => {
  const response = await fetch(`/api/sightings/${sightingId}`, {
    method: "DELETE"
  })
  if (response.ok) {
    const data = await response.json();
    dispatch(deleteSighting(data))
    return
  }
}



const sightingReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_SIGHTINGS:
      let sightings = {}

      action.payload.forEach(sighting => {
        sightings[sighting.id] = sighting
      })

      return { ...state, ...sightings }

    case SEARCH:
      let search = {}
      if (action.payload["sightings"]) {
        action.payload["sightings"].forEach(sighting => {
          search[sighting.id] = sighting
        })

        return { ...search };
      }

    case GET_FAVORITES:
      let favorites = {}

      if (action.payload["likes"]) {
        action.payload["likes"].forEach(sighting => {
          favorites[sighting.id] = sighting;
        })
      }

      return favorites

    case GET_SIGHTINGS_BY_CATEGORY:
      let category = {}
      action.payload.forEach(sighting => {
        category[sighting.id] = sighting
      })

      return { ...category }
    case GET_USER_SIGHTINGS:
      let userSightings = {}

      action.payload.forEach(sighting => {
        userSightings[sighting.id] = sighting
      })

      return { ...userSightings }
    case CREATE_SIGHTING:
      state[action.payload.id] = action.payload
      return { ...state }
    case EDIT_SIGHTING:
      let updated = { ...state }
      updated[action.payload.id] = action.payload

      return { ...updated }
    case DELETE_SIGHTING:
      let updatedSightings = { ...state }

      let id = (action.payload["found"])
      delete updatedSightings[id];

      return updatedSightings
    default:
      return state
  }
};

export default sightingReducer;
