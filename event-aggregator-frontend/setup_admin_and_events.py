"""
Setup Admin User and Add Internship Events
Run this script to:
1. Create/Update admin user with credentials
2. Add internship events for all departments
"""

from datetime import datetime, timedelta
import sys
import os

# Add the project directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from main import app, db, User, Event, bcrypt

def setup_admin():
    """Create or update admin user"""
    with app.app_context():
        # Admin credentials
        ADMIN_EMAIL = "admin@college.edu"
        ADMIN_PASSWORD = "admin@123"
        
        # Check if admin exists
        admin = User.query.filter_by(email=ADMIN_EMAIL).first()
        
        if admin:
            # Update existing admin
            admin.password = bcrypt.generate_password_hash(ADMIN_PASSWORD).decode('utf-8')
            admin.is_admin = True
            admin.is_organizer = True
            db.session.commit()
            print("✅ Admin user updated!")
        else:
            # Create new admin
            hashed_password = bcrypt.generate_password_hash(ADMIN_PASSWORD).decode('utf-8')
            admin = User(
                username='admin',
                email=ADMIN_EMAIL,
                password=hashed_password,
                department='Administration',
                year='N/A',
                is_organizer=True,
                is_admin=True
            )
            db.session.add(admin)
            db.session.commit()
            print("✅ Admin user created!")
        
        print("\n" + "="*50)
        print("🔐 ADMIN CREDENTIALS")
        print("="*50)
        print(f"📧 Email: {ADMIN_EMAIL}")
        print(f"🔑 Password: {ADMIN_PASSWORD}")
        print("="*50 + "\n")
        
        return admin

def add_internship_events():
    """Add internship events for all departments"""
    with app.app_context():
        admin = User.query.filter_by(is_admin=True).first()
        if not admin:
            print("❌ Admin user not found. Run setup_admin() first.")
            return
        
        departments = [
            'Computer Science and Engineering',
            'Computer Science and Engineering (Artifcial Intelligence and Machine Learning)',
            'Electrical Engineering',
            'Mechanical Engineering',
            'Civil Engineering',
            'Electronics and Communication Engineering'
        ]
        
        internship_events = []
        base_date = datetime.now() + timedelta(days=15)
        
        for i, dept in enumerate(departments):
            event_date = base_date + timedelta(days=i*2)
            
            # Create internship event for each department
            event = Event(
                title=f"Summer Internship Program 2024 - {dept.split()[0]}",
                description=f"Exciting summer internship opportunities for {dept} students. "
                           f"Work with leading companies and gain real-world experience. "
                           f"Open to students from 2nd year to 4th year. "
                           f"Duration: 6-8 weeks. Stipend provided. "
                           f"Application deadline: {(event_date - timedelta(days=7)).strftime('%B %d, %Y')}",
                category='Internship',
                date_time=event_date,
                venue='Career Development Center',
                organizer='Placement Cell',
                department=dept,
                max_participants=50,
                registration_deadline=event_date - timedelta(days=3),
                is_featured=(i < 2),  # First 2 are featured
                created_by=admin.id
            )
            internship_events.append(event)
        
        # Add all events to database
        for event in internship_events:
            db.session.add(event)
        
        db.session.commit()
        print(f"✅ Added {len(internship_events)} internship events!")
        print("\nInternship Events Created:")
        print("-" * 50)
        for event in internship_events:
            print(f"📅 {event.title}")
            print(f"   Department: {event.department}")
            print(f"   Date: {event.date_time.strftime('%B %d, %Y')}")
            print(f"   Featured: {'Yes' if event.is_featured else 'No'}")
            print()

def main():
    """Main setup function"""
    print("\n" + "="*60)
    print("🚀 SETTING UP ADMIN AND INTERNSHIP EVENTS")
    print("="*60 + "\n")
    
    # Step 1: Setup admin
    print("Step 1: Setting up admin user...")
    admin = setup_admin()
    
    # Step 2: Add internship events
    print("\nStep 2: Adding internship events...")
    add_internship_events()
    
    print("\n" + "="*60)
    print("✅ SETUP COMPLETE!")
    print("="*60)
    print("\n📝 IMPORTANT INFORMATION:")
    print("-" * 60)
    print("Admin Email: admin@college.edu")
    print("Admin Password: admin@123")
    print("-" * 60)
    print("\n🎯 What's been done:")
    print("  ✅ Admin user created/updated")
    print("  ✅ 6 Internship events added (one per department)")
    print("  ✅ Events are for 2nd to 4th year students")
    print("  ✅ First 2 events marked as featured")
    print("\n💡 Next steps:")
    print("  1. Start backend: python main.py")
    print("  2. Start frontend: cd event-aggregator-frontend && npm start")
    print("  3. Login as admin with credentials above")
    print("  4. Check /events page for internship events")
    print("\n" + "="*60 + "\n")

if __name__ == '__main__':
    main()
