import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory, Link } from "react-router-dom";
import * as sessionActions from "../../store/sighting"
import { deleteLike, likeSightingThunk } from "../../store/like";
import Comments from "../Comments/Comments"
import { getSightingLikes } from "../../store/like";
import { getALLComments } from "../../store/comment";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai"
import { MdOutlineBookmarkAdd } from "react-icons/md";
import { BsBookmarkPlus } from "react-icons/bs";
import "./SingleSighting.css"


const SingleSighting = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const params = useParams()
  const { sightingId } = params
  const [userBtns, setUserBtns] = useState(false)
  const [favorited, setFavorited] = useState(false)
  const [displayRemove, setDisplayRemove] = useState(true)
  let sighting = useSelector(state => state.sightings[sightingId])
  let currentUser = useSelector(state => state.session.user)
  let likes = useSelector(state => state.likes)

  useEffect(() => {
    dispatch(sessionActions.getAllSightings())

  }, [dispatch])



  window.localStorage.setItem("title", sighting?.title)
  window.localStorage.setItem("description", sighting?.description)
  window.localStorage.setItem("category", sighting?.category)
  window.localStorage.setItem("image_url", sighting?.image_url)



  const handleDelete = (e) => {
    e.preventDefault();
    dispatch(sessionActions.deleteASighting(sightingId))

    history.push("/mysightings")
  }

  const favorite = (e) => {
    e.preventDefault();

    const payload = {
      user_id: currentUser.id,
      sighting_id: sightingId
    }

    dispatch(likeSightingThunk(payload))
    localStorage.setItem(sighting.id, true)
    setFavorited(true)

  }

  const unfavorite = (e) => {
    e.preventDefault();

    const payload = {
      user_id: currentUser.id,
      sighting_id: sightingId
    }

    dispatch(deleteLike(payload))
    localStorage.removeItem(sighting.id)
    setDisplayRemove(false)
  }

  const UserEditBtns = (
    currentUser && currentUser?.id === sighting?.user_id ?
      <>
        <span
          onBlur={() => {
            setUserBtns(!userBtns)
          }}
          onClick={() => {
            setUserBtns(!userBtns)
          }}>

          <BiDotsHorizontalRounded size={25} />
        </span>

        {userBtns ?
          <ul id="user-btns">
            <button onClick={handleDelete}>Delete</button>
            <Link to={`/sightings/edit/${sighting.id}`}>Edit</Link>
          </ul>
          : null}
      </>
      :
      null
  )

  const FavoriteBtns = (
    <>
      {likes[sightingId] ?
        <div onClick={(e) => {
          unfavorite(e)
        }}
          className="favorite-btns red"
        >
          <MdOutlineBookmarkAdd size={25} />
        </div>
        :
        <div onClick={(e) => {
          favorite(e)
        }}
          className="favorite-btns"
        >
          <MdOutlineBookmarkAdd size={25} />
          <p>Save</p>
        </div>
      }
    </>
  )

  // END OF FUNCS

  useEffect(() => {
    dispatch(sessionActions.getAllSightings());
    dispatch(getSightingLikes(currentUser?.id));

  }, [dispatch])

  useEffect(() => {
    dispatch(getALLComments(sightingId))
  }, [dispatch, sightingId])

  return (
    <div id="sighting-container">
      <ul>
        <li id="sighting-actions-btn-container">
          {FavoriteBtns}
          <div id="sighting-edit-btns">
            {UserEditBtns}
          </div>
        </li>
        <li>
          <h1 id="sighting-title">{sighting?.title}</h1>
        </li>
        <li>
          <p id="sighting-date">{`${sighting?.created_at.split(' ')[2]} ${sighting?.created_at.split(' ')[1]}, ${sighting?.created_at.split(' ')[3]}`}</p>
        </li>
        <li>
          <img src={sighting?.image_url} id="sighting-img" alt="article-img"></img>
        </li>
        <li>
          <p id="article-body">{sighting?.description.replace(/\n+/g, '\n\n')}</p>
        </li>
        {/* <Comments /> */}
      </ul>
    </div>
  )
}


export default SingleSighting;
