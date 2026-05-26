import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "./api/axios";

const Dashboard = () => {

    const [questions, setQuestions] = useState([]);
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("ALL");


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


    // ------------------ FETCH QUESTIONS ------------------//

    const fetchQuestions = async () => {

        try {
            // API call to fetch questions and set state

            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/questions`)

            setQuestions(response.data.questions);
            console.log("Fetched Questions:", response.data.questions);

        } catch (err) {
            console.log("Error fetching questions:", err);
        }
    }

    useEffect(() => {
        fetchQuestions();
    }, []);

    const filteredQuestions = questions.filter((q) => {

        const matchesSearch = q.question
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesPriority =
            priorityFilter === "ALL"
                ? true
                : q.priority === priorityFilter;

        return matchesSearch && matchesPriority;
    });

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
        <div className="min-h-screen bg-[#0B0F19] text-white p-6">

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
            {/* QUESTION LIST (MAIN FOCUS) */}
            <div className="mt-8">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">

                    {/* LEFT */}

                    <div>
                        <h2 className="text-xl font-semibold">
                            Questions
                        </h2>

                        <p className="text-sm text-gray-500">
                            {filteredQuestions.length} tracked problems
                        </p>
                    </div>

                    {/* RIGHT */}

                    <div className="flex items-center gap-3">

                        {/* SEARCH */}

                        <input
                            type="text"
                            placeholder="Search questions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="
                bg-[#111827] border border-gray-800 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-500 w-[220px]"/>

                        {/* FILTER */}

                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="
                bg-[#111827]
                border border-gray-800
                rounded-xl
                px-4 py-2
                text-sm
                outline-none
                focus:border-blue-500
                text-gray-300
            "
                        >
                            <option value="ALL">All</option>
                            <option value="HIGH">High</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="LOW">Low</option>
                        </select>

                    </div>

                </div>

                <div className="space-y-3">

                    {questions.map((q, index) => (
                        <div
                            key={q._id}
                            onClick={() => navigate(`/${q.name}/${q.id}`)}
                            className="bg-[#111827] border border-gray-800 rounded-xl p-4 flex justify-between items-center hover:bg-[#141c2b] transition"
                        >

                            {/* LEFT */}
                            <div>
                                <h3 className="font-semibold">{q.question}</h3>

                                <p className="text-xs text-gray-500">
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