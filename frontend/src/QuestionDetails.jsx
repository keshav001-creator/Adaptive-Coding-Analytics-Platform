import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "./api/axios"

const QuestionDetails = () => {
    const navigate = useNavigate();
    const { questionName } = useParams();

    console.log("Question Name from URL:", questionName);

    const [questionData, setQuestionData] = useState(null);

    console.log("Question Data State:", questionData);
    const trends = [];


    //.......................FETCH QUESTION DETAILS FROM BACKEND (replace with actual API call later).......................//

    const fetchQuestionData = async () => {

        try {
            // API call to fetch questions and set state

            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/questions/${questionName}`)

            // setQuestions(response.data.questions);
            console.log("Fetched Question Data:", response.data);
            const { intelligenceData, questionLogs } = response.data;

            const mergedQuestionData = {
                // AI DATA
                priority: intelligenceData.priority,
                recommendation: intelligenceData.recommendation,
                revisionGapDays: intelligenceData.revisionGapDays,
                trendAnalysis: intelligenceData.trendAnalysis,

                // QUESTION DATA
                question: intelligenceData.question,

                // OVERALL STATS
                totalRevisions: questionLogs.length,

                totalFailedAttempts: questionLogs.reduce(
                    (acc, curr) => acc + curr.failedAttempts,
                    0
                ),

                // FULL REVISION HISTORY
                trends: questionLogs
            };

            setQuestionData(mergedQuestionData);

        } catch (err) {
            console.log("Error fetching question data:", err);
        }
    }

    useEffect(() => {
        fetchQuestionData();

        const interval = setInterval(() => {

            fetchQuestionData();

        }, 3000);

        return () => clearInterval(interval);
    }, []);


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
                        {questionData?.question}
                    </h1>

                    <p className="text-gray-500 text-sm mt-1">
                        AI Behavioral Intelligence Report
                    </p>
                </div>

                <span
                    className={`px-4 py-2 rounded-full border text-sm font-medium ${getPriorityColor(
                        questionData?.priority
                    )}`}
                >
                    {questionData?.priority}
                </span>
            </div>

            {/* TOP GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">

                <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5 hover:scale-[1.02] transition">
                    <p className="text-gray-400 text-sm">
                        Failed Attempts
                    </p>

                    <h2 className="text-3xl font-bold mt-3">
                        {questionData?.totalFailedAttempts}
                    </h2>
                </div>

                <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5 hover:scale-[1.02] transition">
                    <p className="text-gray-400 text-sm">
                        Total Revisions
                    </p>

                    <h2 className="text-3xl font-bold mt-3">
                        {questionData?.totalRevisions}
                    </h2>
                </div>

                <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5 hover:scale-[1.02] transition">
                    <p className="text-gray-400 text-sm">
                        Average Solve Time
                    </p>

                    <h2 className="text-3xl font-bold mt-3">
                        {questionData?.averageTime}
                    </h2>
                </div>

                <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5 hover:scale-[1.02] transition">
                    <p className="text-gray-400 text-sm">
                        Next Revision
                    </p>

                    <h2 className="text-3xl font-bold mt-3">
                        {questionData?.revisionGapDays}
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
                            {questionData?.recommendation}
                        </p>
                    </div>

                    {/* REVISION TIMELINE */}
                    <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 h-[650px] flex flex-col">

                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold">
                                Attempt Timeline
                            </h2>

                            <span className="text-xs text-gray-500">
                                {questionData?.trends.length} Revisions
                            </span>
                        </div>

                        {/* SCROLLABLE AREA */}
                        <div className="space-y-4 overflow-y-auto pr-2 flex-1 custom-scrollbar">

                            {questionData?.trends.map((item, index) => (
                                <div
                                    key={item._id}
                                    className="flex items-center justify-between bg-[#0F172A] rounded-xl p-4 border border-gray-800 hover:border-blue-500/30 hover:bg-[#131d33] transition-all duration-300"
                                >

                                    {/* LEFT */}
                                    <div>
                                        <p className="font-medium">
                                            {item.revisionNumber}
                                        </p>

                                        <p className="text-xs text-gray-500 mt-1">
                                            Learning attempt tracking
                                        </p>
                                    </div>

                                    {/* RIGHT */}
                                    <div className="text-right">
                                        <p className="text-blue-400 font-semibold">
                                            {item.timeSpent} seconds
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
                                    {questionData?.difficulty}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm">
                                    Current Status
                                </p>

                                <p className="text-red-400 font-medium mt-1">
                                    {questionData?.currentStatus}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm">
                                    Revision Priority
                                </p>

                                <p className="font-medium mt-1">
                                    {questionData?.priority}
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
                            {questionData?.trendAnalysis.map((insight, index) => (
                                <div key={index} className="bg-[#0F172A] p-4 rounded-xl border border-gray-800">
                                    <p className="text-sm text-gray-300">
                                        {questionData?.trendAnalysis[index]}
                                    </p>
                                </div>
                            ))}


                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default QuestionDetails;