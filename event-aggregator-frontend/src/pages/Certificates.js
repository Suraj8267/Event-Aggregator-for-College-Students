import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/AdminDashboard.css';

const Certificates = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [filteredCertificates, setFilteredCertificates] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // 10 Enhanced certificates covering ALL specialization areas
  const dummyCertificates = [
    {
      id: 1,
      eventName: "National Hackathon 2024 - AI Innovation",
      category: "Hackathon",
      issueDate: "2024-11-15",
      description: "🏆 Winner of the 48-hour coding challenge focusing on AI-powered solutions for healthcare. Developed an ML model for early disease detection.",
      imageUrl: "https://images.unsplash.com/photo-1589395937658-0e8a56a02efd?w=600&h=400&fit=crop",
      achievement: "1st Place",
      skills: ["React", "Python", "TensorFlow", "Machine Learning"]
    },
    {
      id: 2,
      eventName: "Web Development Bootcamp",
      category: "Workshop",
      issueDate: "2024-10-20",
      description: "✅ Successfully completed intensive 3-day workshop on modern full-stack web development. Built and deployed a complete MERN stack application.",
      imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop",
      achievement: "Certified",
      skills: ["JavaScript", "Node.js", "React", "MongoDB"]
    },
    {
      id: 3,
      eventName: "Robotics Competition 2024 - Line Follower",
      category: "Robotics",
      issueDate: "2024-09-28",
      description: "🤖 Participated in autonomous robot design and programming challenge. Built a line-following robot using Arduino and custom sensors.",
      imageUrl: "https://images.unsplash.com/photo-1518314916381-77a37c2a49ae?w=600&h=400&fit=crop",
      achievement: "Participant",
      skills: ["Arduino", "C++", "Embedded Systems", "Sensors"]
    },
    {
      id: 4,
      eventName: "ML/AI Quiz Championship",
      category: "Quiz",
      issueDate: "2024-09-10",
      description: "🥈 Secured 2nd position in the inter-college AI and ML quiz competition covering machine learning algorithms, neural networks, and NLP.",
      imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
      achievement: "2nd Place",
      skills: ["Machine Learning", "Deep Learning", "NLP", "Computer Vision"]
    },
    {
      id: 5,
      eventName: "Cybersecurity Workshop",
      category: "Workshop",
      issueDate: "2024-08-15",
      description: "🔒 Advanced training on ethical hacking and network security fundamentals. Learned penetration testing and vulnerability assessment.",
      imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop",
      achievement: "Certified",
      skills: ["Penetration Testing", "Network Security", "Cryptography"]
    },
    {
      id: 6,
      eventName: "Code Sprint Challenge",
      category: "Competition",
      issueDate: "2024-07-22",
      description: "💻 Top performer in the 6-hour algorithmic problem-solving competition. Solved 15/20 problems including dynamic programming challenges.",
      imageUrl: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&h=400&fit=crop",
      achievement: "Top 10",
      skills: ["Algorithms", "Data Structures", "Problem Solving"]
    },
    {
      id: 7,
      eventName: "IoT Innovation Hackathon",
      category: "Hackathon",
      issueDate: "2024-06-30",
      description: "🏡 Developed smart home automation system using IoT devices. Integrated sensors, Raspberry Pi, and cloud services for remote control.",
      imageUrl: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=600&h=400&fit=crop",
      achievement: "3rd Place",
      skills: ["IoT", "Raspberry Pi", "Cloud Integration", "MQTT"]
    },
    {
      id: 8,
      eventName: "Technical Quiz Fest",
      category: "Quiz",
      issueDate: "2024-05-18",
      description: "🏆 Winner of the inter-departmental technical quiz competition covering programming languages, system design, and software engineering.",
      imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop",
      achievement: "Winner",
      skills: ["Programming", "System Design", "Software Engineering"]
    },
    {
      id: 9,
      eventName: "Robotics Workshop - Advanced Automation",
      category: "Robotics",
      issueDate: "2024-04-12",
      description: "🔧 Hands-on workshop on building automated robotic systems. Learned PID control, motor drivers, and sensor integration.",
      imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop",
      achievement: "Certified",
      skills: ["Robotics", "Automation", "PID Control", "Electronics"]
    },
    {
      id: 10,
      eventName: "Data Science Competition",
      category: "Competition",
      issueDate: "2024-03-25",
      description: "📊 Built predictive models for real-world datasets. Achieved 92% accuracy in customer churn prediction using ensemble methods.",
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      achievement: "Finalist",
      skills: ["Data Science", "Python", "Pandas", "Scikit-learn"]
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setCertificates(dummyCertificates);
      setFilteredCertificates(dummyCertificates);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    filterCertificates();
  }, [activeFilter, certificates]);

  const filterCertificates = () => {
    if (activeFilter === 'all') {
      setFilteredCertificates(certificates);
    } else {
      setFilteredCertificates(certificates.filter(cert => cert.category === activeFilter));
    }
  };

  const handleDownload = (certificate) => {
    alert(`Downloading certificate: ${certificate.eventName}`);
  };

  const handleShare = (certificate) => {
    alert(`Sharing certificate: ${certificate.eventName}`);
  };

  const categories = ['all', 'Hackathon', 'Workshop', 'Competition', 'Quiz', 'Robotics'];

  const getCategoryIcon = (category) => {
    const icons = {
      'Hackathon': '💻',
      'Workshop': '🎓',
      'Competition': '🏅',
      'Quiz': '🧠',
      'Robotics': '🤖'
    };
    return icons[category] || '📄';
  };

  if (loading) {
    return (
      <div className="certificates-container-enhanced">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="certificates-container-enhanced">
      <div className="certificates-header">
        <h1>🏆 My Certificates</h1>
        <p>Your achievements from Hackathons, Quizzes, Workshops, Robotics competitions and more</p>
      </div>

      <div className="certificate-filters">
        {categories.map(category => (
          <button
            key={category}
            className={`filter-chip ${activeFilter === category ? 'active' : ''}`}
            onClick={() => setActiveFilter(category)}
          >
            {category === 'all' ? '📚 All Certificates' : `${getCategoryIcon(category)} ${category}`}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '40px', flexWrap: 'wrap' }}>
        <div style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: 'white', padding: '20px 40px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: '800' }}>{certificates.length}</div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Total Certificates</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #10b981, #34d399)', color: 'white', padding: '20px 40px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: '800' }}>
            {certificates.filter(c => c.achievement.includes('1st') || c.achievement.includes('Winner')).length}
          </div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>First Prizes</div>
        </div>
      </div>

      {filteredCertificates.length > 0 ? (
        <div className="certificates-grid-enhanced">
          {filteredCertificates.map(certificate => (
            <div key={certificate.id} className="certificate-card-enhanced">
              <div className="certificate-ribbon">{certificate.achievement}</div>
              
              <div className="certificate-image-enhanced">
                <img src={certificate.imageUrl} alt={certificate.eventName} />
              </div>
              
              <div className="certificate-content-enhanced">
                <span className="certificate-category">{certificate.category}</span>
                <h3 className="certificate-title">{certificate.eventName}</h3>
                
                <div className="certificate-meta">
                  <span>
                    <i className="fas fa-calendar-alt"></i>
                    {new Date(certificate.issueDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                
                <p className="certificate-description-enhanced">{certificate.description}</p>
                
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {certificate.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      style={{
                        padding: '4px 10px',
                        background: '#e0e7ff',
                        color: '#4f46e5',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                
                <div className="certificate-actions-enhanced">
                  <button 
                    className="certificate-btn btn-download"
                    onClick={() => handleDownload(certificate)}
                  >
                    <i className="fas fa-download"></i> Download
                  </button>
                  <button 
                    className="certificate-btn btn-share"
                    onClick={() => handleShare(certificate)}
                  >
                    <i className="fas fa-share-alt"></i> Share
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <i className="fas fa-certificate empty-state-icon"></i>
          <h3>No certificates found in this category</h3>
          <p>Try selecting a different category or participate in more events!</p>
        </div>
      )}
    </div>
  );
};

export default Certificates;
