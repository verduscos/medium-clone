import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import CreateNav from "../CreateSightingForm/CreateNav";
import "../CreateSightingForm/CreateSightingForm.css"
import * as sessionActions from "../../store/sighting"


const EditForm = () => {
  let currentUser = useSelector(state => state.session.user)
  const params = useParams()
  const { sightingId } = params
  const history = useHistory()
  const dispatch = useDispatch()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [errors, setErrors] = useState([])
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("")
  const [imageLoading, setImageLoading] = useState(true);
  const [payload, setPayload] = useState({})



  const editSighting = async (e) => {
    e.preventDefault()

    // IMAGE UPLOAD STARTS
    const formData = new FormData();
    formData.append("image", image);
    // formData.append("title", title);
    // formData.append("description", description);
    // formData.append("category", category);
    // formData.append("sighting_id", sightingId);

    console.log("INSIDE EDIT")

    // TODO
    // aws uploads can be a bit slow—displaying
    // some sort of loading message is a good idea
    setImageLoading(true);

    const res = await fetch(`/api/sightings/image`, {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      const data = await res.json();
      setImageLoading(false);
      // console.log(data)
      setImageUrl(data.url)
      console.log(imageUrl)
      // console.log(imageUrl)
      // console.log("IMAGE URL ABOVE")

      // history.push("/mysightings");
    }
    else {
      setImageLoading(false);
      const data = await res.json();
      // TODO
      // a real app would probably use more advanced
      // error handling
      console.log(data);
    }
    // IMAGE UPLOAD ENDS

    const payload = {
      sighting_id: sightingId,
      user_id: currentUser.id,
      title: title,
      description: description,
      category: category,
      sighting_id: sightingId,
      url: imageUrl
    }

      console.log(formData)
      const data = await dispatch(sessionActions.updateSighting(formData));
      if (data.errors) {
        setErrors(data.errors)
      } else {
        history.push("/")
      }

  }



  const updateImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
  }

  // CAUSES ERROR : Unhandled Rejection (TypeError): Cannot read properties of undefined (reading 'sighting_id')
  // useEffect(() => {
  //   let payload;
  //   dispatch(sessionActions.updateSighting(payload))
  // }, [dispatch])

  return (
    <>
      <CreateNav />
      <form onSubmit={editSighting} className="sighting-form">
        <div className="form-inner">
          {errors?.map(error => (
            <p>{error.split(":")[1]}</p>
          ))}
          <input
            className="sighting-inputs"
            onChange={(e) => {
              setTitle(e.target.value)
            }}
            type="text" value={title} placeholder="Title" />
          <textarea
            className="sighting-inputs"
            onChange={(e) => {
              setDescription(e.target.value)
            }}
            type="text" value={description} placeholder="description" />
          <select
            className="sighting-inputs form-options"
            onChange={(e) => {
              setCategory(e.target.value)
            }}
            value={category}>
            <option value="categories">Select Category</option>
            <option value="UFOs">UFOs</option>
            <option value="Ghosts">Ghosts</option>
            <option value="Demons">Demons</option>
          </select>


          <input
            id="file-btn"

            type="file"
            accept="image/*"
            onChange={updateImage}
          />

          <button className="post-form-btn sighting-inputs cursor">Update</button>
        </div>
      </form>
    </>
  )
}


export default EditForm;
