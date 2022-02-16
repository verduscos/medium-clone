from flask import Blueprint, session, request
from app.forms import SightingForm
from app.models import Sighting, SightingImage, db

sighting_routes = Blueprint("sightings", __name__)


@sighting_routes.route("/")
def get_sightings():
    """
    Get all reviews in DB, will use on splash page.
    """
    sightings = Sighting.query.all()
    return {"sightings": [sighting.to_dict() for sighting in sightings]}


@sighting_routes.route("/<int:id>")
def get_sighting_by_id(id):
    """
    Return a sighting by id.
    """
    sighting = Sighting.query.get(id)
    return sighting.to_dict()


@sighting_routes.route("/<int:id>/images")
def get_sighting_images(id):
    """
    Return images associated with sighting
    """
    images = SightingImage.query.filter(SightingImage.sighting_id == id).all()
    return {"images": [image.to_dict() for image in images]}


@sighting_routes.route("/", methods=["POST"])
def create_sighting():
    """
    Create a sighting.
    """
    form = SightingForm()
    form["csrf_token"].data = request.cookies["csrf_token"]
    if form.validate_on_submit():
        sighting = Sighting(
            user_id=request.json["user_id"],
            date=request.json["date"],
            location=request.json["location"],
            title=request.json["title"],
            description=request.json["description"],
            category=request.json["category"]
        )
        db.session.add(sighting)
        db.session.commit()

        return sighting.to_dict()
    return {"erros": form.errors}, 400
