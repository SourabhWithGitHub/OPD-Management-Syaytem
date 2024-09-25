const { useState, useEffect } = React;

// Mock API Service
const allData = {
  doctors: [
    { 
      id: 1, 
      name: "Dr. LOKESH KARMAKAR", 
      specialty: "Cardiology", 
      subSpecialty: "Interventional Cardiology",
      availability: [
        { day: "Monday", slots: ["09:00 AM - 12:00 PM", "02:00 PM - 05:00 PM"] },
        { day: "Wednesday", slots: ["10:00 AM - 01:00 PM", "03:00 PM - 06:00 PM"] },
        { day: "Friday", slots: ["08:00 AM - 11:00 AM", "01:00 PM - 04:00 PM"] }
      ]
    },
    { 
      id: 2, 
      name: "Dr. ISHITA DAS GUPTA", 
      specialty: "Pediatrics", 
      subSpecialty: "Neonatology",
      availability: [
        { day: "Tuesday", slots: ["09:00 AM - 01:00 PM"] },
        { day: "Thursday", slots: ["02:00 PM - 06:00 PM"] },
        { day: "Saturday", slots: ["10:00 AM - 02:00 PM"] }
      ]
    },
    { 
      id: 3, 
      name: "Dr. RAHUL SINGH", 
      specialty: "Orthopedics", 
      subSpecialty: "Sports Medicine",
      availability: [
        { day: "Monday", slots: ["08:00 AM - 12:00 PM"] },
        { day: "Tuesday", slots: ["01:00 PM - 05:00 PM"] },
        { day: "Friday", slots: ["09:00 AM - 01:00 PM", "02:00 PM - 04:00 PM"] }
      ]
    },
  ],
  beds: {
    total: 200,
    wards: [
      { type: "General Ward", total: 100, occupied: 80, available: 20 },
      { type: "Semi-Private", total: 50, occupied: 35, available: 15 },
      { type: "Private", total: 30, occupied: 20, available: 10 },
      { type: "ICU", total: 20, occupied: 15, available: 5 },
    ]
  },
  patients: [],
  getDoctors: () => Promise.resolve(allData.doctors),
  getBeds: () => Promise.resolve(allData.beds),
  admitPatient: (patient) => {
    allData.patients.push(patient);
    const generalWard = allData.beds.wards.find(ward => ward.type === "General Ward");
    if (generalWard && generalWard.available > 0) {
      generalWard.occupied++;
      generalWard.available--;
    }
    return Promise.resolve({ success: true, message: "Appoinment booked successfully" });
  }
};

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="toast">
      {message}
    </div>
  );
};

const DoctorAvailability = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    allData.getDoctors().then(setDoctors);
  }, []);

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Doctor Availability</h2>
      </div>
      <div className="card-content">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Specialty</th>
              <th>Sub-Specialty</th>
              <th>Availability</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor.id}>
                <td>{doctor.name}</td>
                <td>{doctor.specialty}</td>
                <td>{doctor.subSpecialty}</td>
                <td>
                  {doctor.availability.map((avail, index) => (
                    <div key={index}>
                      <strong>{avail.day}:</strong>
                      <ul>
                        {avail.slots.map((slot, slotIndex) => (
                          <li key={slotIndex}>{slot}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const BedAvailability = () => {
  const [beds, setBeds] = useState({ total: 0, wards: [] });

  useEffect(() => {
    allData.getBeds().then(setBeds);
  }, []);

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Bed Availability</h2>
      </div>
      <div className="card-content">
        <div>
          <span>Total Beds: {beds.total}</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Ward Type</th>
              <th>Total Beds</th>
              <th>Occupied</th>
              <th>Available</th>
            </tr>
          </thead>
          <tbody>
            {beds.wards.map((ward, index) => (
              <tr key={index}>
                <td>{ward.type}</td>
                <td>{ward.total}</td>
                <td>
                  <span className="badge badge-secondary">{ward.occupied}</span>
                </td>
                <td>
                  <span className={`badge badge-outline ${ward.available > 0 ? "bg-green-100" : "bg-red-100"}`}>
                    {ward.available}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const B = ({ onAdmit }) => {
  const [patientData, setPatientData] = useState({
    name: "",
    age: "",
    gender: "",
    reason: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatientData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    allData.admitPatient(patientData)
      .then(response => {
        if (response.success) {
          onAdmit(response.message);
          setPatientData({ name: "", age: "", gender: "", reason: "" });
        }
      });
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Book Appointment</h2>
      </div>
      <div className="card-content">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Patient Name</label>
            <input
              id="name"
              name="name"
              value={patientData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="age">Age</label>
            <input
              id="age"
              name="age"
              type="number"
              value={patientData.age}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              value={patientData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="reason">Reason for appointment</label>
            <input
              id="reason"
              name="reason"
              value={patientData.reason}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Book Appointment</button>
        </form>
      </div>
    </div>
  );
};

const HospitalManagementSystem = () => {
  const [activeTab, setActiveTab] = useState("doctors");
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (message) => {
    setToastMessage(message);
  };

  return (
    <div className="container">
      <h1>Hospital OPD Management System</h1>
      <div className="tabs">
        <div
          className={`tab ${activeTab === "doctors" ? "active" : ""}`}
          onClick={() => setActiveTab("doctors")}
        >
          Doctor Availability
        </div>
        <div
          className={`tab ${activeTab === "beds" ? "active" : ""}`}
          onClick={() => setActiveTab("beds")}
        >
          Bed Availability
        </div>
        <div
          className={`tab ${activeTab === "admission" ? "active" : ""}`}
          onClick={() => setActiveTab("admission")}
        >
          Book Appointment
        </div>
      </div>
      <div className={`tab-content ${activeTab === "doctors" ? "active" : ""}`}>
        <DoctorAvailability />
      </div>
      <div className={`tab-content ${activeTab === "beds" ? "active" : ""}`}>
        <BedAvailability />
      </div>
      <div className={`tab-content ${activeTab === "admission" ? "active" : ""}`}>
        <B onAdmit={showToast} />
      </div>
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage("")} />}
    </div>
  );
};

ReactDOM.render(<HospitalManagementSystem />, document.getElementById('root'));