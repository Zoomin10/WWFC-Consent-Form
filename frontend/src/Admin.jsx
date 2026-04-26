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
        <h1>WWFC Player Registrations Dashboard</h1>

        {stats && (
          <div className="stats-grid">
            <Stat title="Total registrations" value={stats.total} />
            <Stat title="Male" value={stats.boys} />
            <Stat title="Female" value={stats.girls} />
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
        <th>Gender</th>
        <th>DOB</th>
        <th>Parent 1</th>
        <th>Parent 2</th>
        <th>Submitted</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {registrations.map((r) => (
        <tr key={r.id}>
          <td>
            <span className="player-cell">
              {r.playerFirstName} {r.playerSurname}

              <div className="registration-popover">
                <h3>{r.playerFirstName} {r.playerSurname}</h3>

                <p><strong>Age Group:</strong> {String(r.ageGroup).toUpperCase()}</p>
                <p><strong>Gender:</strong> {r.playerSex}</p>
                <p><strong>DOB:</strong> {new Date(r.playerDob).toLocaleDateString("en-GB")}</p>

                <hr />

                <p><strong>Parent 1:</strong> {r.emergencyContact1?.name || ""}</p>
                <p><strong>Phone:</strong> {r.emergencyContact1?.phoneNumber || ""}</p>
                <p><strong>Email:</strong> {r.emergencyContact1?.email || ""}</p>
                <p><strong>Relationship:</strong> {r.emergencyContact1?.relationship || ""}</p>

                <hr />

                <p><strong>Parent 2:</strong> {r.emergencyContact2?.name || ""}</p>
                <p><strong>Phone:</strong> {r.emergencyContact2?.phoneNumber || ""}</p>
                <p><strong>Email:</strong> {r.emergencyContact2?.email || ""}</p>
                <p><strong>Relationship:</strong> {r.emergencyContact2?.relationship || ""}</p>

                <hr />

                <p><strong>Medical Info:</strong> {r.medicalInfo || ""}</p>
                <p><strong>Allergies:</strong> {r.allergies || ""}</p>

                <hr />

                <p><strong>Contact Consent:</strong> {r.consentData ? "Yes" : "No"}</p>
                <p><strong>Photo Consent:</strong> {r.consentPhotos ? "Yes" : "No"}</p>
                <p><strong>Video Consent:</strong> {r.consentVideos ? "Yes" : "No"}</p>

                <hr />

                <p><strong>Signed By:</strong> {r.parentName}</p>
                <p><strong>Signature Date:</strong> {new Date(r.signatureDate).toLocaleDateString("en-GB")}</p>
              </div>
            </span>
          </td>

          <td>{String(r.ageGroup).toUpperCase()}</td>
          <td>{r.playerSex}</td>
          <td>{new Date(r.playerDob).toLocaleDateString("en-GB")}</td>
          <td>{r.emergencyContact1?.name || ""}</td>
          <td>{r.emergencyContact2?.name || ""}</td>
          <td>{new Date(r.createdAt).toLocaleDateString("en-GB")}</td>

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