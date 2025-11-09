"""
Run this script to update admin password to 1234
"""
from main import app, db, User, bcrypt

def update_admin_password():
    with app.app_context():
        # Find admin user
        admin = User.query.filter_by(email='admin@college.edu').first()
        
        if admin:
            # Update password to 1234
            admin.password = bcrypt.generate_password_hash('1234').decode('utf-8')
            db.session.commit()
            print("✅ Admin password updated successfully!")
            print("📧 Email: admin@college.edu")
            print("🔑 Password: 1234")
        else:
            print("❌ Admin user not found. Please run main.py first.")

if __name__ == '__main__':
    update_admin_password()
