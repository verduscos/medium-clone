import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from 'react-router-dom'
import * as sessionActions from "../../store/sighting"
import "./sightings.css"

const Sightings = () => {
  const dispatch = useDispatch()
  let sightings = useSelector(state => state.sightings);
  let sightingsArray = Object.values(sightings);


  useEffect(() => {
    dispatch(sessionActions.getAllSightings())
  }, [dispatch])


  return (
    <div id="sightings-container">
      <div id="sightings-inner">
        {!sightingsArray.length ?
        <>
        <h2 id="no-results">No results found.</h2>
        </>
        : null}
        {sightingsArray.map((sighting, i) => (
          <ul id="sighting-card" key={sighting?.id}>
            {/* <li key={sighting.id}>{sighting.location}</li> */}
            <div>
              <li className="card-r1" key={`date-${sighting?.id}`}>
                <p>{sighting?.username}</p>
                {/* TODO
                  FIX DATE FORMAT
                */}
                {/* <p>{`${sighting?.created_at.split(' ')[2]} ${sighting.updated_at.split(' ')[1]}, ${sighting.updated_at.split(' ')[3]}`}</p> */}
              </li>
              <Link className="link" to={`/sightings/${sighting?.id}`} key={`link-${i}`}>
                <div key={`title-${sighting?.id}`}>
                  <h2 className="card-text">{sighting.title}</h2>
                  <p className="card-text card-story">{sighting.description}</p>
                </div>
              </Link>
              <div id="sighting-date">
                <p>{`${sighting?.created_at.split(' ')[2]} ${sighting.created_at.split(' ')[1]}, ${sighting.created_at.split(' ')[3]} in `}</p>
                <Link className="link" to={`/sightings/categories/${sighting?.category}`}>
                  <li className="category-link" key={`category-${sighting?.id}`} >{sighting?.category}</li>
                </Link>
              </div>
            </div>
            <Link className="link card-img" to={`/sightings/${sighting?.id}`} key={`link-${i}-img`}>
              <img className="card-img" src={sighting?.image_url} alt="sighting-img"></img>
            </Link>
          </ul>
        ))}
      </div>
    </div>
  )
}

export default Sightings;
