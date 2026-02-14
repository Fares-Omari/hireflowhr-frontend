import { useEffect, useState } from 'react';

function Applications({ userRole }) {
  const [applications, setApplications] = useState([]);

  const canViewApplications = userRole === 'ADMIN' || userRole === 'HR';

  const fetchApplications = () => {
    fetch('/applications', { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch applications');
        return res.json();
      })
      .then((data) => setApplications(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (canViewApplications) {
      fetchApplications();
    }
  }, [canViewApplications]);

  const handleUpdateStatus = (id, newStatus) => {
    fetch(`/applications/${id}/status?status=${newStatus}`, {
      method: 'PUT',
      credentials: 'include'
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to update status');
        return res.json();
      })
      .then(() => {
        alert('Application status updated!');
        fetchApplications();
      })
      .catch((err) => {
        console.error(err);
        alert('Failed to update status. Only ADMIN can update status.');
      });
  };

  if (!canViewApplications) {
    return (
      <div className="jobs-container">
        <div className="jobs-header">
          <h1>Access Denied</h1>
          <p>Only HR and ADMIN can view applications</p>
        </div>
      </div>
    );
  }

  return (
    <div className="jobs-container">
      <div className="jobs-header">
        <h1>Job Applications</h1>
        <p>Manage and review all applications</p>
      </div>

      <div className="applications-list">
        {applications.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'white', padding: '2rem' }}>
            <p>No applications yet</p>
          </div>
        ) : (
          applications.map((app) => (
            <div key={app.id} className="application-card">
              <div className="application-header">
                <h3>Application #{app.id}</h3>
                <span className={`job-status ${app.status.toLowerCase()}`}>
                  {app.status}
                </span>
              </div>
              
              <div className="application-details">
                <p><strong>Job:</strong> {app.job?.title || app.job?.name || 'N/A'}</p>
                <p><strong>Resume:</strong> <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer">View Resume</a></p>
                <p><strong>Cover Letter:</strong> {app.coverLetter}</p>
                <p><strong>Applied:</strong> {new Date(app.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}</p>
              </div>

              {userRole === 'ADMIN' && (
                <div className="application-actions">
                  <select 
                    value={app.status} 
                    onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                    className="status-select"
                  >
                    <option value="APPLIED">Applied</option>
                    <option value="REVIEWING">Reviewing</option>
                    <option value="INTERVIEW">Interview</option>
                    <option value="ACCEPTED">Accepted</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Applications;
