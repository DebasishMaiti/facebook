import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const Lid = localStorage.getItem("userId");
  const id = JSON.parse(Lid);
  const [value, setValue] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  const dataSendtoApi = async () => {
    try {
      const res = await axios.post(`https://social.cakekipathshala.com/api/schedule-ai-post`, {
        prompt: value,
        scheduledTime,
        userId: id,
      });
      alert("✅ Post scheduled successfully!");
    } catch (error) {
      console.error("❌ API error:", error);
      alert("Failed to schedule post.");
    }
  };

  const logout = async () => {
    await axios.delete(`https://social.cakekipathshala.com/user/deleteuser/${id}`);
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
        style={{ padding: '10px', fontSize: '16px', backgroundColor: '#28a745', color: 'white', border: 'none' }}
      >
        Schedule AI Post
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
