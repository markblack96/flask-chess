from flask_wtf import Form
from wtforms.fields import StringField, SubmitField, RadioField 
from wtforms.validators import Required


class LoginForm(Form):
    name = StringField('Name', validators=[Required()])
    room = StringField('Room', validators=[Required()])
    color = RadioField('Color', choices=[("w", "White"), ("b", "Black")], validators=[Required()])
    submit = SubmitField('Enter Game')
