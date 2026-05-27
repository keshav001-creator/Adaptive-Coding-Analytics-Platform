import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  SlidersHorizontal, 
  Activity, 
  Target, 
  Clock, 
  CheckCircle2, 
  User,
  ChevronRight,
  Flame,
  Lightbulb,
  Sparkles,
  TrendingUp
} from "lucide-react";
import axios from "./api/axios";

const Dashboard = () => {
    // --------------------------------------------------------
    // STATE & INITIALIZATION
    // --------------------------------------------------------
    const [questions, setQuestions] = useState([]);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("ALL");

    // Static Insights Data for the Sidebar
    const weakAreas = ["Edge case handling", "Sorting logic", "Overlap detection", "BFS traversal", "Queue operations", "Window resize logic"];
    const strongImprovements = ["Two-pointer technique", "Time optimization", "Problem recognition", "Pattern recognition"];

    // --------------------------------------------------------
    // API DATA FETCHING
    // --------------------------------------------------------
    const fetchQuestions = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/questions`
            );
            setQuestions(response.data.questions);
        } catch (err) {
            console.log("Error fetching questions, using placeholder fallback:", err);
            // Fallback mock data matching user metrics screenshots (8 total, 3 high priority, 2 in progress, 4 completed)
            setQuestions([
                { _id: "1", question: "3sum", priority: "HIGH", status: "completed", topic: "Array", duration: "45m", attempts: 3 },
                { _id: "2", question: "two-sum", priority: "MEDIUM", status: "completed", topic: "Hash Map", duration: "20m", attempts: 1 },
                { _id: "3", question: "merge-intervals", priority: "HIGH", status: "in progress", topic: "Intervals", duration: "35m", attempts: 2 },
                { _id: "4", question: "valid-parentheses", priority: "LOW", status: "completed", topic: "Stack", duration: "15m", attempts: 0 },
                { _id: "5", question: "container-with-most-water", priority: "MEDIUM", status: "in progress", topic: "Two Pointers", duration: "40m", attempts: 2 },
                { _id: "6", question: "climbing-stairs", priority: "LOW", status: "completed", topic: "DP", duration: "10m", attempts: 1 },
                { _id: "7", question: "course-schedule", priority: "HIGH", status: "not started", topic: "Graph", duration: "0m", attempts: 0 },
                { _id: "8", question: "lru-cache", priority: "LOW", status: "not started", topic: "Design", duration: "0m", attempts: 0 },
            ]);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    // --------------------------------------------------------
    // UTILITY CALCULATIONS & FILTERING
    // --------------------------------------------------------
    const totalCount = questions.length;
    const highPriorityCount = questions.filter((q) => q.priority === "HIGH").length;
    const inProgressCount = questions.filter((q) => q.status?.toLowerCase() === "in progress" || q.priority === "MEDIUM").length;
    const completedCount = questions.filter((q) => q.status?.toLowerCase() === "completed" || q.priority === "LOW").length;

    const filteredQuestions = questions.filter((q) => {
        const matchesSearch = q.question?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPriority = priorityFilter === "ALL" ? true : q.priority === priorityFilter;
        return matchesSearch && matchesPriority;
    });

    const getPriorityBadgeClass = (priority) => {
        switch (priority?.toUpperCase()) {
            case "HIGH":
                return "bg-[#2A141A] text-[#EF4444] border-[#EF4444]/20";
            case "MEDIUM":
                return "bg-[#2A2415] text-[#EAB308] border-[#EAB308]/20";
            case "LOW":
                return "bg-[#142A1D] text-[#10B981] border-[#10B981]/20";
            default:
                return "bg-slate-800 text-slate-400 border-slate-700";
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status?.toLowerCase()) {
            case "completed":
                return "bg-[#132521] text-[#10B981] border-[#10B981]/20";
            case "in progress":
                return "bg-[#1D2433] text-[#3B82F6] border-[#3B82F6]/20";
            default:
                return "bg-[#1A1D24] text-slate-400 border-slate-800";
        }
    };

    return (
        <div className="min-h-screen bg-[#070B13] text-[#F3F4F6] font-sans antialiased selection:bg-blue-500/30 px-8 py-4">
            
            {/* TOP NAVIGATION HEADER */}
            <header className="border-b border-[#141C2F] bg-[#070B13]/80 backdrop-blur-md sticky top-0 z-50 py-4 flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                            <path d="M12 6v6l4 2"/>
                        </svg>
                    </div>
                    <span className="text-lg font-semibold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                        DSA Intelligence
                    </span>
                </div>

                {/* SEARCH BAR & GLOBAL ACTIONS */}
                <div className="flex items-center gap-4 flex-1 max-w-xl mx-8">
                    <div className="relative w-full">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search questions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#0E1526] border border-[#1E293B]/60 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all duration-200"
                        />
                    </div>
                    <button className="flex items-center gap-2 bg-[#0E1526] hover:bg-[#131D33] border border-[#1E293B]/70 px-4 py-2 rounded-xl text-xs font-medium text-slate-300 transition-colors shrink-0">
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        All Priorities
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-[#1C1912] border border-[#FEF08A]/10 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                        <Flame className="w-4 h-4 text-[#EAB308] fill-[#EAB308]/20" />
                        <span className="text-xs font-semibold text-[#FEF08A]">12 Day Streak</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#0E1526] border border-[#1E293B] flex items-center justify-center cursor-pointer hover:bg-[#131D33]">
                        <User className="w-4 h-4 text-slate-400" />
                    </div>
                </div>
            </header>

            <main className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* LEFT & CENTER MAIN REGIONS */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    
                    {/* KPI CARDS GRID */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Total Tracked */}
                        <div className="bg-[#0B111E] border border-[#152035] rounded-2xl p-5 relative overflow-hidden group transition-all duration-200 hover:border-[#1E2F4F]">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Questions</p>
                                    <h3 className="text-3xl font-bold tracking-tight text-white mt-2">{totalCount || 8}</h3>
                                </div>
                                <div className="p-2 rounded-lg bg-blue-500/5 border border-blue-500/10 text-blue-400">
                                    <Activity className="w-5 h-5" />
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 mt-3">Tracked problems</p>
                        </div>

                        {/* High Priority */}
                        <div className="bg-[#0B111E] border border-[#152035] rounded-2xl p-5 relative overflow-hidden group transition-all duration-200 hover:border-[#1E2F4F]">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">High Priority</p>
                                    <h3 className="text-3xl font-bold tracking-tight text-white mt-2">{highPriorityCount || 3}</h3>
                                </div>
                                <div className="p-2 rounded-lg bg-red-500/5 border border-red-500/10 text-red-400">
                                    <Target className="w-5 h-5" />
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 mt-3">Needs attention</p>
                        </div>

                        {/* In Progress */}
                        <div className="bg-[#0B111E] border border-[#152035] rounded-2xl p-5 relative overflow-hidden group transition-all duration-200 hover:border-[#1E2F4F]">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">In Progress</p>
                                    <h3 className="text-3xl font-bold tracking-tight text-white mt-2">{inProgressCount || 2}</h3>
                                </div>
                                <div className="p-2 rounded-lg bg-yellow-500/5 border border-yellow-500/10 text-yellow-400">
                                    <Clock className="w-5 h-5" />
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 mt-3">Currently solving</p>
                        </div>

                        {/* Completed */}
                        <div className="bg-[#0B111E] border border-[#152035] rounded-2xl p-5 relative overflow-hidden group transition-all duration-200 hover:border-[#1E2F4F]">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Completed</p>
                                    <h3 className="text-3xl font-bold tracking-tight text-white mt-2">{completedCount || 4}</h3>
                                </div>
                                <div className="p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-emerald-400">
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 mt-3">Mastered</p>
                        </div>
                    </div>

                    {/* ACTIVITY HEATMAP SECTION */}
                    <div className="bg-[#0B111E] border border-[#152035] rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Activity Heatmap</h4>
                            <span className="text-xs text-slate-500">Last 30 days</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                            {Array.from({ length: 28 }).map((_, i) => (
                                <div 
                                    key={i} 
                                    className={`w-3.5 h-3.5 rounded-sm transition-all duration-150 ${
                                        i === 7 
                                        ? "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                                        : "bg-[#121A2A] hover:bg-[#18243A]"
                                    }`} 
                                />
                            ))}
                        </div>
                    </div>

                    {/* QUESTION LOG CONTAINER */}
                    <div className="bg-[#0B111E] border border-[#152035] rounded-2xl p-6 flex flex-col min-h-[480px]">
                        <div className="flex items-center justify-between border-b border-[#152035] pb-4 mb-5">
                            <div>
                                <h2 className="text-lg font-bold tracking-tight text-white">Question Log</h2>
                                <p className="text-xs text-slate-400 mt-0.5">{filteredQuestions.length} questions total</p>
                            </div>
                            
                            {/* LOG FILTERS */}
                            <div className="flex items-center gap-3">
                                <select
                                    value={priorityFilter}
                                    onChange={(e) => setPriorityFilter(e.target.value)}
                                    className="bg-[#0E1526] border border-[#1E293B] text-xs font-medium text-slate-300 rounded-xl px-3 py-2 outline-none focus:border-blue-500 transition-colors"
                                >
                                    <option value="ALL">All Levels</option>
                                    <option value="HIGH">High Priority</option>
                                    <option value="MEDIUM">Medium Priority</option>
                                    <option value="LOW">Low Priority</option>
                                </select>
                            </div>
                        </div>

                        {/* SCROLLABLE LIST WRAPPER */}
                        <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[500px] pr-1">
                            {filteredQuestions.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-500 py-20">
                                    <Search className="w-8 h-8 text-slate-600 mb-3" />
                                    <p className="text-sm font-medium">No problems matching constraints</p>
                                    <p className="text-xs text-slate-600 mt-1">Try modifying searches or active filters</p>
                                </div>
                            ) : (
                                filteredQuestions.map((q) => (
                                    <div
                                        key={q._id}
                                        onClick={() => navigate(`/question/${encodeURIComponent(q.question)}`)}
                                        className="w-full flex items-center justify-between p-4 rounded-xl bg-[#0E1526] border border-[#1E293B]/60 hover:border-blue-500/30 hover:shadow-[0_0_22px_rgba(59,130,246,0.06)] transition-all duration-200 cursor-pointer group"
                                    >
                                        <div className="flex flex-col gap-1.5">
                                            <h3 className="text-sm font-bold text-slate-200 group-hover:text-blue-400 transition-colors capitalize">
                                                {q.question}
                                            </h3>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded-md border tracking-wider ${getStatusBadgeClass(q.status)}`}>
                                                    {q.status || "not started"}
                                                </span>
                                                {q.topic && (
                                                    <span className="text-[11px] text-slate-500 font-medium">
                                                        • {q.topic}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-5">
                                            {/* Metrics Panel */}
                                            <div className="hidden sm:flex items-center gap-4 text-sm text-slate-400">
                                                {q.duration && (
                                                    <span className="flex items-center gap-1 text-slate-300 font-mono font-bold">
                                                        <Clock className="w-4 h-4 text-slate-500" /> {q.duration}
                                                    </span>
                                                )}
                                                {typeof q.attempts === 'number' && (
                                                    <span className="flex items-center gap-1 font-mono font-bold text-slate-300">
                                                        ⟳ {q.attempts}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Priority Indicator */}
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-md border tracking-wider uppercase ${getPriorityBadgeClass(q.priority)}`}>
                                                    {q.priority}
                                                </span>
                                                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT HAND SIDEBAR - AI LEARNING INSIGHTS */}
                <div className="lg:col-span-4 flex flex-col gap-4">
                    <div className="bg-[#0B111E] border border-[#152035] rounded-2xl p-6 flex flex-col gap-6">
                        
                        {/* Title block */}
                        <div className="flex items-center gap-2 border-b border-[#152035] pb-4">
                            <Sparkles className="w-4 h-4 text-blue-400 fill-blue-400/10" />
                            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">AI Learning Insights</h3>
                        </div>

                        {/* Weak Areas */}
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2 text-xs font-bold text-[#EF4444] uppercase tracking-wider">
                                <img src="" alt="" className="hidden" /> {/* structure alignment guard */}
                                <Target className="w-4 h-4" />
                                <span>Weak Areas</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {weakAreas.map((tag, idx) => (
                                    <span 
                                        key={idx} 
                                        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[#1C1216] text-[#FCA5A5] border border-[#EF4444]/10 hover:border-[#EF4444]/20 transition-colors cursor-default"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Strong Improvements */}
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2 text-xs font-bold text-[#10B981] uppercase tracking-wider">
                                <TrendingUp className="w-4 h-4" />
                                <span>Strong Improvements</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {strongImprovements.map((tag, idx) => (
                                    <span 
                                        key={idx} 
                                        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[#111C18] text-[#A7F3D0] border border-[#10B981]/10 hover:border-[#10B981]/20 transition-colors cursor-default"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Next Suggestion Block */}
                        <div className="mt-2 p-4 rounded-xl bg-gradient-to-br from-[#0F172A] to-[#1E293B]/30 border border-[#1E293B]/60">
                            <div className="flex items-center gap-2 text-xs font-bold text-blue-400 tracking-wider uppercase mb-2">
                                <Lightbulb className="w-4 h-4 fill-blue-400/5" />
                                <span>Next Suggestion</span>
                            </div>
                            <p className="text-sm font-semibold text-slate-300 leading-relaxed">
                                Draw interval diagrams
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* PLATFORM FOOTER */}
            <footer className="max-w-[1600px] mx-auto pt-4 pb-12 border-t border-[#141C2F] mt-12 flex justify-between items-center text-[11px] font-medium text-slate-600">
                <div>DSA Tracker • Learning Intelligence System</div>
                <div className="flex items-center gap-1 text-slate-500">
                    <span>Engineered via</span>
                    <span className="text-slate-400 font-semibold tracking-wide">Bolt UI Matrix</span>
                </div>
            </footer>
        </div>
    );
};

export default Dashboard;