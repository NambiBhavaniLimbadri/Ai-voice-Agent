/* ==========================================================================
   You AI Voice-Agent Premium Interactions & Animations Script
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initParticleCanvas();
    init3DTilt();
    initVoiceAgentSimulator();
});

/* ==========================================================================
   1. Interactive 3D Particle Network Background
   ========================================================================== */
function initParticleCanvas() {
    const canvas = document.getElementById("particle-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let particles = [];
    const maxParticles = 60;
    const connectionDist = 120;
    let mouse = { x: null, y: null, radius: 150 };

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener("mouseleave", () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 2 + 1;
            this.color = "rgba(0, 240, 255, 0.4)";
        }

        update() {
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

            this.x += this.vx;
            this.y += this.vy;

            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    this.x += (dx / distance) * force * 0.8;
                    this.y += (dy / distance) * force * 0.8;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }

    function connectParticles() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDist) {
                    const alpha = (1 - distance / connectionDist) * 0.15;
                    ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 10,
            canvas.width / 2, canvas.height / 2, canvas.width
        );
        gradient.addColorStop(0, '#0a0a1a');
        gradient.addColorStop(0.5, '#030308');
        gradient.addColorStop(1, '#010103');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p) => {
            p.update();
            p.draw();
        });

        connectParticles();
        requestAnimationFrame(animate);
    }
    animate();
}

/* ==========================================================================
   2. Mouse-Responsive 3D Card Tilt Effect
   ========================================================================== */
function init3DTilt() {
    const cards = document.querySelectorAll("[data-tilt]");
    
    cards.forEach((card) => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((centerY - y) / centerY) * 10;
            const rotateY = ((x - centerX) / centerX) * 10;
            
            const pctX = (x / rect.width) * 100;
            const pctY = (y / rect.height) * 100;
            card.style.setProperty("--mouse-x", `${pctX}%`);
            card.style.setProperty("--mouse-y", `${pctY}%`);
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
        });
        
        card.addEventListener("mouseleave", () => {
            card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
        });
    });
}

/* ==========================================================================
   3. AI Voice-Agent Simulator Engine
   ========================================================================== */
function initVoiceAgentSimulator() {
    const triggerBtn = document.getElementById("call-trigger-btn");
    const statusBadge = document.getElementById("call-badge-status");
    const timerDisplay = document.getElementById("call-timer");
    const transcriptBox = document.getElementById("transcript-box");
    const customerAvatar = document.getElementById("customer-avatar");
    const aiAvatar = document.getElementById("ai-avatar");
    const soundWave = document.getElementById("sound-wave");
    const crmSync = document.getElementById("crm-sync-status");
    
    // CRM Lead Score components
    const leadScoreText = document.getElementById("lead-score-text");
    const leadScoreFill = document.getElementById("lead-score-fill");

    // Progression checkmarks
    const stepCall = document.getElementById("step-call");
    const stepQualify = document.getElementById("step-qualify");
    const stepCrm = document.getElementById("step-crm");
    const stepBook = document.getElementById("step-book");
    
    // CRM Fields
    const fieldName = document.querySelector("#crm-field-name .value-placeholder");
    const fieldCompany = document.querySelector("#crm-field-company .value-placeholder");
    const fieldPhone = document.querySelector("#crm-field-phone .value-placeholder");
    const fieldPainPoint = document.querySelector("#crm-field-painpoint .value-placeholder");
    const fieldStatus = document.querySelector("#crm-field-status .value-placeholder");
    const fieldBooking = document.querySelector("#crm-field-booking .value-placeholder");
    
    let isSimulating = false;
    let timerInterval = null;
    let timeouts = [];
    
    // Call Script dialogue with dynamic score updates and checklist hooks
    const dialogueTimeline = [
        {
            time: 1500, // ms
            speaker: "system",
            text: "Incoming call from +1 (555) 382-9014...",
            status: "Incoming Call",
            statusClass: "active-incoming",
            avatarSpeaking: "customer",
            score: 0
        },
        {
            time: 3500,
            speaker: "system",
            text: "You AI Agent picked up instantly (Call latency: 120ms)",
            status: "AI Answering",
            statusClass: "active-answering",
            avatarSpeaking: "none",
            flowStep: stepCall,
            score: 15
        },
        {
            time: 4800,
            speaker: "ai",
            text: "Hello! Thank you for calling You AI Voice-Agent Solutions. I'm your AI Business Assistant. How can I help streamline your operations today?",
            avatarSpeaking: "ai"
        },
        {
            time: 9800,
            speaker: "customer",
            text: "Hi, I'm Alex Rivera from Rivera Media. We generate around a hundred leads daily but our team can't qualify them fast enough. We need something automated that books meetings.",
            avatarSpeaking: "customer",
            score: 45,
            crmUpdate: () => {
                populateCRMField("crm-field-name", fieldName, "Alex Rivera");
                populateCRMField("crm-field-company", fieldCompany, "Rivera Media");
                crmSync.textContent = "SYNCING...";
                crmSync.className = "crm-sync sync-active";
            }
        },
        {
            time: 18500,
            speaker: "ai",
            text: "Understood, Alex. Managing lead qualification in high volumes is exactly what You AI Voice-Agent excels at. We deploy autonomous agents that talk with inbound leads instantly, evaluate pain points, and schedule directly. What's the best phone number to connect with your team?",
            avatarSpeaking: "ai",
            flowStep: stepQualify,
            score: 65
        },
        {
            time: 26500,
            speaker: "customer",
            text: "Got it, that's exactly what we need. You can reach us directly at +1 (555) 382-9014. Can you sync details directly into our database?",
            avatarSpeaking: "customer",
            score: 80,
            crmUpdate: () => {
                populateCRMField("crm-field-phone", fieldPhone, "+1 (555) 382-9014");
                populateCRMField("crm-field-painpoint", fieldPainPoint, "Lead Qualification at scale");
            }
        },
        {
            time: 33500,
            speaker: "ai",
            text: "Yes, we integrate natively with your CRM. I have logged your core challenge and contact details. Based on your needs, I recommend setting up our Workflow module. Shall we book a setup meeting for Monday, June 15th at 10:00 AM EST?",
            avatarSpeaking: "ai"
        },
        {
            time: 41500,
            speaker: "customer",
            text: "Absolutely, June 15th at 10:00 AM works perfectly. Let's get it scheduled.",
            avatarSpeaking: "customer"
        },
        {
            time: 45500,
            speaker: "ai",
            text: "Perfect! I have booked your onboarding call for June 15th at 10:00 AM. I have also marked your lead record as Qualified and dispatched a confirmation invite to your email. I look forward to working together!",
            avatarSpeaking: "ai",
            flowStep: stepCrm,
            score: 98,
            crmUpdate: () => {
                populateCRMField("crm-field-status", fieldStatus, "QUALIFIED", true);
                populateCRMField("crm-field-booking", fieldBooking, "Confirmed: June 15, 10:00 AM");
                crmSync.textContent = "CONNECTED • SYNCED";
                
                // Final trigger steps completed
                setTimeout(() => {
                    if (isSimulating) {
                        stepBook.classList.add("completed");
                    }
                }, 1200);
            }
        },
        {
            time: 52000,
            speaker: "system",
            text: "Call ended. Status: Call Answered • Lead Qualified • CRM Sync • Meeting Booked.",
            status: "Call Completed",
            statusClass: "active-connected",
            avatarSpeaking: "none"
        }
    ];

    triggerBtn.addEventListener("click", () => {
        if (isSimulating) {
            stopSimulation();
        } else {
            startSimulation();
        }
    });

    function startSimulation() {
        isSimulating = true;
        resetSimulatorUI();
        
        triggerBtn.innerHTML = `<span class="btn-icon">⏹</span> <span class="btn-text">Disconnect Call</span>`;
        triggerBtn.className = "call-btn btn-call-active";
        
        let seconds = 0;
        timerInterval = setInterval(() => {
            seconds++;
            const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
            const secs = (seconds % 60).toString().padStart(2, "0");
            timerDisplay.textContent = `${mins}:${secs}`;
        }, 1000);

        dialogueTimeline.forEach((event) => {
            const timeoutId = setTimeout(() => {
                executeDialogueEvent(event);
            }, event.time);
            timeouts.push(timeoutId);
        });
    }

    function stopSimulation() {
        isSimulating = false;
        clearInterval(timerInterval);
        timeouts.forEach(t => clearTimeout(t));
        timeouts = [];
        
        triggerBtn.innerHTML = `<span class="btn-icon">📞</span> <span class="btn-text">Initiate Call Demo</span>`;
        triggerBtn.className = "call-btn btn-call-idle";
        
        statusBadge.textContent = "Call Idle";
        statusBadge.className = "call-badge";
        timerDisplay.textContent = "00:00";
        setSpeakerActive("none");
        
        crmSync.textContent = "OFFLINE";
        crmSync.className = "crm-sync";
        
        // Reset Lead Score
        updateLeadScoreUI(0);
        
        appendSystemMessage("Call disconnected manually.");
    }

    function executeDialogueEvent(event) {
        if (!isSimulating) return;

        if (event.status) {
            statusBadge.textContent = event.status;
            statusBadge.className = `call-badge ${event.statusClass}`;
        }

        if (event.flowStep) {
            event.flowStep.classList.add("completed");
        }

        if (event.avatarSpeaking) {
            setSpeakerActive(event.avatarSpeaking);
        }

        if (event.score !== undefined) {
            updateLeadScoreUI(event.score);
        }

        if (event.crmUpdate) {
            event.crmUpdate();
        }

        if (event.speaker === "system") {
            appendSystemMessage(event.text);
        } else {
            appendDialogueBubble(event.speaker, event.text);
        }
    }

    function setSpeakerActive(speaker) {
        if (speaker === "customer") {
            customerAvatar.classList.add("speaking");
            aiAvatar.classList.remove("speaking");
            soundWave.className = "sound-wave speaking-customer";
        } else if (speaker === "ai") {
            aiAvatar.classList.add("speaking");
            customerAvatar.classList.remove("speaking");
            soundWave.className = "sound-wave speaking-ai";
        } else {
            customerAvatar.classList.remove("speaking");
            aiAvatar.classList.remove("speaking");
            soundWave.className = "sound-wave";
        }
    }

    function appendSystemMessage(text) {
        const msg = document.createElement("div");
        msg.className = "system-message";
        msg.innerHTML = `<span class="terminal-prefix">[SYSTEM]:</span> ${text}`;
        transcriptBox.appendChild(msg);
        transcriptBox.scrollTop = transcriptBox.scrollHeight;
    }

    function appendDialogueBubble(speaker, text) {
        const bubble = document.createElement("div");
        bubble.className = `transcript-bubble bubble-${speaker}`;
        
        const sender = document.createElement("span");
        sender.className = "bubble-sender";
        sender.textContent = speaker === "ai" ? "You AI Agent" : "Customer";
        
        const content = document.createElement("span");
        content.className = "bubble-text";
        
        bubble.appendChild(sender);
        bubble.appendChild(content);
        transcriptBox.appendChild(bubble);
        
        let idx = 0;
        const typingSpeed = 30;
        
        function typeChar() {
            if (!isSimulating) return;
            if (idx < text.length) {
                content.textContent += text.charAt(idx);
                idx++;
                transcriptBox.scrollTop = transcriptBox.scrollHeight;
                setTimeout(typeChar, typingSpeed);
            }
        }
        typeChar();
    }

    function updateLeadScoreUI(score) {
        leadScoreText.textContent = `${score}%`;
        leadScoreFill.style.width = `${score}%`;

        // Color shifting based on qualification index
        if (score < 40) {
            leadScoreFill.style.background = "var(--primary)";
            leadScoreFill.style.boxShadow = "0 0 10px var(--primary)";
        } else if (score < 80) {
            leadScoreFill.style.background = "var(--warning)";
            leadScoreFill.style.boxShadow = "0 0 10px var(--warning)";
        } else {
            leadScoreFill.style.background = "var(--success)";
            leadScoreFill.style.boxShadow = "0 0 10px var(--success)";
        }
    }

    function populateCRMField(fieldId, valueElement, valStr, isStatusField = false) {
        const parentField = document.getElementById(fieldId);
        if (!parentField) return;

        parentField.classList.add("populated");
        valueElement.textContent = valStr;
        
        if (isStatusField) {
            valueElement.className = "value-placeholder status-qualified";
        }
    }

    function resetSimulatorUI() {
        transcriptBox.innerHTML = "";
        appendSystemMessage("Establishing You AI Voice-Agent network connection...");
        
        fieldName.textContent = "—";
        fieldCompany.textContent = "—";
        fieldPhone.textContent = "—";
        fieldPainPoint.textContent = "—";
        fieldStatus.textContent = "UNQUALIFIED";
        fieldStatus.className = "value-placeholder status-unqualified";
        fieldBooking.textContent = "—";
        
        const crmFields = document.querySelectorAll(".crm-field");
        crmFields.forEach(f => f.classList.remove("populated"));
        
        updateLeadScoreUI(0);

        const steps = [stepCall, stepQualify, stepCrm, stepBook];
        steps.forEach(s => {
            s.classList.remove("completed");
        });
    }
}
