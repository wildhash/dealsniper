# 🎬 DealSniper Demo Guide (Loom-Ready)

This guide provides a step-by-step walkthrough for demonstrating DealSniper's capabilities.

## 📋 Pre-Demo Checklist

Before starting your recording:
- [ ] Backend server running on `http://localhost:3001`
- [ ] Frontend running on `http://localhost:3000`
- [ ] Sample company data ready
- [ ] Browser window sized appropriately
- [ ] Microphone tested

## 🎥 Demo Script (5-7 minutes)

### Scene 1: Introduction (30 seconds)
**What to say:**
"Hi! I'm going to show you DealSniper, a smart lead enrichment and outreach platform that helps sales teams find, score, and reach out to their ideal customers. Let's see it in action!"

**What to show:**
- Navigate to `http://localhost:3000`
- Show the landing page with the DealSniper header

### Scene 2: Define ICP & Add Companies (1 minute)
**What to say:**
"First, I'll define my Ideal Customer Profile. I'm targeting B2B SaaS companies with 50-500 employees in North America that use React and Node.js."

**What to do:**
1. Fill in ICP: `B2B SaaS companies with 50-500 employees`
2. Keywords: `sales automation, CRM, outbound`
3. Region: `North America`
4. Target Tech Stack: `React, Node.js, AWS`

**What to say next:**
"Now I'll add some companies. I can just paste company names, or include full details like funding status, hiring activity, and tech stack."

**What to do:**
Paste this into the Companies field:
```
Acme Corp, acme.com, Sales software, yes, 10, yes, 5, React;Node.js
Beta Inc, beta.io, Marketing automation, no, 0, yes, 3, Python;Django
Gamma Systems, gamma.com, Analytics platform, yes, 25, yes, 12, Go;PostgreSQL;Kubernetes
```

5. Click "Add Companies & Start Processing"

### Scene 3: Processing & Enrichment (1 minute)
**What to say:**
"DealSniper is now working its magic. It's:
- Enriching contacts via FullEnrich to get emails, phones, and LinkedIn profiles
- Calculating lead scores based on funding, hiring activity, role seniority, and tech stack fit
- Generating personalized outreach messages using AI"

**What to show:**
- Point out the "Processing complete!" message
- Highlight the results table appearing

### Scene 4: Review Lead Scores (1.5 minutes)
**What to say:**
"Look at these results! Each lead has a score from 0-100 and a grade from A+ to D."

**What to show:**
Point to each company and explain:

1. **Acme Corp - Grade B+ (71 points)**
   - "Strong lead! They have funding (70), are hiring (70), contact is senior (60), and perfect tech fit (85)"
   
2. **Beta Inc - Grade D (38 points)**
   - "Lower priority. No funding (0), but hiring (60). Tech stack doesn't match our target (40)"
   
3. **Gamma Systems - Grade B (70 points)**
   - "Good lead! Significant funding (85), actively hiring (85), but lower tech fit (40)"

### Scene 5: AI-Generated Messages (1.5 minutes)
**What to say:**
"Now let's see the AI-generated outreach messages. Click 'View Messages' for Acme Corp."

**What to do:**
1. Click "View Messages" on the first row

**What to show:**
Walk through all three message types:

1. **Email Outreach**
   - "Personalized subject line and body"
   - "References their recent funding"
   - "Clear call-to-action"

2. **LinkedIn Message**
   - "Brief and professional"
   - "Under 300 characters for LinkedIn limits"
   - "Mentions their growth"

3. **Follow-up Email**
   - "Friendly and adds value"
   - "References previous outreach"
   - "Another soft CTA"

**What to say:**
"All three messages are customized based on the company's triggers and lead score."

### Scene 6: Export & Integration (1 minute)
**What to say:**
"Finally, I can export these results in multiple ways:"

**What to show:**
Point to the export buttons:

1. **CSV Export**
   - "Download all data as a spreadsheet"
   - "Perfect for manual review or uploading elsewhere"

2. **Airtable Integration**
   - "Send directly to Airtable for workflow management"

3. **HubSpot Integration**
   - "Create contacts in HubSpot CRM automatically"

**What to do:**
Click "📥 Export CSV" to demonstrate the download

### Scene 7: Wrap-up (30 seconds)
**What to say:**
"And that's DealSniper! In just a few clicks, we:
- Defined our ICP
- Enriched multiple leads with contact data
- Scored them based on buying signals
- Generated personalized outreach messages
- Exported everything for our sales team

DealSniper eliminates hours of manual research and makes outbound sales more targeted and effective. Thanks for watching!"

## 🎯 Key Points to Emphasize

1. **Time Savings**: "What used to take hours now takes minutes"
2. **Data Quality**: "Real contact information from FullEnrich"
3. **Intelligent Scoring**: "Focus on the hottest leads first"
4. **Personalization at Scale**: "AI writes custom messages for each prospect"
5. **Integration Ready**: "Works with your existing tools"

## 💡 Pro Tips for Recording

1. **Slow down**: Speak clearly and pause between sections
2. **Use your mouse**: Hover over elements you're discussing
3. **Show, don't just tell**: Click through actual features
4. **Highlight key numbers**: Point out the lead scores and grades
5. **Keep it real**: Use realistic company data
6. **Test first**: Do a practice run before recording

## 🔧 Troubleshooting

If something goes wrong during demo:

**Backend not responding:**
```bash
cd backend && npm start
```

**Frontend not loading:**
```bash
cd frontend && npm start
```

**No results showing:**
- Check browser console (F12)
- Verify backend is running on port 3001
- Check network tab for API errors

**Want to reset data:**
- Simply restart the backend server (data is in-memory)

## 📊 Sample Data Sets

### Quick Demo (3 companies)
```
Acme Corp, acme.com, Sales software, yes, 10, yes, 5, React;Node.js
Beta Inc, beta.io, Marketing automation, no, 0, yes, 3, Python;Django
Gamma Systems, gamma.com, Analytics platform, yes, 25, yes, 12, Go;PostgreSQL
```

### Extended Demo (5 companies)
```
Acme Corp, acme.com, Sales software, yes, 10, yes, 5, React;Node.js
Beta Inc, beta.io, Marketing automation, no, 0, yes, 3, Python;Django
Gamma Systems, gamma.com, Analytics platform, yes, 25, yes, 12, Go;PostgreSQL
Delta Solutions, delta.co, DevOps tools, yes, 15, yes, 8, React;AWS;Kubernetes
Epsilon Tech, epsilon.io, Cloud infrastructure, yes, 50, yes, 20, Node.js;React;TypeScript
```

### Simple Demo (just names)
```
Salesforce
HubSpot
Zendesk
Intercom
Slack
```

## 🎬 Recording Settings

**Loom Recommendations:**
- **Resolution**: 1080p
- **Frame rate**: 30fps
- **Camera**: On (picture-in-picture)
- **Microphone**: High quality
- **Browser zoom**: 100%
- **Window size**: 1400x900 or larger

## ✅ Post-Demo Checklist

After recording:
- [ ] Review the recording
- [ ] Add chapters/timestamps
- [ ] Include description with key features
- [ ] Add call-to-action
- [ ] Share link with stakeholders

---

Happy demoing! 🚀
