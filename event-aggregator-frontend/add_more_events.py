"""
Add More Events: Internships, Dance, Music, etc.
With department-based organizers and auto-generated posters
"""

from datetime import datetime, timedelta
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from main import app, db, User, Event

def generate_poster_url(category, department):
    """Generate poster URL based on category"""
    poster_urls = {
        'Internship': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
        'Dance': 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&h=600&fit=crop',
        'Music': 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=600&fit=crop',
        'Hackathon': 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop',
        'Workshop': 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop',
        'Competition': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
        'Quiz': 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&h=600&fit=crop',
        'Robotics': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop',
        'Seminar': 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=600&fit=crop',
        'Cultural': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop'
    }
    return poster_urls.get(category, 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop')

def add_diverse_events():
    """Add internship, dance, music and other events"""
    with app.app_context():
        # Get admin user
        admin = User.query.filter_by(is_admin=True).first()
        if not admin:
            print("❌ Admin user not found. Run setup_admin_and_events.py first.")
            return
        
        departments = [
            'Computer Science and Engineering',
            'Computer Science and Engineering (Artifcial Intelligence and Machine Learning)',
            'Electrical Engineering',
            'Mechanical Engineering',
            'Civil Engineering',
            'Electronics and Communication Engineering'
        ]
        
        base_date = datetime.now() + timedelta(days=10)
        
        # Internship Events (6 - one per department)
        internship_events = []
        for i, dept in enumerate(departments):
            event_date = base_date + timedelta(days=i*3)
            event = Event(
                title=f"Summer Internship Program 2024 - {dept.split()[0]} Dept",
                description=f"Exciting summer internship opportunities for {dept} students. "
                           f"Work with leading companies and gain real-world experience. "
                           f"Open to 2nd, 3rd, and 4th year students. Duration: 6-8 weeks. "
                           f"Stipend provided. Companies: TCS, Infosys, Wipro, Tech Mahindra. "
                           f"Application deadline: {(event_date - timedelta(days=7)).strftime('%B %d, %Y')}",
                category='Internship',
                date_time=event_date,
                venue='Career Development Center',
                organizer=dept,  # Department name as organizer
                department=dept,
                max_participants=50,
                registration_deadline=event_date - timedelta(days=3),
                is_featured=(i < 2),
                image_url=generate_poster_url('Internship', dept),
                created_by=admin.id
            )
            internship_events.append(event)
        
        # Dance Events (3)
        dance_events = [
            Event(
                title="Annual Cultural Fest - Dance Competition",
                description="Showcase your dancing talent! Solo, Duo, and Group categories. "
                           "Styles: Classical, Contemporary, Hip-Hop, Bollywood, Folk. "
                           "Prize money: 1st - ₹10,000, 2nd - ₹7,000, 3rd - ₹5,000. "
                           "Open to all departments. Registration fee: ₹100 per participant.",
                category='Cultural',
                date_time=base_date + timedelta(days=20),
                venue='Main Auditorium',
                organizer='Cultural Committee',
                department='All Departments',
                max_participants=100,
                registration_deadline=base_date + timedelta(days=17),
                is_featured=True,
                image_url=generate_poster_url('Dance', 'All'),
                created_by=admin.id
            ),
            Event(
                title="Freshers Welcome - Dance Night",
                description="Welcome party for first-year students! DJ night with dance performances. "
                           "Special performances by senior students. Food and refreshments included. "
                           "Dress code: Semi-formal. Free entry for all students.",
                category='Cultural',
                date_time=base_date + timedelta(days=25),
                venue='College Ground',
                organizer='Student Council',
                department='All Departments',
                max_participants=500,
                registration_deadline=base_date + timedelta(days=23),
                is_featured=False,
                image_url=generate_poster_url('Dance', 'All'),
                created_by=admin.id
            ),
            Event(
                title="Classical Dance Workshop",
                description="Learn Bharatanatyam, Kathak, and Odissi from renowned artists. "
                           "3-day intensive workshop. Certificate of participation provided. "
                           "No prior experience required. All materials provided.",
                category='Workshop',
                date_time=base_date + timedelta(days=30),
                venue='Dance Studio, Sports Complex',
                organizer='Fine Arts Department',
                department='All Departments',
                max_participants=40,
                registration_deadline=base_date + timedelta(days=27),
                is_featured=False,
                image_url=generate_poster_url('Dance', 'All'),
                created_by=admin.id
            )
        ]
        
        # Music Events (3)
        music_events = [
            Event(
                title="Battle of Bands - Rock Music Competition",
                description="Form your band and compete! Original compositions and covers allowed. "
                           "Categories: Rock, Pop, Indie, Metal. Professional sound system provided. "
                           "Prize: ₹15,000 + Recording studio session. Max 6 members per band.",
                category='Cultural',
                date_time=base_date + timedelta(days=35),
                venue='Open Air Theatre',
                organizer='Music Club',
                department='All Departments',
                max_participants=60,
                registration_deadline=base_date + timedelta(days=32),
                is_featured=True,
                image_url=generate_poster_url('Music', 'All'),
                created_by=admin.id
            ),
            Event(
                title="Classical Music Evening - Sitar & Tabla",
                description="Experience the magic of Indian classical music. Renowned artists performing. "
                           "Free entry for students. Dinner included. Limited seating.",
                category='Cultural',
                date_time=base_date + timedelta(days=40),
                venue='Main Auditorium',
                organizer='Cultural Committee',
                department='All Departments',
                max_participants=200,
                registration_deadline=base_date + timedelta(days=38),
                is_featured=False,
                image_url=generate_poster_url('Music', 'All'),
                created_by=admin.id
            ),
            Event(
                title="Music Production Workshop - FL Studio & Ableton",
                description="Learn music production from industry professionals. Topics: Beat making, "
                           "Mixing, Mastering, Sound design. Bring your laptop. Software provided. "
                           "Certificate on completion.",
                category='Workshop',
                date_time=base_date + timedelta(days=45),
                venue='Computer Lab 3',
                organizer='Electronics and Communication Engineering',
                department='Electronics and Communication Engineering',
                max_participants=30,
                registration_deadline=base_date + timedelta(days=42),
                is_featured=False,
                image_url=generate_poster_url('Music', 'All'),
                created_by=admin.id
            )
        ]
        
        # Additional Hackathons with Department Organizers
        hackathon_events = [
            Event(
                title="AI/ML Hackathon - Smart Solutions 2024",
                description="24-hour coding marathon! Build AI/ML solutions for real-world problems. "
                           "Themes: Healthcare, Education, Agriculture. Mentors from Google, Microsoft. "
                           "Prize: ₹50,000 + Internship opportunities. Free food and swag.",
                category='Hackathon',
                date_time=base_date + timedelta(days=15),
                venue='CSE Department Labs',
                organizer='Computer Science and Engineering (Artifcial Intelligence and Machine Learning)',
                department='Computer Science and Engineering (Artifcial Intelligence and Machine Learning)',
                max_participants=100,
                registration_deadline=base_date + timedelta(days=12),
                is_featured=True,
                image_url=generate_poster_url('Hackathon', 'CSE'),
                created_by=admin.id
            ),
            Event(
                title="IoT Innovation Challenge",
                description="Build innovative IoT solutions. Arduino, Raspberry Pi kits provided. "
                           "Smart home, Smart city, Industrial IoT themes. Expert judges. "
                           "Winner gets ₹30,000 + hardware kit.",
                category='Hackathon',
                date_time=base_date + timedelta(days=50),
                venue='ECE Department',
                organizer='Electronics and Communication Engineering',
                department='Electronics and Communication Engineering',
                max_participants=80,
                registration_deadline=base_date + timedelta(days=47),
                is_featured=True,
                image_url=generate_poster_url('Hackathon', 'ECE'),
                created_by=admin.id
            )
        ]
        
        # Combine all events
        all_events = (
            internship_events + 
            dance_events + 
            music_events + 
            hackathon_events
        )
        
        # Add to database
        for event in all_events:
            db.session.add(event)
        
        db.session.commit()
        
        print(f"\n✅ Added {len(all_events)} diverse events!")
        print("\n" + "="*60)
        print("📊 EVENTS BREAKDOWN:")
        print("="*60)
        print(f"🎓 Internships: {len(internship_events)} (one per department)")
        print(f"💃 Dance Events: {len(dance_events)}")
        print(f"🎵 Music Events: {len(music_events)}")
        print(f"💻 Hackathons: {len(hackathon_events)}")
        print(f"📝 Total: {len(all_events)} events")
        print("="*60)
        
        print("\n📋 EVENT DETAILS:")
        print("-"*60)
        for event in all_events:
            print(f"\n📅 {event.title}")
            print(f"   Category: {event.category}")
            print(f"   Organized by: {event.organizer}")
            print(f"   Department: {event.department}")
            print(f"   Date: {event.date_time.strftime('%B %d, %Y')}")
            print(f"   Venue: {event.venue}")
            print(f"   Featured: {'Yes ⭐' if event.is_featured else 'No'}")
            print(f"   Poster: {event.image_url[:50]}...")

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🎉 ADDING DIVERSE EVENTS")
    print("="*60 + "\n")
    add_diverse_events()
    print("\n" + "="*60)
    print("✅ SETUP COMPLETE!")
    print("="*60 + "\n")
