from flask import Flask, request, jsonify, session, send_from_directory
from flask_sqlalchemy import SQLAlchemy
import datetime
from flask_marshmallow import Marshmallow
from flask_cors import CORS, cross_origin
from flask_bcrypt import Bcrypt 
import uuid
from flask_session import Session
import base64
from PIL import Image
from io import BytesIO
import os
 
app = Flask(__name__)
app.secret_key = "your_secret_key_xxx"
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://divisin-user:divisin-pass@localhost/divisin'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SESSION_TYPE']='filesystem'
db=SQLAlchemy(app)
bcrypt = Bcrypt(app) 
Session(app)
CORS(app)
ma=Marshmallow(app)

# create a Users table
class Users(db.Model):
    __tablename__ = "users"
    id = db.Column(db.String(100),primary_key=True) 
    email = db.Column(db.String(100))
    password = db.Column(db.String(100))
    created_at = db.Column(db.DateTime,default=datetime.datetime.now)
 
    def __init__(self,email,password):
        self.email=email
        self.password=bcrypt.generate_password_hash(password).decode('utf-8')
        self.id = str(uuid.uuid4())

# create a Images table
class Images(db.Model):
    __tablename__ = "images"
    id = db.Column(db.String(100),primary_key=True) 
    user_id = db.Column(db.String(100), db.ForeignKey('users.id'))
    url = db.Column(db.String(500))
    created_at = db.Column(db.DateTime,default=datetime.datetime.now)
 
    def __init__(self,user_id,image):
        self.user_id=user_id
        target_dir = './images/'+user_id
        if not os.path.exists(target_dir):
            os.makedirs(target_dir)
        save_image_from_b64(image, target_dir)
        self.url = image['filename']
        self.id = str(uuid.uuid4())

# create a ImageSchema
class ImageSchema(ma.Schema):
    class Meta:
        fields = ('id','user_id', 'url', 'created_at')

images_schema = ImageSchema(many=True)
 
# add route for /register to register a new user
@app.route('/register',methods=['POST'])
@cross_origin(supports_credentials=True)
def register():
    email = request.json['email']
    # check if the email is valid
    if not '@' in email:
        return jsonify(message='Invalid email'), 400
    filter_user = Users.query.filter_by(email=email).first()
    if filter_user:
        return jsonify(message='User already exists'), 409
    password = request.json['password']
    if len(password) < 8:
        return jsonify(message='Password must be at least 8 characters'), 400
    user = Users(email,password)
    db.session.add(user)
    db.session.commit()
    session['user_id'] = user.id
    return jsonify({'user_id': user.id}), 200

# add route for /login to login a user
@app.route('/login',methods=['POST'])
@cross_origin(supports_credentials=True)
def login():
    email = request.json['email']
    password = request.json['password']
    user = Users.query.filter_by(email=email).first()
    if user and bcrypt.check_password_hash(user.password, password):
        session['user_id'] = user.id
        return jsonify({'user_id': user.id}), 200
    else:
        return jsonify(message='Wrong email or password'), 401

# add route for /logout to logout a user
@app.route('/logout')
@cross_origin(supports_credentials=True)
def logout():
    session.pop('user_id', None)
    return jsonify({'status':True}), 200

# add route for /session to get the current session
@app.route('/usersession')
@cross_origin(supports_credentials=True)
def usersession():
    if 'user_id' in session:
        return jsonify({'user_id':session['user_id']}), 200
    else:
        return jsonify({'status':False}), 401
    
# add route for /images to get all images for a user
@app.route('/images/<user_id>',methods=['GET'])
@cross_origin(supports_credentials=True)
def images(user_id):
    if 'user_id' in session and session['user_id'] == user_id:
        images = Images.query.filter_by(user_id=user_id).all()
        result = images_schema.dump(images)
        return jsonify(result), 200
    else:
        return jsonify({'status':False}), 401

# add route for /addimages to add new images and store the images in ./iimages folder
@app.route('/addimages',methods=['POST'])
@cross_origin(supports_credentials=True)
def addimages():
    if 'user_id' not in session:
        return jsonify(message='Unauthorized access'), 401
    user_id = request.json['user_id']
    images = request.json['images']
    for image in images:
        image_obj = Images(user_id,image)
        db.session.add(image_obj)
        db.session.commit()
    return jsonify({'status':True}), 200

@app.route('/getimage',methods=['POST'])
@cross_origin(supports_credentials=True)
def getimage():
    user_id = request.json['user_id']
    image_id = request.json['image_id']
    if 'user_id' not in session or session['user_id'] != user_id:
        return jsonify(message='Unauthorized access'), 401
    image = Images.query.get(image_id)
    return send_from_directory('./images/'+user_id, image.url)

# add route for /deleteimage to delete an image
@app.route('/deleteimage',methods=['POST'])
@cross_origin(supports_credentials=True)
def deleteimage():
    image_id = request.json['image_id']
    user_id = request.json['user_id']
    if 'user_id' not in session or session['user_id'] != user_id:
        return jsonify(message='Unauthorized access'), 401
    image = Images.query.get(image_id)
    db.session.delete(image)
    db.session.commit()
    os.remove('./images/'+user_id+'/'+image.url)
    return jsonify({'status':True}), 200

def save_image_from_b64(image, path):
    base64_image_data = image["data_url"].split(',')[1]
    image_binary = base64.b64decode(base64_image_data)
    image_file = Image.open(BytesIO(image_binary))
    image_name = image['filename']
    image_file.save(path+'/'+ image_name)
 
if __name__=='__main__':
    app.run(port=5000, debug=True, host='0.0.0.0')