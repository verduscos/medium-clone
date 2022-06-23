import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createAComment } from "../../store/comment";
import { BiUserCircle } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import "./Form.css";



const CreateCommentForm = () => {
  const params = useParams();
  let currentUser = useSelector(state => state.session.user)
  const { sightingId } = params;
  const dispatch = useDispatch();
  const [errors, setErrors] = useState([])
  const [comment, setComment] = useState("");
  const [displayForm, setDisplayForm] = useState(false);


  const createComment = async (e) => {
    e.preventDefault();

    const payload = {
      user_id: currentUser.id,
      sighting_id: sightingId,
      comment: comment
    }

    if (comment.length >= 4) setComment("")
    const data = await dispatch(createAComment(payload));
    if (data) {
      setErrors(data.errors)
    }
  }

  return (
    <>
      {currentUser ?
        <>
          {displayForm ?
            <form id="comment-form-container" onSubmit={createComment}>
              {errors?.map(error => (
                <p>{error.split(":")[1]}</p>
              ))}
              <textarea
                id="comment-textarea"
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value)
                }}
              ></textarea>
              <div >
                <button
                  className="black-btn"
                  onClick={(e) => {
                    e.preventDefault()
                    setDisplayForm(!displayForm)
                  }}>CANCEL</button>
                <button className="black-btn">COMMENT</button>
              </div>
            </form>
            :
            <div id="temp">
              <BiUserCircle />
              <button onClick={() => setDisplayForm(!displayForm)}>Add a comment...</button>
            </div>
          }
        </>

        : null}
    </>
  )
}


export default CreateCommentForm;
