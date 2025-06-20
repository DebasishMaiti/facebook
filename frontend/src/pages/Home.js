import { v4 as uuidv4 } from 'uuid'; // Install: npm install uuid
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const Lid = localStorage.getItem("userId");
  const id = JSON.parse(Lid);
  const [value, setValue] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dataSendtoApi = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const requestId = uuidv4(); // Unique ID for this request
    console.log(`Sending API request [${requestId}]:`, { prompt: value, scheduledTime, userId: id });
    try {
       await axios.post(`https://facebook-seven-cyan.vercel.app/api/schedule-ai-post`, {
        prompt: value,
        scheduledTime,
        userId: id,
        requestId // Send requestId to backend
      });
      alert("✅ Post scheduled successfully!");
    } catch (error) {
      console.error(`❌ API error [${requestId}]:`, error);
      alert("Failed to schedule post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const logout = async () => {
    await axios.delete(`https://facebook-seven-cyan.vercel.app/user/deleteuser/${id}`);
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <div style={{ padding: "40px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <input
        type="text"
        placeholder="Enter your AI prompt here..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{ padding: '10px', fontSize: '16px' }}
      />
      <input
        type="datetime-local"
        value={scheduledTime}
        onChange={(e) => setScheduledTime(e.target.value)}
        style={{ padding: '10px', fontSize: '16px' }}
      />
      <button
        onClick={dataSendtoApi}
        disabled={isSubmitting || !value || !scheduledTime}
        style={{ padding: '10px', fontSize: '16px', backgroundColor: '#28a745', color: 'white', border: 'none' }}
      >
        {isSubmitting ? 'Scheduling...' : 'Schedule AI Post'}
      </button>
      <button
        onClick={logout}
        style={{ padding: '10px', fontSize: '16px', backgroundColor: '#dc3545', color: 'white', border: 'none' }}
      >
        Logout
      </button>
    </div>
  );
};

export default Home;