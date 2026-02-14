import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Apply() {
  const location = useLocation();
  const navigate = useNavigate();
  const job = location.state?.job;

  const [formData, setFormData] = useState({
    resumeUrl: '',
    coverLetter: ''
  });

  if (!job) {
    return (
      <div className="apply-container">
        <div className="apply-card">
          <h2>No job selected</h2>
          <button className="btn-primary" onClick={() => navigate('/jobs')}>
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('/applications/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        job,
        status: 'APPLIED',
        resumeUrl: formData.resumeUrl,
        coverLetter: formData.coverLetter
      })
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to submit application');
        return res.json();
      })
      .then(() => {
        alert('Application submitted successfully!');
        navigate('/jobs');
      })
      .catch((err) => {
        console.error(err);
        alert('Failed to submit application');
      });
  };

  return (
    <div className="apply-container">
      <div className="apply-card">
        <h2>Apply for Position</h2>
        
        <div className="job-details">
          <h3>{job.name || job.title}</h3>
          <p>{job.details || job.description}</p>
          <span className={`job-status ${job.status.toLowerCase()}`}>
            {job.status}
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Resume URL</label>
            <input
              type="url"
              name="resumeUrl"
              value={formData.resumeUrl}
              onChange={handleChange}
              placeholder="https://example.com/your-resume.pdf"
              required
            />
          </div>
          <div className="form-group">
            <label>Cover Letter</label>
            <textarea
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleChange}
              placeholder="Tell us why you're a great fit for this position..."
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Submit Application
          </button>
          <button 
            type="button" 
            className="btn-primary" 
            onClick={() => navigate('/jobs')}
            style={{ marginTop: '1rem', background: '#6c757d' }}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default Apply;
