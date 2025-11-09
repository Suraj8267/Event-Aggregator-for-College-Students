# ============================================
# REPLACE initialize_database() FUNCTION IN main.py
# ============================================
# Find the initialize_database() function (around line 162-184)
# Replace it with this version that includes dummy events

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
        
        # Create dummy events if none exist
        event_count = Event.query.count()
        if event_count == 0:
            print("Creating dummy events...")
            
            dummy_events = [
                Event(
                    title='AI/ML Hackathon 2024',
                    description='Build innovative AI-powered solutions in 48 hours. Teams will compete to create the most impactful machine learning application. Prizes worth $10,000!',
                    category='Hackathon',
                    department='Computer Science and Engineering',
                    venue='Tech Hub, Building A',
                    date_time=datetime.utcnow() + timedelta(days=15),
                    end_time=datetime.utcnow() + timedelta(days=17),
                    max_participants=100,
                    current_participants=45,
                    image_url='https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
                    contact_email='hackathon@college.edu',
                    contact_phone='+1-555-0101',
                    is_featured=True,
                    registration_deadline=datetime.utcnow() + timedelta(days=10),
                    created_by=admin.id
                ),
                Event(
                    title='TechQuiz Championship 2024',
                    description='Inter-college technical quiz competition covering programming, algorithms, system design, and emerging technologies. Cash prizes for winners!',
                    category='Competition',
                    department='All Departments',
                    venue='Main Auditorium',
                    date_time=datetime.utcnow() + timedelta(days=10),
                    end_time=datetime.utcnow() + timedelta(days=10, hours=3),
                    max_participants=200,
                    current_participants=87,
                    image_url='https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
                    contact_email='quiz@college.edu',
                    contact_phone='+1-555-0102',
                    is_featured=True,
                    registration_deadline=datetime.utcnow() + timedelta(days=7),
                    created_by=admin.id
                ),
                Event(
                    title='Robotics Competition 2024',
                    description='Design and build autonomous robots. Compete in line following, maze solving, and object manipulation challenges.',
                    category='Competition',
                    department='Mechanical Engineering',
                    venue='Robotics Lab, Building C',
                    date_time=datetime.utcnow() + timedelta(days=20),
                    end_time=datetime.utcnow() + timedelta(days=22),
                    max_participants=50,
                    current_participants=23,
                    image_url='https://images.unsplash.com/photo-1518314916381-77a37c2a49ae?w=800',
                    contact_email='robotics@college.edu',
                    contact_phone='+1-555-0103',
                    is_featured=False,
                    registration_deadline=datetime.utcnow() + timedelta(days=15),
                    created_by=admin.id
                ),
                Event(
                    title='Cybersecurity Workshop',
                    description='Learn ethical hacking fundamentals, network security, and penetration testing techniques from industry experts.',
                    category='Workshop',
                    department='Computer Science and Engineering',
                    venue='Lab 301',
                    date_time=datetime.utcnow() + timedelta(days=8),
                    end_time=datetime.utcnow() + timedelta(days=8, hours=4),
                    max_participants=60,
                    current_participants=41,
                    image_url='https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800',
                    contact_email='security@college.edu',
                    contact_phone='+1-555-0104',
                    is_featured=True,
                    registration_deadline=datetime.utcnow() + timedelta(days=5),
                    created_by=admin.id
                ),
                Event(
                    title='Web Development Bootcamp',
                    description='Intensive 3-day workshop on modern web development. Learn React, Node.js, MongoDB, and deploy your first full-stack application.',
                    category='Workshop',
                    department='Computer Science and Engineering',
                    venue='Innovation Lab 101',
                    date_time=datetime.utcnow() + timedelta(days=25),
                    end_time=datetime.utcnow() + timedelta(days=27),
                    max_participants=80,
                    current_participants=56,
                    image_url='https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
                    contact_email='webdev@college.edu',
                    contact_phone='+1-555-0105',
                    is_featured=True,
                    registration_deadline=datetime.utcnow() + timedelta(days=20),
                    created_by=admin.id
                ),
                Event(
                    title='Code Sprint Challenge',
                    description='6-hour competitive programming event. Solve algorithmic problems and compete for prizes. All skill levels welcome!',
                    category='Competition',
                    department='Computer Science and Engineering',
                    venue='Computer Lab A',
                    date_time=datetime.utcnow() + timedelta(days=12),
                    end_time=datetime.utcnow() + timedelta(days=12, hours=6),
                    max_participants=150,
                    current_participants=92,
                    image_url='https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800',
                    contact_email='codesprint@college.edu',
                    contact_phone='+1-555-0106',
                    is_featured=False,
                    registration_deadline=datetime.utcnow() + timedelta(days=9),
                    created_by=admin.id
                ),
                Event(
                    title='IoT Innovation Hackathon',
                    description='Build smart IoT solutions using Raspberry Pi and Arduino. Focus on sustainability and practical real-world applications.',
                    category='Hackathon',
                    department='Electronics and Communication Engineering',
                    venue='IoT Lab, Building B',
                    date_time=datetime.utcnow() + timedelta(days=30),
                    end_time=datetime.utcnow() + timedelta(days=32),
                    max_participants=60,
                    current_participants=28,
                    image_url='https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800',
                    contact_email='iot@college.edu',
                    contact_phone='+1-555-0107',
                    is_featured=False,
                    registration_deadline=datetime.utcnow() + timedelta(days=25),
                    created_by=admin.id
                ),
                Event(
                    title='Mobile App Development Seminar',
                    description='Learn iOS and Android development. Build cross-platform apps using React Native and Flutter with hands-on projects.',
                    category='Seminar',
                    department='Computer Science and Engineering',
                    venue='Seminar Hall 2',
                    date_time=datetime.utcnow() + timedelta(days=18),
                    end_time=datetime.utcnow() + timedelta(days=18, hours=5),
                    max_participants=100,
                    current_participants=67,
                    image_url='https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
                    contact_email='mobile@college.edu',
                    contact_phone='+1-555-0108',
                    is_featured=True,
                    registration_deadline=datetime.utcnow() + timedelta(days=14),
                    created_by=admin.id
                )
            ]
            
            for event in dummy_events:
                db.session.add(event)
            
            db.session.commit()
            print(f"Created {len(dummy_events)} dummy events successfully!")
        
        print("Database initialized successfully!")
