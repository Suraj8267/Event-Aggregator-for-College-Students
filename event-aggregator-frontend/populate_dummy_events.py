"""Script to populate dummy events"""
from main import app, db, Event, User
from datetime import datetime, timedelta

def create_dummy_events():
    with app.app_context():
        admin = User.query.filter_by(email='admin@college.edu').first()
        if not admin:
            print("Run main.py first to create admin user")
            return
        
        events = [
            # Hackathons
            Event(title='AI/ML Hackathon 2024', description='Build AI solutions in 48 hours', category='Hackathon',
                  department='Computer Science and Engineering', venue='Tech Hub', 
                  date_time=datetime.utcnow()+timedelta(days=15), end_time=datetime.utcnow()+timedelta(days=17),
                  max_participants=100, current_participants=45, contact_email='hack@college.edu', 
                  is_featured=True, created_by=admin.id),
            
            # Quizzes
            Event(title='TechQuiz Championship', description='Technical quiz competition', category='Competition',
                  department='All Departments', venue='Auditorium', 
                  date_time=datetime.utcnow()+timedelta(days=10), end_time=datetime.utcnow()+timedelta(days=10, hours=3),
                  max_participants=200, current_participants=87, contact_email='quiz@college.edu',
                  is_featured=True, created_by=admin.id),
            
            # Robotics
            Event(title='Robotics Challenge 2024', description='Build autonomous robots', category='Competition',
                  department='Mechanical Engineering', venue='Robotics Lab', 
                  date_time=datetime.utcnow()+timedelta(days=20), end_time=datetime.utcnow()+timedelta(days=22),
                  max_participants=50, current_participants=23, contact_email='robotics@college.edu',
                  is_featured=False, created_by=admin.id),
            
            # Workshops
            Event(title='Cybersecurity Workshop', description='Ethical hacking fundamentals', category='Workshop',
                  department='Computer Science and Engineering', venue='Lab 301', 
                  date_time=datetime.utcnow()+timedelta(days=8), end_time=datetime.utcnow()+timedelta(days=8, hours=4),
                  max_participants=60, current_participants=41, contact_email='security@college.edu',
                  is_featured=True, created_by=admin.id),
        ]
        
        for event in events:
            db.session.add(event)
        
        db.session.commit()
        print(f"Created {len(events)} dummy events successfully!")

if __name__ == '__main__':
    create_dummy_events()
