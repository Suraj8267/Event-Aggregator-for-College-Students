import React, { useState, useEffect } from 'react';
import { eventAPI, utilAPI } from '../services/api';
import EventCard from '../components/EventCard';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filters, setFilters] = useState({
    category: 'all',
    department: 'all',
    search: '',
    upcoming: true
  });
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [filters, pagination.page]);

  const fetchInitialData = async () => {
    try {
      const [categoriesRes, departmentsRes] = await Promise.all([
        utilAPI.getCategories(),
        utilAPI.getDepartments()
      ]);
      setCategories(categoriesRes.data.categories);
      setDepartments(departmentsRes.data.departments);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      };
      
      // Remove 'all' values from filters
      Object.keys(params).forEach(key => {
        if (params[key] === 'all') {
          delete params[key];
        }
      });

      const response = await eventAPI.getAll(params);
      setEvents(response.data.events);
      setFilteredEvents(response.data.events);
      setPagination(prev => ({
        ...prev,
        ...response.data.pagination
      }));
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSearch = (e) => {
    handleFilterChange('search', e.target.value);
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      department: 'all',
      search: '',
      upcoming: true
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="events-page">
      <div className="container">
        <div className="page-header">
          <h1>All Events</h1>
          <p>Discover and register for exciting college events</p>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search events..."
              value={filters.search}
              onChange={handleSearch}
            />
          </div>

          <div className="filter-grid">
            <div className="filter-group">
              <label>Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Department</label>
              <select
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>
                <input
                  type="checkbox"
                  checked={filters.upcoming}
                  onChange={(e) => handleFilterChange('upcoming', e.target.checked)}
                />
                Upcoming Only
              </label>
            </div>

            <button className="btn btn-secondary" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="loading">Loading events...</div>
        ) : filteredEvents.length > 0 ? (
          <>
            <div className="events-grid">
              {filteredEvents.map(event => (
                <EventCard 
                  key={event.id} 
                  event={event}
                  onUpdate={fetchEvents}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="pagination">
                <button
                  className="btn btn-secondary"
                  disabled={pagination.page === 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  Previous
                </button>
                
                <span className="page-info">
                  Page {pagination.page} of {pagination.pages}
                </span>
                
                <button
                  className="btn btn-secondary"
                  disabled={pagination.page === pagination.pages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="no-events">
            <i className="fas fa-calendar-times"></i>
            <h3>No events found</h3>
            <p>Try adjusting your filters or search terms</p>
            <button className="btn btn-primary" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;