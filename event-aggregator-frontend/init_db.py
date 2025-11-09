from main import app, db, User, Event, bcrypt
from datetime import datetime, timedelta

def create_dummy_events():
    with app.app_context():
        # Create an organizer if not exists
        organizer = User.query.filter_by(email='organizer@college.edu').first()
        if not organizer:
            hashed_password = bcrypt.generate_password_hash('organizer123').decode('utf-8')
            organizer = User(
                username='event_organizer',
                email='organizer@college.edu',
                password=hashed_password,
                department='Computer Science and Engineering',
                year='2023',
                is_organizer=True
            )
            db.session.add(organizer)
            db.session.commit()

        # Create dummy events
        dummy_events = [
            {
                'title': 'Annual Tech Symposium 2025',
                'description': 'Join us for a day of cutting-edge technology discussions, workshops, and networking opportunities. Featuring industry experts and innovative showcases.',
                'category': 'Technical',
                'department': 'Computer Science and Engineering',
                'venue': 'Main Auditorium',
                'date_time': datetime.utcnow() + timedelta(days=30),
                'end_time': datetime.utcnow() + timedelta(days=30, hours=8),
                'max_participants': 200,
                'image_url': 'https://placehold.co/600x400?text=Tech+Symposium',
                'is_featured': True,
                'contact_email': 'organizer@college.edu'
            },
            {
                'title': 'Cultural Fest "Harmony 2025"',
                'description': 'Experience the vibrant cultural diversity through music, dance, and art performances. Showcase your talents and celebrate creativity.',
                'category': 'Cultural',
                'department': 'All Departments',
                'venue': 'College Ground',
                'date_time': datetime.utcnow() + timedelta(days=45),
                'end_time': datetime.utcnow() + timedelta(days=47),
                'max_participants': 500,
                'image_url': 'https://placehold.co/600x400?text=Cultural+Fest',
                'is_featured': True,
                'contact_email': 'organizer@college.edu'
            },
            {
                'title': 'AI/ML Workshop Series',
                'description': 'Three-day intensive workshop on Artificial Intelligence and Machine Learning. Learn from experts about the latest trends and hands-on implementation.',
                'category': 'Workshop',
                'department': 'Computer Science and Engineering (Artifcial Intelligence and Machine Learning)',
                'venue': 'CSE Lab 1',
                'date_time': datetime.utcnow() + timedelta(days=15),
                'end_time': datetime.utcnow() + timedelta(days=17),
                'max_participants': 100,
                'image_url': 'https://placehold.co/600x400?text=AI+ML+Workshop',
                'contact_email': 'organizer@college.edu'
            },
            {
                'title': 'Sports Tournament 2025',
                'description': 'Annual inter-department sports tournament featuring cricket, football, basketball, and athletics. Compete and showcase your sporting excellence.',
                'category': 'Sports',
                'department': 'All Departments',
                'venue': 'College Sports Complex',
                'date_time': datetime.utcnow() + timedelta(days=60),
                'end_time': datetime.utcnow() + timedelta(days=65),
                'max_participants': 400,
                'image_url': 'https://placehold.co/600x400?text=Sports+Tournament',
                'contact_email': 'organizer@college.edu'
            },
            {
                'title': 'Hackathon: Code for Change',
                'description': 'A 24-hour coding marathon to develop innovative solutions for social challenges. Great prizes and networking opportunities await!',
                'category': 'Hackathon',
                'department': 'Computer Science and Engineering',
                'venue': 'Innovation Hub',
                'date_time': datetime.utcnow() + timedelta(days=20),
                'end_time': datetime.utcnow() + timedelta(days=21),
                'max_participants': 150,
                'image_url': 'https://placehold.co/600x400?text=Hackathon',
                'is_featured': True,
                'contact_email': 'organizer@college.edu'
            },
            {
                'title': 'Career Fair 2025',
                'description': 'Connect with leading companies and explore career opportunities. Features resume workshops, mock interviews, and company presentations.',
                'category': 'Seminar',
                'department': 'All Departments',
                'venue': 'College Convention Center',
                'date_time': datetime.utcnow() + timedelta(days=75),
                'end_time': datetime.utcnow() + timedelta(days=75, hours=8),
                'max_participants': 1000,
                'image_url': 'https://placehold.co/600x400?text=Career+Fair',
                'contact_email': 'organizer@college.edu'
            },
            {
                'title': 'Research Symposium',
                'description': 'Annual research presentation event showcasing student and faculty research work. Great opportunity to learn about ongoing research projects.',
                'category': 'Conference',
                'department': 'All Departments',
                'venue': 'Research Center',
                'date_time': datetime.utcnow() + timedelta(days=90),
                'end_time': datetime.utcnow() + timedelta(days=91),
                'max_participants': 300,
                'image_url': 'https://placehold.co/600x400?text=Research+Symposium',
                'contact_email': 'organizer@college.edu'
            },
            {
                'title': 'Entrepreneurship Workshop',
                'description': 'Learn from successful entrepreneurs and industry experts about starting and scaling your business. Includes networking session and pitch competition.',
                'category': 'Workshop',
                'department': 'All Departments',
                'venue': 'Business Center',
                'date_time': datetime.utcnow() + timedelta(days=40),
                'end_time': datetime.utcnow() + timedelta(days=40, hours=6),
                'max_participants': 120,
                'image_url': 'https://placehold.co/600x400?text=Entrepreneurship',
                'contact_email': 'organizer@college.edu'
            }
        ]

        # Add events to database
        for event_data in dummy_events:
            event = Event.query.filter_by(title=event_data['title']).first()
            if not event:
                event = Event(
                    created_by=organizer.id,
                    **event_data
                )
                db.session.add(event)

        db.session.commit()
        print("Dummy events created successfully!")

if __name__ == '__main__':
    create_dummy_events()