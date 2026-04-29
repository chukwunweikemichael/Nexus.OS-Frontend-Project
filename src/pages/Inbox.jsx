import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const Inbox = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const apps = JSON.parse(localStorage.getItem("applications")) || [];
    setApplications(apps);
  }, []);

  return (
    <div>
      <Navbar />

      <div className="max-w-2xl mx-auto mt-10 text-white">
        <h2 className="text-2xl font-bold mb-6">Inbox / Applications</h2>

        {applications.length === 0 ? (
          <p className="text-gray-400">No messages yet</p>
        ) : (
          applications.map((app, index) => (
            <div key={index} className="bg-gray-800 p-4 mb-4 rounded">
              <p className="text-gray-300">{app.message}</p>
              <p className="text-sm text-gray-500 mt-2">
                Gig ID: {app.gigId}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Inbox;