"""
Admin Routes for Event Aggregator
Additional routes for admin functionality - to be integrated into main.py
"""

# Add these routes to main.py after the certificate routes

"""
# Admin Routes
@app.route('/admin/events/<int:event_id>/attendance', methods=['GET'])
@token_required
@admin_required
def get_event_attendance(current_user, event_id):
    try:
        event = Event.query.get_or_404(event_id)
        registrations = EventRegistration.query.filter_by(event_id=event_id).all()
        
        attendance_data = []
        for reg in registrations:
            attendance_data.append({
                'id': reg.id,
                'user_id': reg.user_id,
                'username': reg.user.username,
                'email': reg.user.email,
                'department': reg.user.department,
                'attended': reg.attended,
                'registration_date': reg.registration_date.isoformat()
            })
        
        return jsonify({
            'event': {
                'id': event.id,
                'title': event.title,
                'date_time': event.date_time.isoformat()
            },
            'attendance': attendance_data
        })
        
    except Exception as e:
        app.logger.error(f'Get attendance error: {str(e)}')
        return jsonify({'message': 'Internal server error'}), 500

@app.route('/admin/events/<int:event_id>/attendance', methods=['PUT'])
@token_required
@admin_required
def update_event_attendance(current_user, event_id):
    try:
        data = request.get_json()
        attendance_updates = data.get('attendance', [])
        
        for update in attendance_updates:
            registration = EventRegistration.query.filter_by(
                event_id=event_id,
                user_id=update['user_id']
            ).first()
            
            if registration:
                registration.attended = update['attended']
        
        db.session.commit()
        
        app.logger.info(f'Attendance updated for event {event_id} by admin {current_user.username}')
        
        return jsonify({'message': 'Attendance updated successfully!'})
        
    except Exception as e:
        app.logger.error(f'Update attendance error: {str(e)}')
        return jsonify({'message': 'Internal server error'}), 500

@app.route('/admin/events/<int:event_id>/registrations', methods=['GET'])
@token_required
@admin_required
def get_event_registrations(current_user, event_id):
    try:
        registrations = EventRegistration.query.filter_by(event_id=event_id).all()
        
        registrations_data = []
        for reg in registrations:
            registrations_data.append({
                'id': reg.id,
                'user': {
                    'id': reg.user.id,
                    'username': reg.user.username,
                    'email': reg.user.email,
                    'department': reg.user.department
                },
                'registration_date': reg.registration_date.isoformat(),
                'status': reg.status,
                'attended': reg.attended
            })
        
        return jsonify({'registrations': registrations_data})
        
    except Exception as e:
        app.logger.error(f'Get registrations error: {str(e)}')
        return jsonify({'message': 'Internal server error'}), 500

@app.route('/admin/users', methods=['GET'])
@token_required
@admin_required
def get_all_users(current_user):
    try:
        users = User.query.all()
        
        users_data = []
        for user in users:
            users_data.append({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'department': user.department,
                'year': user.year,
                'is_organizer': user.is_organizer,
                'is_admin': user.is_admin,
                'created_at': user.created_at.isoformat(),
                'events_created': len(user.events_created),
                'events_registered': len(user.registrations)
            })
        
        return jsonify({'users': users_data})
        
    except Exception as e:
        app.logger.error(f'Get users error: {str(e)}')
        return jsonify({'message': 'Internal server error'}), 500
"""
