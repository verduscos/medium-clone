import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory, Link } from "react-router-dom";
import * as sessionActions from "../../store/sighting"
import Comments from "../Comments/Comments"
import { getALLComments } from "../../store/comment";


const SingleSighting = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const params = useParams()
  const { sightingId } = params
  let sighting = useSelector(state => state.sightings[sightingId])
  let currentUser = useSelector(state => state.session.user)


  useEffect(() => {
    dispatch(getALLComments(sightingId))
  }, [dispatch, sightingId])


  const handleDelete = (e) => {
    e.preventDefault();
    dispatch(sessionActions.deleteASighting(sightingId))

    history.push("/")
  }


  useEffect(() => {
    dispatch(sessionActions.getAllSightings())
  }, [dispatch])

  return (
    <>
      {currentUser && currentUser?.id === sighting?.user_id ?
        <button onClick={handleDelete}>Delete</button> :
        null
      }
      {currentUser && currentUser?.id === sighting?.user_id ?
        <Link to={`/sightings/edit/${sighting.id}`}>Edit</Link> :
        null
      }

      <h1>{sighting?.title}</h1>
      <p>{sighting?.date}</p>
      <p>{sighting?.category}</p>
      <p>{sighting?.description}</p>

      <Comments />
    </>
  )
}


export default SingleSighting;