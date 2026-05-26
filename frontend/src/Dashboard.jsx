import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {

    const navigate = useNavigate();


  const kpis = [
    {
      label: "Total Questions",
      value: 42,
      sub: "Questions tracked so far",
    },
    {
      label: "High Priority",
      value: 6,
      sub: "Need revision soon",
    },
    {
      label: "In Progress",
      value: 12,
      sub: "Currently revising",
    },
    {
      label: "Completed",
      value: 24,
      sub: "Solved and stable",
    },
  ];

  const questions = [
    {
      name: "3Sum",
      difficulty: "Medium",
      status: "Needs Revision",
      priority: "HIGH",
    },
    {
      name: "Linked List Cycle",
      difficulty: "Easy",
      status: "In Progress",
      priority: "MEDIUM",
    },
    {
      name: "Binary Search",
      difficulty: "Easy",
      status: "Completed",
      priority: "LOW",
    },
    {
      name: "Trapping Rain Water",
      difficulty: "Hard",
      status: "Needs Revision",
      priority: "HIGH",
    },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "MEDIUM":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "LOW":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "text-green-400";
      case "In Progress":
        return "text-yellow-400";
      case "Needs Revision":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="h-screen bg-[#0B0F19] text-white flex flex-col p-6 overflow-hidden">

      {/* HEADER (simple landing feel) */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-wide">
          Dashboard
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Your DSA progress overview
        </p>
      </div>

      {/* KPI SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {kpis.map((item, index) => (
          <div
            key={index}
            className="bg-[#111827] border border-gray-800 rounded-2xl p-4"
          >
            <p className="text-gray-400 text-sm">{item.label}</p>
            <p className="text-2xl font-semibold mt-2">{item.value}</p>
            <p className="text-xs text-gray-500 mt-1">{item.sub}</p>
          </div>
        ))}
      </div>

      {/* QUESTION LIST (MAIN FOCUS) */}
      <div className="flex-1 flex flex-col">
        <h2 className="text-lg font-semibold mb-4">
          Recent Questions
        </h2>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2">

          {questions.map((q, index) => (
            <div
              key={q.id}
              onClick={() => navigate(`/${q.name}/${q.id}`)}
              className="bg-[#111827] border border-gray-800 rounded-xl p-4 flex justify-between items-center hover:bg-[#141c2b] transition"
            >

              {/* LEFT */}
              <div>
                <h3 className="font-semibold">{q.name}</h3>
                <p className="text-xs text-gray-500">
                  {q.difficulty} •{" "}
                  <span className={getStatusColor(q.status)}>
                    {q.status}
                  </span>
                </p>
              </div>

              {/* RIGHT */}
              <span
                className={`px-3 py-1 text-xs rounded-full border ${getPriorityColor(
                  q.priority
                )}`}
              >
                {q.priority}
              </span>
            </div>
          ))}

        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-4 text-center text-gray-600 text-xs">
        DSA Tracker • Learning System
      </div>
    </div>
  );
};

export default Dashboard;