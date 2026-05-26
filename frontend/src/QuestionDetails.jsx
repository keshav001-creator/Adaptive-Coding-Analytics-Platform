import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const QuestionDetails = () => {
    const navigate = useNavigate();

    const { questionName } = useParams();

    // DUMMY DATA (replace with backend data later)
    const question = {
        name: questionName,
        difficulty: "Medium",
        priority: "HIGH",
        recommendation:
            "Retention decay detected. Revise duplicate handling logic and dry run the two-pointer approach once again.",
        failedAttempts: 3,
        totalRevisions: 7,
        averageTime: "24s",
        nextRevision: "3 Days",
        currentStatus: "Needs Revision",
    };

    const trends = [
        { revision: "Rev 1", time: "37s" },
        { revision: "Rev 2", time: "15s" },
        { revision: "Rev 3", time: "42s" },
        { revision: "Rev 4", time: "24s" },
        { revision: "Rev 5", time: "20s" },
        { revision: "Rev 6", time: "16s" },
        { revision: "Rev 7", time: "8s" },
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

    return (
        <div className="min-h-screen bg-[#0B0F19] text-white p-6">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-8">

                <div>
                    <button
                        onClick={() => navigate("/")}
                        className="text-sm text-gray-400 hover:text-white transition mb-3"
                    >
                        ← Back to Dashboard
                    </button>

                    <h1 className="text-3xl font-bold tracking-wide">
                        {question.name}
                    </h1>

                    <p className="text-gray-500 text-sm mt-1">
                        AI Behavioral Intelligence Report
                    </p>
                </div>

                <span
                    className={`px-4 py-2 rounded-full border text-sm font-medium ${getPriorityColor(
                        question.priority
                    )}`}
                >
                    {question.priority} PRIORITY
                </span>
            </div>

            {/* TOP GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">

                <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5 hover:scale-[1.02] transition">
                    <p className="text-gray-400 text-sm">
                        Failed Attempts
                    </p>

                    <h2 className="text-3xl font-bold mt-3">
                        {question.failedAttempts}
                    </h2>
                </div>

                <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5 hover:scale-[1.02] transition">
                    <p className="text-gray-400 text-sm">
                        Total Revisions
                    </p>

                    <h2 className="text-3xl font-bold mt-3">
                        {question.totalRevisions}
                    </h2>
                </div>

                <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5 hover:scale-[1.02] transition">
                    <p className="text-gray-400 text-sm">
                        Average Solve Time
                    </p>

                    <h2 className="text-3xl font-bold mt-3">
                        {question.averageTime}
                    </h2>
                </div>

                <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5 hover:scale-[1.02] transition">
                    <p className="text-gray-400 text-sm">
                        Next Revision
                    </p>

                    <h2 className="text-3xl font-bold mt-3">
                        {question.nextRevision}
                    </h2>
                </div>
            </div>

            {/* MAIN GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT SIDE */}
                <div className="lg:col-span-2 space-y-6">

                    {/* AI INSIGHT */}
                    <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6">

                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">
                                AI Recommendation
                            </h2>

                            <span className="text-xs text-blue-400">
                                Behavioral Intelligence
                            </span>
                        </div>

                        <p className="text-gray-300 leading-7">
                            {question.recommendation}
                        </p>
                    </div>

                    {/* REVISION TIMELINE */}
                    <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 h-[650px] flex flex-col">

                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold">
                                Revision Timeline
                            </h2>

                            <span className="text-xs text-gray-500">
                                {trends.length} Revisions
                            </span>
                        </div>

                        {/* SCROLLABLE AREA */}
                        <div className="space-y-4 overflow-y-auto pr-2 flex-1 custom-scrollbar">

                            {trends.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between bg-[#0F172A] rounded-xl p-4 border border-gray-800 hover:border-blue-500/30 hover:bg-[#131d33] transition-all duration-300"
                                >

                                    {/* LEFT */}
                                    <div>
                                        <p className="font-medium">
                                            {item.revision}
                                        </p>

                                        <p className="text-xs text-gray-500 mt-1">
                                            Learning attempt tracking
                                        </p>
                                    </div>

                                    {/* RIGHT */}
                                    <div className="text-right">
                                        <p className="text-blue-400 font-semibold">
                                            {item.time}
                                        </p>

                                        <p className="text-xs text-gray-500">
                                            Solve Time
                                        </p>
                                    </div>

                                </div>
                            ))}

                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="space-y-6">

                    {/* QUESTION STATUS */}
                    <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6">

                        <h2 className="text-lg font-semibold mb-5">
                            Question Status
                        </h2>

                        <div className="space-y-5">

                            <div>
                                <p className="text-gray-500 text-sm">
                                    Difficulty
                                </p>

                                <p className="font-medium mt-1">
                                    {question.difficulty}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm">
                                    Current Status
                                </p>

                                <p className="text-red-400 font-medium mt-1">
                                    {question.currentStatus}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm">
                                    Revision Priority
                                </p>

                                <p className="font-medium mt-1">
                                    {question.priority}
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* QUICK INSIGHTS */}
                    <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6">

                        <h2 className="text-lg font-semibold mb-5">
                            Quick Insights
                        </h2>

                        <div className="space-y-4">

                            <div className="bg-[#0F172A] p-4 rounded-xl border border-gray-800">
                                <p className="text-sm text-gray-300">
                                    Solve time improved significantly after revision 4.
                                </p>
                            </div>

                            <div className="bg-[#0F172A] p-4 rounded-xl border border-gray-800">
                                <p className="text-sm text-gray-300">
                                    Behavioral consistency still unstable.
                                </p>
                            </div>

                            <div className="bg-[#0F172A] p-4 rounded-xl border border-gray-800">
                                <p className="text-sm text-gray-300">
                                    Recommended spaced repetition revision cycle detected.
                                </p>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default QuestionDetails;