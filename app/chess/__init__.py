from flask import Blueprint


chess = Blueprint('chess', __name__)

from . import routes, events 
