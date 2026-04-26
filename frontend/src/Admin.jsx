import { useEffect, useState } from "react";
import "./Admin.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [filters, setFilters] = useState({ ageGroup: "", playerSex: "" });

  async function loadDashboard() {
    const res = await fetch(`${API_URL}/api/admin/dashboard`);
    const data = await res.json();
    setStats(data);
  }

  async function loadRegistrations() {
    const params = new URLSearchParams();

    if (filters.ageGroup) params.append("ageGroup", filters.ageGroup);
    if (filters.playerSex) params.append("playerSex", filters.playerSex);

    const res = await fetch(`${API_URL}/api/admin/registrations?${params}`);
    const data = await res.json();
    setRegistrations(data);
  }

  async function deleteRegistration(id) {
    const ok = window.confirm("Delete this registration?");
    if (!ok) return;

    await fetch(`${API_URL}/api/admin/registrations/${id}`, {
      method: "DELETE",
    });

    loadDashboard();
    loadRegistrations();
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    loadRegistrations();
  }, [filters]);

  return (
    <main className="admin-page">
      <section className="admin-card">
        <h1>WWFC Admin Dashboard</h1>

        {stats && (
          <div className="stats-grid">
            <Stat title="Total registrations" value={stats.total} />
            <Stat title="Boys" value={stats.boys} />
            <Stat title="Girls" value={stats.girls} />
            <Stat title="Development Age Groups" value={stats.development} />
            <Stat title="Competitive Age Groups" value={stats.competitive} />
            <Stat title="Adult Players" value={stats.adult} />
          </div>
        )}

        <div className="admin-actions">
          <select
            value={filters.ageGroup}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, ageGroup: e.target.value }))
            }
          >
            <option value="">Filter by Age Group</option>
            {["u7", "u8", "u9", "u10", "u11", "u12", "u13", "u14", "u15", "u16", "u17", "u18"].map((age) => (
              <option key={age} value={age}>{age.toUpperCase()}</option>
            ))}
          </select>

          <select
            value={filters.playerSex}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, playerSex: e.target.value }))
            }
          >
            <option value="">Filter by Gender</option>
            <option value="Male">Boys</option>
            <option value="Female">Girls</option>
          </select>

          <a className="download-btn" href={`${API_URL}/api/admin/registrations.csv`}>
            Download CSV
          </a>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Player</th>
                <th>Age Group</th>
                <th>Sex</th>
                <th>DOB</th>
                <th>Parent</th>
                <th>Email</th>
                <th>Submitted</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((r) => (
                <tr key={r.id}>
                  <td>{r.playerFirstName} {r.playerSurname}</td>
                  <td>{String(r.ageGroup).toUpperCase()}</td>
                  <td>{r.playerSex}</td>
                  <td>{new Date(r.playerDob).toLocaleDateString()}</td>
                  <td>{r.parentName}</td>
                  <td>{r.email}</td>
                  <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="delete-btn" onClick={() => deleteRegistration(r.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {registrations.length === 0 && (
                <tr>
                  <td colSpan="8">No registrations found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}


function Stat({ title, value }) {
  return (
    <div className="stat">
      <span>{title}</span>
      <strong>{value}</strong>
    </div>
  );
}