import { useEffect, useState } from "react";

function App() {
  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [user, setUser] = useState(null);
  const createJob = () => {
    fetch("/jobs/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, status }),
      credentials: "include" // session
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to create job");
        return res.json();
      })
      .then((data) => {
        console.log("Job created:", data);
        alert("Job created successfully!");
        setTitle("");
        setDescription("");
        setStatus("");
        fetchJobs();
      })
      .catch((err) => console.error(err));
  };

  // دالة لجلب الوظائف
  const fetchJobs = () => {
    fetch("/jobs/all", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch jobs");
        return res.json();
      })
      .then((data) => setJobs(data))
      .catch((err) => console.error(err));
  };

  // جلب الوظائف عند تحميل الصفحة
  useEffect(() => {
    fetchJobs();
  }, []);

  // دالة لتقديم طلب وظيفة
  const applyForJob = (job) => {
    fetch("/applications/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        job,
        status: "APPLIED",
        resumeUrl: "https://example.com/resume.pdf",
        coverLetter: "I am very interested"
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to submit application");
        return res.json();
      })
      .then((data) => {
        console.log("Application submitted:", data);
        alert("Application submitted successfully!");
        setUser("");
        fetchJobs();
      })
      .catch((err) => console.error(err));
  };

  return (
    <div>
      {/* قائمة الوظائف */}
      <h1>Job Listings</h1>
      <ul>
        {jobs.map((job) => (
          <li key={job.id}>
            {job.name || job.title}
             - {job.details || job.description}
              - {job.status} 
              - Created At: {new Date(job.createdAt).toLocaleDateString(undefined, {
                weekday: "short",   // Thu
                year: "numeric",
                month: "short",     // Feb
                day: "numeric"
              })}
              , {new Date(job.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              })}
            <button onClick={() => applyForJob(job, user)}>Apply</button>
          </li>
        ))}
      </ul>
      {/* نموذج إضافة وظيفة جديدة */}
      <h1>Create a New Job</h1>
      <div>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label>Status:</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="OPEN">Open</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>
      <div>
        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <button onClick={createJob}>Add Job</button>
    </div>
  );
}

export default App;
