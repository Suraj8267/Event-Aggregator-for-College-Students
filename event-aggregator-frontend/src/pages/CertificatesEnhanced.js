import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/AdminDashboard.css';

const CertificatesEnhanced = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [filteredCertificates, setFilteredCertificates] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Enhanced dummy certificates data with different categories
  const dummyCertificates = [
    {
      id: 1,
      eventName: "National Hackathon 2024",
      category: "Hackathon",
      issueDate: "2024-11-15",
      description: "Winner of the 48-hour coding challenge focusing on AI-powered solutions",
      imageUrl: "https://images.unsplash.com/photo-1589395937658-0e8a56a02efd?w=600&h=400&fit=crop",
      achievement: "1st Place",
      skills: ["React", "Python", "Machine Learning"]
    },
    {
      id: 2,
      eventName: "Web Development Bootcamp",
      category: "Workshop",
      issueDate: "2024-10-20",
      description: "Completed intensive 3-day workshop on modern web development practices",
      imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop",
      achievement: "Certified",
      skills: ["JavaScript", "Node.js", "React"]
    },
    {
      id: 3,
      eventName: "Robotics Competition 2024",
      category: "Robotics",
      issueDate: "2024-09-28",
      description: "Participated in autonomous robot design and programming challenge",
      imageUrl: "https://images.unsplash.com/photo-1518314916381-77a37c2a49ae?w=600&h=400&fit=crop",
      achievement: "Participant",
      skills: ["Arduino", "C++", "Sensors"]
    },
    {
      id: 4,
      eventName: "ML/AI Quiz Championship",
      category: "Quiz",
      issueDate: "2024-09-10",
      description: "Secured 2nd position in the inter-college AI and ML quiz competition",
      imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
      achievement: "2nd Place",
      skills: ["Machine Learning", "Deep Learning", "NLP"]
    },
    {
      id: 5,
      eventName: "Cybersecurity Workshop",
      category: "Workshop",
      issueDate: "2024-08-15",
      description: "Advanced training on ethical hacking and network security fundamentals",
      imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop",
      achievement: "Certified",
      skills: ["Penetration Testing", "Network Security", "Cryptography"]
    },
    {
      id: 6,
      eventName: "Code Sprint Challenge",
      category: "Competition",
      issueDate: "2024-07-22",
      description: "Top performer in the 6-hour algorithmic problem-solving competition",
      imageUrl: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&h=400&fit=crop",
      achievement: "Top 10",
      skills: ["Algorithms", "Data Structures", "Problem Solving"]
    },
    {
      id: 7,
      eventName: "IoT Innovation Hackathon",
      category: "Hackathon",
      issueDate: "2024-06-30",
      description: "Developed smart home automation system using IoT devices",
      imageUrl: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=600&h=400&fit=crop",
      achievement: "3rd Place",
      skills: ["IoT", "Raspberry Pi", "Cloud Integration"]
    },
    {
      id: 8,
      eventName: "Technical Quiz Fest",
      category: "Quiz",
      issueDate: "2024-05-18",
      description: "Winner of the inter-departmental technical quiz competition",
      imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop",
      achievement: "Winner",
      skills: ["General Tech", "Programming", "System Design"]
    }
  ];

  useEffect(() => {
    // Simulate API call
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
      setFilteredCertificates(
        certificates.filter(cert => cert.category === activeFilter)
      );
    }
  };

  const handleDownload = (certificate) => {
    alert(`Downloading certificate: ${certificate.eventName}`);
    // In a real app, this would trigger a PDF download
  };

  const handleShare = (certificate) => {
    alert(`Sharing certificate: ${certificate.eventName}`);
    // In a real app, this would open share options
  };

  const categories = ['all', 'Hackathon', 'Workshop', 'Competition', 'Quiz', 'Robotics'];

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
      {/* Header */}
      <div className="certificates-header">
        <h1>🏆 My Certificates</h1>
        <p>Your achievements and certifications from various competitions and events</p>
      </div>

      {/* Filters */}
      <div className="certificate-filters">
        {categories.map(category => (
          <button
            key={category}
            className={`filter-chip ${activeFilter === category ? 'active' : ''}`}
            onClick={() => setActiveFilter(category)}
          >
            {category === 'all' ? 'All Certificates' : category}
          </button>
        ))}
      </div>

      {/* Certificates Grid */}
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
          <h3>No certificates found</h3>
          <p>Participate in events to earn certificates</p>
        </div>
      )}
    </div>
  );
};

export default CertificatesEnhanced;
