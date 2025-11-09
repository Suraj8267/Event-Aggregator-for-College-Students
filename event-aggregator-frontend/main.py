from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from datetime import datetime, timedelta
import jwt
import os
from functools import wraps
import logging
from logging.handlers import RotatingFileHandler

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-change-in-production'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///events.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Create upload folder if it doesn't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Initialize extensions
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
CORS(app, origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001", "http://127.0.0.1:3001"], supports_credentials=True)

# Setup logging
handler = RotatingFileHandler('app.log', maxBytes=10000, backupCount=3)
handler.setLevel(logging.INFO)
app.logger.addHandler(handler)

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    department = db.Column(db.String(100), nullable=False)
    year = db.Column(db.String(20), nullable=False)
    is_organizer = db.Column(db.Boolean, default=False)
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    profile_picture = db.Column(db.String(500), nullable=True)
    
    events_created = db.relationship('Event', backref='organizer', lazy=True)
    registrations = db.relationship('EventRegistration', backref='user', lazy=True)
    notifications = db.relationship('Notification', backref='user', lazy=True)

class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(100), nullable=False)
    department = db.Column(db.String(100), nullable=False)
    venue = db.Column(db.String(200), nullable=False)
    date_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    max_participants = db.Column(db.Integer, nullable=True)
    current_participants = db.Column(db.Integer, default=0)
    image_url = db.Column(db.String(500), nullable=True)
    contact_email = db.Column(db.String(120), nullable=False)
    contact_phone = db.Column(db.String(20), nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    is_featured = db.Column(db.Boolean, default=False)
    registration_deadline = db.Column(db.DateTime, nullable=True)
    created_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    registrations = db.relationship('EventRegistration', backref='event', lazy=True)
    notifications = db.relationship('Notification', backref='event', lazy=True)

class EventRegistration(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False)
    registration_date = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='registered')
    attended = db.Column(db.Boolean, default=False)
    
    __table_args__ = (db.UniqueConstraint('user_id', 'event_id', name='unique_user_event'),)

class Certificate(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False)
    issue_date = db.Column(db.DateTime, default=datetime.utcnow)
    certificate_url = db.Column(db.String(500), nullable=True)
    template_data = db.Column(db.JSON, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    user = db.relationship('User', backref='certificates')
    event = db.relationship('Event', backref='certificates')

class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=True)
    title = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    notification_type = db.Column(db.String(50), default='info')  # info, success, warning, error

# Authentication Decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            token = token.split(' ')[1]  # Remove 'Bearer ' prefix
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
            
            if not current_user:
                return jsonify({'message': 'User not found!'}), 401
                
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid!'}), 401
        except Exception as e:
            return jsonify({'message': 'Token verification failed!'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

def admin_required(f):
    @wraps(f)
    def decorated(current_user, *args, **kwargs):
        if not current_user.is_admin:
            return jsonify({'message': 'Admin access required!'}), 403
        return f(current_user, *args, **kwargs)
    return decorated

# Helper function to generate JWT token
def generate_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

# Helper function to create notification
def create_notification(user_id, title, message, event_id=None, notification_type='info'):
    notification = Notification(
        user_id=user_id,
        event_id=event_id,
        title=title,
        message=message,
        notification_type=notification_type
    )
    db.session.add(notification)
    db.session.commit()

# Initialize database and create admin user
def initialize_database():
    with app.app_context():
        # Create all tables
        db.create_all()
        
        # Create admin user if not exists
        admin = User.query.filter_by(email='admin@college.edu').first()
        if not admin:
            hashed_password = bcrypt.generate_password_hash('admin123').decode('utf-8')
            admin = User(
                username='admin',
                email='admin@college.edu',
                password=hashed_password,
                department='Administration',
                year='N/A',
                is_organizer=True,
                is_admin=True
            )
            db.session.add(admin)
            db.session.commit()
            print("Admin user created: admin@college.edu / admin123")
        
        print("Database initialized successfully!")

# Routes

@app.route('/')
def home():
    return jsonify({
        'message': 'College Event Aggregator API',
        'version': '1.0.0',
        'endpoints': {
            'auth': ['/register', '/login'],
            'events': ['/events', '/events/<id>', '/my-events'],
            'user': ['/profile', '/notifications']
        }
    })

# Authentication Routes
@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validation
        required_fields = ['username', 'email', 'password', 'department', 'year']
        for field in required_fields:
            if field not in data:
                return jsonify({'message': f'{field} is required!'}), 400
        
        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'message': 'Email already registered!'}), 400
        
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'message': 'Username already taken!'}), 400
        
        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        
        user = User(
            username=data['username'],
            email=data['email'],
            password=hashed_password,
            department=data['department'],
            year=data['year'],
            is_organizer=data.get('is_organizer', False)
        )
        
        db.session.add(user)
        db.session.commit()
        
        token = generate_token(user.id)
        
        # Create welcome notification
        create_notification(
            user.id,
            'Welcome to Event Aggregator!',
            'Thank you for registering. Start exploring events now!',
            notification_type='success'
        )
        
        app.logger.info(f'New user registered: {user.username}')
        
        return jsonify({
            'message': 'User created successfully!',
            'token': token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'department': user.department,
                'year': user.year,
                'is_organizer': user.is_organizer
            }
        }), 201
        
    except Exception as e:
        app.logger.error(f'Registration error: {str(e)}')
        return jsonify({'message': 'Internal server error'}), 500

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({'message': 'Email and password are required!'}), 400
        
        user = User.query.filter_by(email=data['email']).first()
        
        if user and bcrypt.check_password_hash(user.password, data['password']):
            token = generate_token(user.id)
            
            app.logger.info(f'User logged in: {user.username}')
            
            return jsonify({
                'message': 'Login successful!',
                'token': token,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'department': user.department,
                    'year': user.year,
                    'is_organizer': user.is_organizer,
                    'is_admin': user.is_admin
                }
            })
        
        return jsonify({'message': 'Invalid email or password!'}), 401
        
    except Exception as e:
        app.logger.error(f'Login error: {str(e)}')
        return jsonify({'message': 'Internal server error'}), 500

# User Profile Routes
@app.route('/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    try:
        # Get user's event statistics
        events_created = len(current_user.events_created)
        events_registered = len(current_user.registrations)
        events_attended = len([reg for reg in current_user.registrations if reg.attended])
        
        profile_data = {
            'id': current_user.id,
            'username': current_user.username,
            'email': current_user.email,
            'department': current_user.department,
            'year': current_user.year,
            'is_organizer': current_user.is_organizer,
            'is_admin': current_user.is_admin,
            'created_at': current_user.created_at.isoformat(),
            'profile_picture': current_user.profile_picture,
            'statistics': {
                'events_created': events_created,
                'events_registered': events_registered,
                'events_attended': events_attended
            }
        }
        
        return jsonify({'profile': profile_data})
        
    except Exception as e:
        app.logger.error(f'Profile error: {str(e)}')
        return jsonify({'message': 'Internal server error'}), 500

@app.route('/profile', methods=['PUT'])
@token_required
def update_profile(current_user):
    try:
        data = request.get_json()
        
        if 'username' in data and data['username'] != current_user.username:
            if User.query.filter_by(username=data['username']).first():
                return jsonify({'message': 'Username already taken!'}), 400
            current_user.username = data['username']
        
        if 'department' in data:
            current_user.department = data['department']
        
        if 'year' in data:
            current_user.year = data['year']
        
        db.session.commit()
        
        return jsonify({'message': 'Profile updated successfully!'})
        
    except Exception as e:
        app.logger.error(f'Profile update error: {str(e)}')
        return jsonify({'message': 'Internal server error'}), 500

# Event Routes
@app.route('/events', methods=['GET'])
def get_events():
    try:
        # Get query parameters for filtering
        category = request.args.get('category')
        department = request.args.get('department')
        search = request.args.get('search')
        upcoming = request.args.get('upcoming')
        featured = request.args.get('featured')
        organizer = request.args.get('organizer')
        limit = int(request.args.get('limit', 50))
        page = int(request.args.get('page', 1))
        
        query = Event.query.filter_by(is_active=True)
        
        if category and category != 'all':
            query = query.filter_by(category=category)
        
        if department and department != 'all':
            query = query.filter_by(department=department)
        
        if search:
            query = query.filter(
                db.or_(
                    Event.title.ilike(f'%{search}%'),
                    Event.description.ilike(f'%{search}%'),
                    Event.venue.ilike(f'%{search}%')
                )
            )
        
        if upcoming:
            query = query.filter(Event.date_time >= datetime.utcnow())
        
        if featured:
            query = query.filter(Event.is_featured == True)
        
        if organizer:
            query = query.filter(Event.created_by == organizer)
        
        # Pagination
        total_events = query.count()
        events = query.order_by(Event.date_time.asc()).offset((page - 1) * limit).limit(limit).all()
        
        events_data = []
        for event in events:
            events_data.append({
                'id': event.id,
                'title': event.title,
                'description': event.description,
                'category': event.category,
                'department': event.department,
                'venue': event.venue,
                'date_time': event.date_time.isoformat(),
                'end_time': event.end_time.isoformat(),
                'max_participants': event.max_participants,
                'current_participants': event.current_participants,
                'image_url': event.image_url,
                'contact_email': event.contact_email,
                'contact_phone': event.contact_phone,
                'organizer': event.organizer.username,
                'created_by': event.created_by,
                'is_featured': event.is_featured,
                'registration_deadline': event.registration_deadline.isoformat() if event.registration_deadline else None,
                'can_register': event.registration_deadline and event.registration_deadline > datetime.utcnow() if event.registration_deadline else True
            })
        
        return jsonify({
            'events': events_data,
            'pagination': {
                'page': page,
                'limit': limit,
                'total': total_events,
                'pages': (total_events + limit - 1) // limit
            }
        })
        
    except Exception as e:
        app.logger.error(f'Get events error: {str(e)}')
        return jsonify({'message': 'Internal server error'}), 500

@app.route('/events/featured', methods=['GET'])
def get_featured_events():
    try:
        featured_events = Event.query.filter_by(
            is_active=True, 
            is_featured=True
        ).filter(
            Event.date_time >= datetime.utcnow()
        ).order_by(Event.date_time.asc()).limit(6).all()
        
        events_data = []
        for event in featured_events:
            events_data.append({
                'id': event.id,
                'title': event.title,
                'description': event.description[:100] + '...' if len(event.description) > 100 else event.description,
                'category': event.category,
                'date_time': event.date_time.isoformat(),
                'venue': event.venue,
                'image_url': event.image_url,
                'current_participants': event.current_participants,
                'max_participants': event.max_participants
            })
        
        return jsonify({'events': events_data})
        
    except Exception as e:
        app.logger.error(f'Featured events error: {str(e)}')
        return jsonify({'message': 'Internal server error'}), 500

@app.route('/events/<int:event_id>', methods=['GET'])
def get_event(event_id):
    try:
        event = Event.query.get_or_404(event_id)
        
        # Check if user is registered (if authenticated)
        is_registered = False
        token = request.headers.get('Authorization')
        if token:
            try:
                token = token.split(' ')[1]
                data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
                current_user = User.query.get(data['user_id'])
                if current_user:
                    registration = EventRegistration.query.filter_by(
                        user_id=current_user.id, 
                        event_id=event_id
                    ).first()
                    is_registered = bool(registration)
            except:
                pass
        
        event_data = {
            'id': event.id,
            'title': event.title,
            'description': event.description,
            'category': event.category,
            'department': event.department,
            'venue': event.venue,
            'date_time': event.date_time.isoformat(),
            'end_time': event.end_time.isoformat(),
            'max_participants': event.max_participants,
            'current_participants': event.current_participants,
            'image_url': event.image_url,
            'contact_email': event.contact_email,
            'contact_phone': event.contact_phone,
            'organizer': event.organizer.username,
            'organizer_email': event.organizer.email,
            'created_by': event.created_by,
            'is_active': event.is_active,
            'is_featured': event.is_featured,
            'registration_deadline': event.registration_deadline.isoformat() if event.registration_deadline else None,
            'is_registered': is_registered,
            'can_register': event.registration_deadline and event.registration_deadline > datetime.utcnow() if event.registration_deadline else True
        }
        
        return jsonify({'event': event_data})
        
    except Exception as e:
        app.logger.error(f'Get event error: {str(e)}')
        return jsonify({'message': 'Internal server error'}), 500

@app.route('/events', methods=['POST'])
@token_required
def create_event(current_user):
    try:
        if not current_user.is_organizer:
            return jsonify({'message': 'Only organizers can create events!'}), 403
        
        data = request.get_json()
        
        # Validation
        required_fields = ['title', 'description', 'category', 'department', 'venue', 'date_time', 'end_time', 'contact_email']
        for field in required_fields:
            if field not in data:
                return jsonify({'message': f'{field} is required!'}), 400
        
        # Parse datetime strings
        date_time = datetime.fromisoformat(data['date_time'].replace('Z', '+00:00'))
        end_time = datetime.fromisoformat(data['end_time'].replace('Z', '+00:00'))
        registration_deadline = None
        if data.get('registration_deadline'):
            registration_deadline = datetime.fromisoformat(data['registration_deadline'].replace('Z', '+00:00'))
        
        event = Event(
            title=data['title'],
            description=data['description'],
            category=data['category'],
            department=data['department'],
            venue=data['venue'],
            date_time=date_time,
            end_time=end_time,
            max_participants=data.get('max_participants'),
            image_url=data.get('image_url', '/static/images/default-event.jpg'),
            contact_email=data['contact_email'],
            contact_phone=data.get('contact_phone'),
            is_featured=data.get('is_featured', False),
            registration_deadline=registration_deadline,
            created_by=current_user.id
        )
        
        db.session.add(event)
        db.session.commit()
        
        app.logger.info(f'New event created: {event.title} by {current_user.username}')
        
        return jsonify({
            'message': 'Event created successfully!',
            'event': {
                'id': event.id,
                'title': event.title,
                'description': event.description
            }
        }), 201
        
    except Exception as e:
        app.logger.error(f'Create event error: {str(e)}')
        return jsonify({'message': 'Internal server error'}), 500

@app.route('/events/<int:event_id>', methods=['PUT'])
@token_required
def update_event(current_user, event_id):
    try:
        event = Event.query.get_or_404(event_id)
        
        if event.created_by != current_user.id and not current_user.is_admin:
            return jsonify({'message': 'You can only edit your own events!'}), 403
        
        data = request.get_json()
        
        event.title = data.get('title', event.title)
        event.description = data.get('description', event.description)
        event.category = data.get('category', event.category)
        event.department = data.get('department', event.department)
        event.venue = data.get('venue', event.venue)
        
        if 'date_time' in data:
            event.date_time = datetime.fromisoformat(data['date_time'].replace('Z', '+00:00'))
        if 'end_time' in data:
            event.end_time = datetime.fromisoformat(data['end_time'].replace('Z', '+00:00'))
        if 'registration_deadline' in data:
            event.registration_deadline = datetime.fromisoformat(data['registration_deadline'].replace('Z', '+00:00')) if data['registration_deadline'] else None
        
        event.max_participants = data.get('max_participants', event.max_participants)
        event.image_url = data.get('image_url', event.image_url)
        event.contact_email = data.get('contact_email', event.contact_email)
        event.contact_phone = data.get('contact_phone', event.contact_phone)
        event.is_featured = data.get('is_featured', event.is_featured)
        
        db.session.commit()
        
        app.logger.info(f'Event updated: {event.title} by {current_user.username}')
        
        return jsonify({'message': 'Event updated successfully!'})
        
    except Exception as e:
        app.logger.error(f'Update event error: {str(e)}')
        return jsonify({'message': 'Internal server error'}), 500

@app.route('/events/<int:event_id>', methods=['DELETE'])
@token_required
def delete_event(current_user, event_id):
    try:
        event = Event.query.get_or_404(event_id)
        
        if event.created_by != current_user.id and not current_user.is_admin:
            return jsonify({'message': 'You can only delete your own events!'}), 403
        
        # Create notifications for registered users
        registrations = EventRegistration.query.filter_by(event_id=event_id).all()
        for registration in registrations:
            create_notification(
                registration.user_id,
                'Event Cancelled',
                f'The event "{event.title}" has been cancelled.',
                notification_type='warning'
            )
        
        # Delete all registrations for this event first
        EventRegistration.query.filter_by(event_id=event_id).delete()
        
        db.session.delete(event)
        db.session.commit()
        
        app.logger.info(f'Event deleted: {event.title} by {current_user.username}')
        
        return jsonify({'message': 'Event deleted successfully!'})
        
    except Exception as e:
        app.logger.error(f'Delete event error: {str(e)}')
        return jsonify({'message': 'Internal server error'}), 500

# Event Registration Routes
@app.route('/events/<int:event_id>/register', methods=['POST'])
@token_required
def register_for_event(current_user, event_id):
    try:
        event = Event.query.get_or_404(event_id)
        
        # Check if event is active
        if not event.is_active:
            return jsonify({'message': 'This event is no longer active!'}), 400
        
        # Check if event has already occurred
        if event.date_time < datetime.utcnow():
            return jsonify({'message': 'This event has already occurred!'}), 400
        
        # Check if registration deadline has passed
        if event.registration_deadline and event.registration_deadline < datetime.utcnow():
            return jsonify({'message': 'Registration deadline has passed!'}), 400
        
        # Check if user is already registered
        existing_registration = EventRegistration.query.filter_by(
            user_id=current_user.id, 
            event_id=event_id
        ).first()
        
        if existing_registration:
            return jsonify({'message': 'You are already registered for this event!'}), 400
        
        # Check if event is full
        if event.max_participants and event.current_participants >= event.max_participants:
            return jsonify({'message': 'This event is full!'}), 400
        
        registration = EventRegistration(
            user_id=current_user.id,
            event_id=event_id
        )
        
        event.current_participants += 1
        
        db.session.add(registration)
        db.session.commit()
        
        # Create notification for user
        create_notification(
            current_user.id,
            'Event Registration Successful',
            f'You have successfully registered for "{event.title}".',
            event_id=event_id,
            notification_type='success'
        )
        
        # Create notification for event organizer
        create_notification(
            event.created_by,
            'New Event Registration',
            f'{current_user.username} has registered for your event "{event.title}".',
            event_id=event_id,
            notification_type='info'
        )
        
        app.logger.info(f'User {current_user.username} registered for event {event.title}')
        
        return jsonify({'message': 'Successfully registered for the event!'})
        
    except Exception as e:
        app.logger.error(f'Event registration error: {str(e)}')
        return jsonify({'message': 'Internal server error'}), 500

@app.route('/events/<int:event_id>/unregister', methods=['POST'])
@token_required
def unregister_from_event(current_user, event_id):
    try:
        registration = EventRegistration.query.filter_by(
            user_id=current_user.id, 
            event_id=event_id
        ).first_or_404()
        
        event = Event.query.get(event_id)
        event.current_participants = max(0, event.current_participants - 1)
        
        db.session.delete(registration)
        db.session.commit()
        
        # Create notification for user
        create_notification(
            current_user.id,
            'Event Unregistration',
            f'You have unregistered from "{event.title}".',
            notification_type='info'
        )
        
        app.logger.info(f'User {current_user.username} unregistered from event {event.title}')
        
        return jsonify({'message': 'Successfully unregistered from the event!'})
        
    except Exception as e:
        app.logger.error(f'Event unregistration error: {str(e)}')
        return jsonify({'message': 'Internal server error'}), 500

@app.route('/my-events', methods=['GET'])
@token_required
def get_my_events(current_user):
    try:
        # Events created by user
        created_events = Event.query.filter_by(created_by=current_user.id).order_by(Event.date_time.desc()).all()
        
        # Events user registered for
        registrations = EventRegistration.query.filter_by(user_id=current_user.id).order_by(EventRegistration.registration_date.desc()).all()
        registered_events = [registration.event for registration in registrations]
        
        created_events_data = []
        for event in created_events:
            created_events_data.append({
                'id': event.id,
                'title': event.title,
                'date_time': event.date_time.isoformat(),
                'venue': event.venue,
                'current_participants': event.current_participants,
                'max_participants': event.max_participants,
                'is_active': event.is_active,
                'category': event.category
            })
        
        registered_events_data = []
        for event in registered_events:
            registration = EventRegistration.query.filter_by(user_id=current_user.id, event_id=event.id).first()
            registered_events_data.append({
                'id': event.id,
                'title': event.title,
                'date_time': event.date_time.isoformat(),
                'venue': event.venue,
                'organizer': event.organizer.username,
                'contact_email': event.contact_email,
                'category': event.category,
                'registration_date': registration.registration_date.isoformat(),
                'attended': registration.attended
            })
        
        return jsonify({
            'created_events': created_events_data,
            'registered_events': registered_events_data
        })
        
    except Exception as e:
        app.logger.error(f'Get my events error: {str(e)}')
        return jsonify({'message': 'Internal server error'}), 500

# Notification Routes
@app.route('/notifications', methods=['GET'])
@token_required
def get_notifications(current_user):
    try:
        unread_only = request.args.get('unread_only', 'false').lower() == 'true'
        limit = int(request.args.get('limit', 20))
        
        query = Notification.query.filter_by(user_id=current_user.id)
        
        if unread_only:
            query = query.filter_by(is_read=False)
        
        notifications = query.order_by(Notification.created_at.desc()).limit(limit).all()
        
        notifications_data = []
        for notification in notifications:
            notifications_data.append({
                'id': notification.id,
                'title': notification.title,
                'message': notification.message,
                'is_read': notification.is_read,
                'created_at': notification.created_at.isoformat(),
                'notification_type': notification.notification_type,
                'event_id': notification.event_id
            })
        
        # Get unread count
        unread_count = Notification.query.filter_by(user_id=current_user.id, is_read=False).count()
        
        return jsonify({
            'notifications': notifications_data,
            'unread_count': unread_count
        })
        
    except Exception as e:
        app.logger.error(f'Get notifications error: {str(e)}')
        return jsonify({'message': 'Internal server error'}), 500

@app.route('/notifications/<int:notification_id>/read', methods=['PUT'])
@token_required
def mark_notification_read(current_user, notification_id):
    try:
        notification = Notification.query.filter_by(id=notification_id, user_id=current_user.id).first_or_404()
        
        notification.is_read = True
        db.session.commit()
        
        return jsonify({'message': 'Notification marked as read!'})
        
    except Exception as e:
        app.logger.error(f'Mark notification read error: {str(e)}')
        return jsonify({'message': 'Internal server error'}), 500

@app.route('/notifications/read-all', methods=['PUT'])
@token_required
def mark_all_notifications_read(current_user):
    try:
        Notification.query.filter_by(user_id=current_user.id, is_read=False).update({'is_read': True})
        db.session.commit()
        
        return jsonify({'message': 'All notifications marked as read!'})
        
    except Exception as e:
        app.logger.error(f'Mark all notifications read error: {str(e)}')
        return jsonify({'message': 'Internal server error'}), 500

# Utility Routes
@app.route('/categories', methods=['GET'])
def get_categories():
    categories = [
        'Technical',
        'Cultural',
        'Sports',
        'Workshop',
        'Seminar',
        'Conference',
        'Hackathon',
        'Competition',
        'Social',
        'Other'
    ]
    return jsonify({'categories': categories})

@app.route('/departments', methods=['GET'])
def get_departments():
    departments = [
        'Computer Science and Engineering',
        'Computer Science and Engineering (Artifcial Intelligence and Machine Learning)',
        'Electrical Engineering',
        'Mechanical Engineering',
        'Civil Engineering',
        'Electronics and Communication Engineering',
        'All Departments'
    ]
    return jsonify({'departments': departments})

@app.route('/stats', methods=['GET'])
@token_required
@admin_required
def get_stats(current_user):
    try:
        total_users = User.query.count()
        total_organizers = User.query.filter_by(is_organizer=True).count()
        total_events = Event.query.count()
        active_events = Event.query.filter_by(is_active=True).filter(Event.date_time >= datetime.utcnow()).count()
        total_registrations = EventRegistration.query.count()
        
        # Recent events (last 7 days)
        week_ago = datetime.utcnow() - timedelta(days=7)
        recent_events = Event.query.filter(Event.created_at >= week_ago).count()
        
        # Popular categories
        category_stats = db.session.query(
            Event.category,
            db.func.count(Event.id).label('count')
        ).group_by(Event.category).all()
        
        return jsonify({
            'total_users': total_users,
            'total_organizers': total_organizers,
            'total_events': total_events,
            'active_events': active_events,
            'total_registrations': total_registrations,
            'recent_events': recent_events,
            'category_stats': [{'category': cat, 'count': count} for cat, count in category_stats]
        })
        
    except Exception as e:
        app.logger.error(f'Get stats error: {str(e)}')
        return jsonify({'message': 'Internal server error'}), 500

# Certificate Routes
@app.route('/certificates', methods=['GET'])
@token_required
def get_certificates(current_user):
    try:
        certificates = Certificate.query.filter_by(user_id=current_user.id).all()
        certificates_data = []
        
        for cert in certificates:
            certificates_data.append({
                'id': cert.id,
                'event_id': cert.event_id,
                'event_title': cert.event.title,
                'issue_date': cert.issue_date.isoformat(),
                'certificate_url': cert.certificate_url,
                'event_category': cert.event.category,
                'template_data': cert.template_data
            })
        
        return jsonify({'certificates': certificates_data})
        
    except Exception as e:
        app.logger.error(f'Get certificates error: {str(e)}')
        return jsonify({'message': 'Internal server error'}), 500

@app.route('/certificates/<int:certificate_id>', methods=['GET'])
@token_required
def get_certificate(current_user, certificate_id):
    try:
        certificate = Certificate.query.filter_by(
            id=certificate_id, 
            user_id=current_user.id
        ).first_or_404()
        
        return jsonify({
            'certificate': {
                'id': certificate.id,
                'event_id': certificate.event_id,
                'event_title': certificate.event.title,
                'issue_date': certificate.issue_date.isoformat(),
                'certificate_url': certificate.certificate_url,
                'template_data': certificate.template_data,
                'event_category': certificate.event.category
            }
        })
        
    except Exception as e:
        app.logger.error(f'Get certificate error: {str(e)}')
        return jsonify({'message': 'Internal server error'}), 500

@app.route('/events/<int:event_id>/certificates', methods=['POST'])
@token_required
def generate_certificate(current_user, event_id):
    try:
        # Check if user has attended the event
        registration = EventRegistration.query.filter_by(
            user_id=current_user.id,
            event_id=event_id,
            attended=True
        ).first()
        
        if not registration:
            return jsonify({'message': 'You must attend the event to receive a certificate!'}), 400
        
        # Check if certificate already exists
        existing_cert = Certificate.query.filter_by(
            user_id=current_user.id,
            event_id=event_id
        ).first()
        
        if existing_cert:
            return jsonify({'message': 'Certificate already generated!'}), 400
            
        event = Event.query.get_or_404(event_id)
        
        # Generate certificate (in a real app, this would create an actual PDF)
        template_data = {
            'participant_name': current_user.username,
            'event_name': event.title,
            'completion_date': datetime.utcnow().strftime('%B %d, %Y'),
            'certificate_id': f'CERT-{event_id}-{current_user.id}-{int(datetime.utcnow().timestamp())}'
        }
        
        certificate = Certificate(
            user_id=current_user.id,
            event_id=event_id,
            certificate_url=f'/static/certificates/{template_data["certificate_id"]}.pdf',
            template_data=template_data
        )
        
        db.session.add(certificate)
        db.session.commit()
        
        return jsonify({
            'message': 'Certificate generated successfully!',
            'certificate': {
                'id': certificate.id,
                'event_title': event.title,
                'issue_date': certificate.issue_date.isoformat(),
                'certificate_url': certificate.certificate_url
            }
        })
        
    except Exception as e:
        app.logger.error(f'Generate certificate error: {str(e)}')
        return jsonify({'message': 'Internal server error'}), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'message': 'Resource not found!'}), 404

@app.errorhandler(500)
def internal_error(error):
    app.logger.error(f'Server Error: {str(error)}')
    return jsonify({'message': 'Internal server error!'}), 500

@app.errorhandler(413)
def too_large(error):
    return jsonify({'message': 'File too large!'}), 413

if __name__ == '__main__':
    # Initialize database before first request
    initialize_database()
    app.run(debug=True, host='localhost', port=5000)