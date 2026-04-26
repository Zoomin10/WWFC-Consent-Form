import { useEffect, useState } from "react";
import "./Admin.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [filters, setFilters] = useState({ ageGroup: "", playerSex: "" });
const [selectedRegistration, setSelectedRegistration] = useState(null);

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
            <button className="player-link" onClick={() => setSelectedRegistration(r)}>
              {r.playerFirstName} {r.playerSurname}
            </button>
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
{selectedRegistration && (
  <div className="modal-backdrop" onClick={() => setSelectedRegistration(null)}>
    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h2>
          {selectedRegistration.playerFirstName} {selectedRegistration.playerSurname}
        </h2>
        <button className="modal-close" onClick={() => setSelectedRegistration(null)}>
          ×
        </button>
      </div>

      <div className="modal-grid">
        <Detail label="Age Group" value={String(selectedRegistration.ageGroup).toUpperCase()} />
        <Detail label="Gender" value={selectedRegistration.playerSex} />
        <Detail label="DOB" value={new Date(selectedRegistration.playerDob).toLocaleDateString("en-GB")} />
        <Detail label="Submitted" value={new Date(selectedRegistration.createdAt).toLocaleDateString("en-GB")} />

        <Detail label="Parent 1" value={selectedRegistration.emergencyContact1?.name} />
        <Detail label="Parent 1 Phone" value={selectedRegistration.emergencyContact1?.phoneNumber} />
        <Detail label="Parent 1 Email" value={selectedRegistration.emergencyContact1?.email} />
        <Detail label="Parent 1 Relationship" value={selectedRegistration.emergencyContact1?.relationship} />

        <Detail label="Parent 2" value={selectedRegistration.emergencyContact2?.name} />
        <Detail label="Parent 2 Phone" value={selectedRegistration.emergencyContact2?.phoneNumber} />
        <Detail label="Parent 2 Email" value={selectedRegistration.emergencyContact2?.email} />
        <Detail label="Parent 2 Relationship" value={selectedRegistration.emergencyContact2?.relationship} />

        <Detail label="Medical Info" value={selectedRegistration.medicalInfo} wide />
        <Detail label="Allergies" value={selectedRegistration.allergies} wide />

        <Detail label="Contact Consent" value={selectedRegistration.consentData ? "Yes" : "No"} />
        <Detail label="Photo Consent" value={selectedRegistration.consentPhotos ? "Yes" : "No"} />
        <Detail label="Video Consent" value={selectedRegistration.consentVideos ? "Yes" : "No"} />

        <Detail label="Signed By" value={selectedRegistration.parentName} />
        <Detail label="Signature Date" value={new Date(selectedRegistration.signatureDate).toLocaleDateString("en-GB")} />
      </div>
    </div>
  </div>
)}
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
function Detail({ label, value, wide }) {
  return (
    <div className={wide ? "detail detail-wide" : "detail"}>
      <span>{label}</span>
      <strong>{value || "—"}</strong>
    </div>
  );
}