from flask import Blueprint

players = []
games = []

chess = Blueprint('chess', __name__)

from . import routes, events 
