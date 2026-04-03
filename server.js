const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ============ CTFd API PROXY ENDPOINTS ============

// Fetch challenges from CTFd
app.post('/api/fetch-challenges', async (req, res) => {
    const { ctfdUrl, apiToken } = req.body;
    if (!ctfdUrl || !apiToken) {
        return res.status(400).json({ error: 'Missing CTFd URL or API Token' });
    }

    try {
        const response = await axios.get(`${ctfdUrl}/api/v1/challenges`, {
            headers: { Authorization: `Token ${apiToken}` }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching challenges:', error.message);
        const status = error.response?.status || 500;
        const message = error.response?.data?.message || 'Failed to fetch challenges';
        res.status(status).json({ error: message });
    }
});

// Submit flag to CTFd
app.post('/api/submit-flag', async (req, res) => {
    const { ctfdUrl, apiToken, challengeId, flag } = req.body;
    if (!ctfdUrl || !apiToken || !challengeId || !flag) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const response = await axios.post(`${ctfdUrl}/api/v1/challenges/attempt`, {
            challenge_id: challengeId,
            submission: flag
        }, {
            headers: {
                Authorization: `Token ${apiToken}`,
                'Content-Type': 'application/json'
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error submitting flag:', error.message);
        const status = error.response?.status || 500;
        const message = error.response?.data?.message || 'Flag submission failed';
        res.status(status).json({ error: message });
    }
});

// ============ EVENT INFORMATION ENDPOINTS ============

// Get event details
app.get('/api/event-info', (req, res) => {
    res.json({
        eventName: "The Aether Corp Breach Investigation",
        date: "28 April 2026",
        venue: "Tjohn Institute of Technology, Gottigere, Bengaluru - 560083",
        timings: "9:00 AM - 5:00 PM",
        registrationUrl: "https://lu.ma/acf-investigation-2026", // Update with your actual Luma URL
        ctfdPortalUrl: "https://ctfd.example.com", // Update with your actual CTFd URL
        ctfdPortalOpenDate: "2026-04-28T09:00:00",
        organizers: {
            student: {
                name: "Ahmed Sufiyan",
                phone: "+91 74833 63837",
                email: "ahmed@acf.in"
            },
            faculty: {
                name: "Dr. Sudaroli",
                department: "Department of Computer Science",
                email: "sudaroli@tjohn.edu"
            }
        },
        prizes: {
            first: "₹2,000",
            second: "₹1,000", 
            third: "₹500"
        },
        totalChallenges: 20,
        tools: [
            { name: "CyberChef", url: "https://cyberchef.org" },
            { name: "Wireshark", url: "https://www.wireshark.org/download.html" },
            { name: "Aperi'Solve", url: "https://www.aperisolve.com" },
            { name: "HexEd.it", url: "https://hexed.it" },
            { name: "Audacity", url: "https://www.audacityteam.org/download" },
            { name: "Binwalk", url: "https://github.com/ReFirmLabs/binwalk" },
            { name: "StegSolve", url: "https://github.com/zardus/ctf-tools/tree/master/stegsolve" },
            { name: "Volatility", url: "https://www.volatilityfoundation.org/releases" }
        ]
    });
});

// Check if CTFd portal is open
app.get('/api/portal-status', (req, res) => {
    const openDate = new Date('2026-04-28T09:00:00');
    const now = new Date();
    const isOpen = now >= openDate;
    
    res.json({
        isOpen: isOpen,
        openDate: openDate.toISOString(),
        message: isOpen ? "Portal is now open!" : "Portal will open on 28 April 2026 at 9:00 AM"
    });
});

// ============ EVIDENCE TRACKING (Optional - for demo) ============

// In-memory store for evidence tracking (use database in production)
let evidenceProgress = new Map();

// Get user's evidence progress (by session or token)
app.get('/api/evidence-progress/:userId', (req, res) => {
    const { userId } = req.params;
    const progress = evidenceProgress.get(userId) || { solved: [], lastUpdated: null };
    res.json(progress);
});

// Update evidence progress
app.post('/api/evidence-progress', (req, res) => {
    const { userId, challengeId, flag, solved } = req.body;
    
    if (!userId || !challengeId) {
        return res.status(400).json({ error: 'Missing userId or challengeId' });
    }
    
    let userProgress = evidenceProgress.get(userId) || { solved: [], lastUpdated: null };
    
    if (solved && !userProgress.solved.includes(challengeId)) {
        userProgress.solved.push(challengeId);
        userProgress.lastUpdated = new Date().toISOString();
        evidenceProgress.set(userId, userProgress);
    }
    
    res.json({ 
        success: true, 
        solvedCount: userProgress.solved.length,
        solved: userProgress.solved 
    });
});

// ============ SERVE FRONTEND ============

// Catch-all route to serve index.html for client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`
    ╔═══════════════════════════════════════════════════════════════════════╗
    ║                                                                       ║
    ║     █████╗  ██████╗ ███████╗    ██╗███╗   ██╗██╗   ██╗███████╗███████╗║
    ║    ██╔══██╗██╔════╝ ██╔════╝    ██║████╗  ██║██║   ██║██╔════╝██╔════╝║
    ║    ███████║██║  ███╗█████╗      ██║██╔██╗ ██║██║   ██║█████╗  ███████╗║
    ║    ██╔══██║██║   ██║██╔══╝      ██║██║╚██╗██║╚██╗ ██╔╝██╔══╝  ╚════██║║
    ║    ██║  ██║╚██████╔╝██║         ██║██║ ╚████║ ╚████╔╝ ██║     ███████║║
    ║    ╚═╝  ╚═╝ ╚═════╝ ╚═╝         ╚═╝╚═╝  ╚═══╝  ╚═══╝  ╚═╝     ╚══════╝║
    ║                                                                       ║
    ║              THE AETHER CORP BREACH - INVESTIGATION PORTAL            ║
    ║                                                                       ║
    ╠═══════════════════════════════════════════════════════════════════════╣
    ║                                                                       ║
    ║     🚀 Server running at: http://localhost:${PORT}                      ║
    ║                                                                       ║
    ║     📅 Event Date: 28 April 2026                                      ║
    ║     📍 Venue: Tjohn Institute of Technology, Bengaluru                ║
    ║                                                                       ║
    ║     🔗 CTFd API Proxy: Active                                         ║
    ║     🔒 Portal Lock: Will open on 28 April 2026, 9:00 AM               ║
    ║                                                                       ║
    ║     📋 API Endpoints:                                                 ║
    ║        POST /api/fetch-challenges  - Get challenges from CTFd         ║
    ║        POST /api/submit-flag       - Submit flag to CTFd              ║
    ║        GET  /api/event-info        - Get event details                ║
    ║        GET  /api/portal-status     - Check if portal is open          ║
    ║                                                                       ║
    ║     💡 Tip: Update the CTFd URL and Luma registration link in         ║
    ║        the /api/event-info endpoint before deployment!                ║
    ║                                                                       ║
    ║     "EX VERITATE, LUX" - From Truth, Light                            ║
    ║                                                                       ║
    ╚═══════════════════════════════════════════════════════════════════════╝
    `);
});