import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Jobs({ userRole }) {
  const [jobs, setJobs] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'OPEN'
  });
  const navigate = useNavigate();

  const canCreateJobs = userRole === 'ADMIN' || userRole === 'HR';

  const fetchJobs = () => {
    fetch('/jobs/all', { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch jobs');
        return res.json();
      })
      .then((data) => setJobs(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    fetch('/jobs/new', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
      credentials: 'include'
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to create job');
        return res.json();
      })
      .then(() => {
        alert('Job created successfully!');
        setFormData({ title: '', description: '', status: 'OPEN' });
        setShowCreateForm(false);
        fetchJobs();
      })
      .catch((err) => {
        console.error(err);
        alert('Failed to create job. You may not have permission.');
      });
  };

  const handleApply = (job) => {
    navigate('/apply', { state: { job } });
  };

  const handleDelete = (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;

    fetch(`/jobs/${jobId}/delete`, {
      method: 'DELETE',
      credentials: 'include'
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to delete job');
        alert('Job deleted successfully!');
        fetchJobs();
      })
      .catch((err) => {
        console.error(err);
        alert('Failed to delete job. Only ADMIN can delete jobs.');
      });
  };

  return (
    <div className="jobs-container">
      <div className="jobs-header">
        <h1>Find Your Dream Job</h1>
        <p>Explore opportunities and apply with ease</p>
        {userRole && (
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Logged in as: <strong>{userRole}</strong>
          </p>
        )}
      </div>

      <div className="jobs-grid">
        {jobs.map((job) => (
          <div key={job.id} className="job-card">
            <h3>{job.name || job.title}</h3>
            <span className={`job-status ${job.status.toLowerCase()}`}>
              {job.status}
            </span>
            <p>{job.details || job.description}</p>
            <div className="job-date">
              Posted: {new Date(job.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </div>
            
            {userRole === 'USER' && (
              <button 
                className="btn-apply" 
                onClick={() => handleApply(job)}
                disabled={job.status === 'CLOSED'}
              >
                {job.status === 'CLOSED' ? 'Position Closed' : 'Apply Now'}
              </button>
            )}

            {userRole === 'ADMIN' && (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button 
                  className="btn-apply" 
                  onClick={() => handleDelete(job.id)}
                  style={{ background: '#ff4757' }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {canCreateJobs && !showCreateForm && (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button 
            className="btn-primary" 
            onClick={() => setShowCreateForm(true)}
            style={{ maxWidth: '300px' }}
          >
            Post a New Job
          </button>
        </div>
      )}

      {canCreateJobs && showCreateForm && (
        <div className="create-job-section">
          <h2>Post a New Job</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Job Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Senior Software Engineer"
                required
              />
            </div>
            <div className="form-group">
              <label>Job Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the role, requirements, and responsibilities..."
                required
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="OPEN">Open</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
            <button type="submit" className="btn-primary">
              Create Job
            </button>
            <button 
              type="button" 
              className="btn-primary" 
              onClick={() => setShowCreateForm(false)}
              style={{ marginTop: '1rem', background: '#6c757d' }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Jobs;
