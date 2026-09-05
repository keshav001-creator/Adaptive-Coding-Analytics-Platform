<h1 align="center">
  DSA Behavioral Intelligence System
</h1>

<p align="center">
  An AI-powered behavioral analytics platform that tracks DSA problem-solving patterns and transforms coding behavior into personalized revision intelligence.
</p>

<p align="center">
  <a href="https://adaptive-coding-analytics-platform.onrender.com/">🚀 Live Demo</a>
  &nbsp;&nbsp;•&nbsp;&nbsp;
  <a href="https://github.com/keshav001-creator/Adaptive-Coding-Analytics-Platform">📂 Source Code</a>
</p>

<hr>

<h2>🎯 Problem</h2>

<p>
Traditional DSA practice platforms primarily track whether a problem was solved or not. 
They do not capture the deeper behavioral signals behind the learning process — such as active coding time, repeated failures, revision attempts, question switching, and performance changes across attempts.
</p>

<p>
This project converts those behavioral signals into actionable learning intelligence.
</p>

<hr>

<h2>💡 Solution</h2>

<p>
The system combines a Chrome Extension, event-driven backend, MongoDB behavioral storage, and Gemini-powered intelligence to continuously analyze DSA learning behavior.
</p>

<pre>
Coding Behavior
      ↓
Behavioral Events
      ↓
Persistent Event Storage
      ↓
Behavior Analysis
      ↓
Question + Global Intelligence
      ↓
AI-Generated Insights
      ↓
Personalized Revision Strategy
</pre>

<hr>

<h2>🚀 Key Features</h2>

<ul>
  <li>Chrome Extension based behavioral tracking</li>
  <li>Active coding time tracking</li>
  <li>Wrong submission detection</li>
  <li>Revision attempt tracking</li>
  <li>Question switching behavior tracking</li>
  <li>Persistent behavioral history using MongoDB</li>
  <li>Question-level learning intelligence</li>
  <li>Global learning intelligence</li>
  <li>Retention decay analysis</li>
  <li>Personalized revision recommendations</li>
  <li>Checkpoint-based AI execution</li>
  <li>Retry-safe event processing</li>
  <li>Duplicate AI execution prevention</li>
</ul>

<hr>

<h2>🛠️ Tech Stack</h2>

<h3>Frontend</h3>

<ul>
  <li>React.js</li>
  <li>Tailwind CSS</li>
</ul>

<h3>Backend</h3>

<ul>
  <li>Node.js</li>
  <li>Express.js</li>
  <li>MongoDB</li>
  <li>Event-driven processing</li>
  <li>Fault-tolerant processing</li>
  <li>Retry-safe persistence</li>
</ul>

<h3>AI Intelligence</h3>

<ul>
  <li>Google Gemini API</li>
  <li>Behavioral trend analysis</li>
  <li>Question-level intelligence</li>
  <li>Global learning intelligence</li>
  <li>Structured AI output</li>
</ul>

<h3>Chrome Extension</h3>

<ul>
  <li>Chrome Extension APIs</li>
  <li>Content Scripts</li>
  <li>MutationObserver</li>
  <li>DOM-based behavioral detection</li>
</ul>

<hr>

<h2>🏗️ System Architecture</h2>

<pre>
┌──────────────────────┐
│   Chrome Extension   │
│  Behavioral Tracking │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│    Express API       │
│ Event Validation     │
│ Event Processing     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│       MongoDB        │
│ Persistent Event Log │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Question Intelligence│
│      Engine          │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Checkpoint Validator │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Global Intelligence  │
│       Engine         │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│     Gemini API       │
│  AI Intelligence     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Intelligence Storage │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ React Dashboard      │
└──────────────────────┘
</pre>

<hr>

<h2>🧠 Dual Intelligence Architecture</h2>

<p>
The intelligence layer is divided into two independent pipelines.
</p>

<h3>1. Question-Level Intelligence</h3>

<ul>
  <li>Runs for individual DSA problems</li>
  <li>Analyzes performance across attempts</li>
  <li>Tracks solving time and accuracy trends</li>
  <li>Detects potential retention decay</li>
  <li>Generates revision priority</li>
  <li>Triggers AI analysis at defined attempt checkpoints</li>
</ul>

<h3>2. Global Intelligence</h3>

<ul>
  <li>Analyzes the learner's complete behavioral dataset</li>
  <li>Runs after every 5 total attempts</li>
  <li>Identifies weak and strong topic patterns</li>
  <li>Aggregates performance trends across problems</li>
  <li>Generates system-wide revision strategies</li>
</ul>

<hr>

<h2>⚡ Fault-Tolerant Intelligence Pipeline</h2>

<p>
AI calls are intentionally separated from the core behavioral event recording process.
The system prioritizes persistent event storage first and treats intelligence generation as a downstream processing stage.
</p>

<h3>Pipeline</h3>

<pre>
Behavior Event
      ↓
API Validation
      ↓
Persistent MongoDB Write
      ↓
Question Intelligence
      ↓
Checkpoint Validation
      ↓
Global Intelligence Trigger
      ↓
Gemini Processing
      ↓
Intelligence Storage
      ↓
Dashboard
</pre>

<h3>Reliability Mechanisms</h3>

<ul>
  <li><strong>Persistent event storage:</strong> Behavioral events are stored before intelligence processing.</li>
  <li><strong>Retry-safe processing:</strong> Processing failures do not require the original behavioral event to be recreated.</li>
  <li><strong>Checkpoint-based execution:</strong> Global intelligence runs only when the required attempt threshold is reached.</li>
  <li><strong>Duplicate prevention:</strong> <code>lastProcessedCount</code> prevents repeated processing of the same checkpoint.</li>
  <li><strong>Graceful AI failure:</strong> AI failures do not invalidate the underlying behavioral data.</li>
  <li><strong>Independent pipelines:</strong> Question-level and global intelligence operate independently.</li>
</ul>

<hr>

<h2>🔄 Checkpoint-Based AI Execution</h2>

<p>
AI inference is not executed unnecessarily after every event. 
The system uses checkpoints to control AI execution and reduce redundant inference.
</p>

<pre>
Attempt Count

1  → Store behavior
2  → Question Intelligence Checkpoint
3  → Store behavior
4  → Store behavior
5  → Question + Global Intelligence
6  → Store behavior
...
10 → Question + Global Intelligence
</pre>

<p>
This approach allows behavioral tracking to remain lightweight while AI processing is performed only when sufficient behavioral data is available.
</p>

<hr>

<h2>📊 Example Question-Level Intelligence</h2>

<pre>
{
  "question": "Two Sum",
  "priority": "HIGH",
  "revisionGapDays": 3,
  "recommendation": "Review the hash map pattern and perform a dry run before the next attempt.",
  "trendAnalysis": "Solving speed is improving, but accuracy remains inconsistent across repeated attempts."
}
</pre>

<hr>

<h2>🌎 Example Global Intelligence</h2>

<pre>
{
  "weakAreas": [
    {
      "topic": "Two Pointer",
      "analysis": "Difficulty with pointer boundary movement and duplicate handling."
    },
    {
      "topic": "Sliding Window",
      "analysis": "Difficulty maintaining dynamic window constraints."
    }
  ],
  "strongAreas": [
    {
      "topic": "Strings",
      "analysis": "Strong performance in linear string traversal problems."
    }
  ],
  "revisionStrategy": "Use structured dry-runs before submission and prioritize Two Pointer and Sliding Window patterns."
}
</pre>

<hr>

<h2>🔍 Behavioral Signals Tracked</h2>

<table>
  <tr>
    <th>Signal</th>
    <th>Purpose</th>
  </tr>
  <tr>
    <td>Active Coding Time</td>
    <td>Measures actual problem-solving duration</td>
  </tr>
  <tr>
    <td>Wrong Submissions</td>
    <td>Measures logical accuracy</td>
  </tr>
  <tr>
    <td>Revision Attempts</td>
    <td>Tracks retention and repeated practice</td>
  </tr>
  <tr>
    <td>Question Switching</td>
    <td>Identifies possible difficulty or abandonment patterns</td>
  </tr>
  <tr>
    <td>Attempt History</td>
    <td>Enables longitudinal performance analysis</td>
  </tr>
</table>

<hr>

<h2>💻 Dashboard</h2>

<p>
The dashboard provides a visual representation of behavioral trends and AI-generated learning intelligence.
</p>

<h3>Dashboard</h3>

<img src="frontend/screenshots/Dashboard.png" alt="DSA Behavioral Intelligence Dashboard" width="800">

<br>

<h3>Question Intelligence</h3>

<img src="frontend/screenshots/Question.png" alt="Question Intelligence" width="800">

<br>

<h3>Question Attempts</h3>

<img src="frontend/screenshots/Attempts.png" alt="Question Attempts" width="800">

<hr>

<h2>🎥 Demo</h2>

<p>
Try the deployed application:
</p>

<p>
<a href="YOUR_DEMO_LINK">🚀 Open Live Demo</a>
</p>

<p>
The demo showcases behavioral analytics, question-level intelligence, global learning insights, and personalized revision recommendations.
</p>

<hr>

<h2>👤 Current Scope</h2>

<p>
This project is currently designed as a <strong>single-user personal behavioral analytics platform</strong>.
Authentication is intentionally not implemented because the current system is built for personal DSA practice rather than multi-user usage.
</p>

<p>
The architecture can be extended to support multiple users by introducing user identity and authentication at the API layer while keeping the core behavioral intelligence pipelines unchanged.
</p>

<hr>

<h2>🚀 Engineering Highlights</h2>

<ul>
  <li>Designed an event-driven behavioral data pipeline</li>
  <li>Separated persistent behavioral storage from AI processing</li>
  <li>Implemented checkpoint-based AI execution</li>
  <li>Designed duplicate-safe intelligence triggering</li>
  <li>Built independent question-level and global intelligence pipelines</li>
  <li>Implemented graceful degradation when AI processing fails</li>
  <li>Converted raw coding behavior into structured learning insights</li>
</ul>

<hr>

<h2>📈 Future Improvements</h2>

<ul>
  <li>Spaced repetition scheduling engine</li>
  <li>Topic clustering and skill graph generation</li>
  <li>Difficulty prediction based on behavioral history</li>
  <li>Multi-platform support for coding platforms</li>
  <li>Real-time AI coding coach</li>
  <li>Multi-user authentication and data isolation</li>
  <li>Background job queue for asynchronous AI processing</li>
  <li>Advanced observability and processing metrics</li>
</ul>

<hr>

<h2>👨‍💻 Author</h2>

<p>
<strong>Keshav</strong>
</p>

<h2>Screenshots</h2>

<h3>Dashboard Page</h3>
<img src="frontend/screenshots/Dashboard.png" alt="Dashboard" width="700">

<br>
<h3>Question Details Page</h3>
<img src="frontend/screenshots/Question.png" alt="Question" width="700">

<br>
<h3>Question Attempts</h3>
<img src="frontend/screenshots/Attempts.png" alt="Attempts" width="700">
