import { useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;

const initialForm = {
  ageGroup: "u7",
  playerFirstName: "",
  playerSurname: "",
  playerDob: "",
  playerSex: "Male",

  emergencyContact1: {
    name: "",
    dob: "",
    phoneNumber: "",
    postcode: "",
    houseNumber: "",
    email: "",
    relationship: "",
  },

  emergencyContact2: {
    name: "",
    dob: "",
    phoneNumber: "",
    postcode: "",
    houseNumber: "",
    email: "",
    relationship: "",
  },

  postcode: "",
  houseNumber: "",
  email: "",
  medicalInfo: "",
  allergies: "",

  consentData: "",
  consentPhotos: "",
  consentVideos: "",

  parentSignature: "",
  parentName: "",
  signatureDate: "",
};

function App() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("");

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function updateContact(contactKey, field, value) {
    setForm((prev) => ({
      ...prev,
      [contactKey]: {
        ...prev[contactKey],
        [field]: value,
      },
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("Submitting...");

    const payload = {
      ...form,
      consentData: form.consentData === "Yes",
      consentPhotos: form.consentPhotos === "Yes",
      consentVideos: form.consentVideos === "Yes",
    };

    try {
      const res = await fetch(`${API_URL}/api/consent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Submit failed");

      setStatus("Consent form submitted successfully.");
      setForm(initialForm);
    } catch (err) {
      console.error(err);
      setStatus("Sorry, something went wrong submitting the form.");
    }
  }

  return (
    <main className="page">
      <section className="card">
        <img src="/wwfc-letter-head.png" alt="Wroughton & Wichelstowe Football Club" className="logo" />

        <h1>Player Digital Consent Form</h1>
        <p className="intro">
          Please complete this form for Wroughton & Wichelstowe Football Club.
        </p>

        <form onSubmit={handleSubmit}>
          <h2>Player Details</h2>

          <div className="grid">
            <label>
              Age Group
              <select value={form.ageGroup} onChange={(e) => updateField("ageGroup", e.target.value)}>
                {["u7","u8","u9","u10","u11","u12","u13","u14","u15","u16","u17","u18"].map((age) => (
                  <option key={age} value={age}>{age.toUpperCase()}</option>
                ))}
              </select>
            </label>

            <label>
              Sex
              <select value={form.playerSex} onChange={(e) => updateField("playerSex", e.target.value)}>
                <option>Male</option>
                <option>Female</option>
              </select>
            </label>

            <label>
              First Name
              <input required value={form.playerFirstName} onChange={(e) => updateField("playerFirstName", e.target.value)} />
            </label>

            <label>
              Surname
              <input required value={form.playerSurname} onChange={(e) => updateField("playerSurname", e.target.value)} />
            </label>

            <label>
              Date of Birth
              <input required type="date" value={form.playerDob} onChange={(e) => updateField("playerDob", e.target.value)} />
            </label>
          </div>

          <ContactSection title="Emergency Contact 1" data={form.emergencyContact1} onChange={(field, value) => updateContact("emergencyContact1", field, value)} />
          <ContactSection title="Emergency Contact 2" data={form.emergencyContact2} onChange={(field, value) => updateContact("emergencyContact2", field, value)} />

          <h2>Medical Information</h2>

          <label>
            Important Medical Information, including medication and times to be administered
            <textarea required value={form.medicalInfo} onChange={(e) => updateField("medicalInfo", e.target.value)} />
          </label>

          <label>
            Allergies, including food intolerances
            <textarea value={form.allergies} onChange={(e) => updateField("allergies", e.target.value)} />
          </label>

          <h2>Permissions</h2>

          <YesNo label="I give permission for these details to be kept by Wroughton & Wichelstowe FC for contact purposes." value={form.consentData} onChange={(v) => updateField("consentData", v)} />
          <YesNo label="I give permission for photographs to be taken and used by Wroughton & Wichelstowe FC." value={form.consentPhotos} onChange={(v) => updateField("consentPhotos", v)} />
          <YesNo label="I give permission for videos to be taken and used by Wroughton & Wichelstowe FC." value={form.consentVideos} onChange={(v) => updateField("consentVideos", v)} />

          <p className="disclaimer">
            Wroughton & Wichelstowe FC adhere to the England FA guidelines for use of photos and videos, safeguarding and social media.
          </p>

          <h2>Parent / Carer Signature</h2>

          <div className="grid">
            <label>
              Signature
              <input required value={form.parentSignature} onChange={(e) => updateField("parentSignature", e.target.value)} />
            </label>

            <label>
              Printed Name
              <input required value={form.parentName} onChange={(e) => updateField("parentName", e.target.value)} />
            </label>

            <label>
              Date of Signature
              <input required type="date" value={form.signatureDate} onChange={(e) => updateField("signatureDate", e.target.value)} />
            </label>
          </div>

          <button type="submit">Submit Consent Form</button>

          {status && <p className="status">{status}</p>}
        </form>
      </section>
    </main>
  );
}

function ContactSection({ title, data, onChange }) {
  return (
    <>
      <h2>{title}</h2>
      <div className="grid">
        {[
          ["name", "Name"],
          ["dob", "Date of Birth"],
          ["phoneNumber", "Phone Number"],
          ["postcode", "Post Code"],
          ["houseNumber", "House Number"],
          ["email", "Email Address"],
          ["relationship", "Relationship to Player"],
        ].map(([field, label]) => (
          <label key={field}>
            {label}
            <input
              required
              type={field === "dob" ? "date" : field === "email" ? "email" : "text"}
              value={data[field]}
              onChange={(e) => onChange(field, e.target.value)}
            />
          </label>
        ))}
      </div>
    </>
  );
}

function YesNo({ label, value, onChange }) {
  return (
    <label>
      {label}
      <select required value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Select...</option>
        <option>Yes</option>
        <option>No</option>
      </select>
    </label>
  );
}

export default App;