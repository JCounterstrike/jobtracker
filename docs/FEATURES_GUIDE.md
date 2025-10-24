# JobTracker - Features Quick Guide

## 🎉 All Week 4 Features Complete!

### 1. 🌙 Dark Mode Toggle

**Location**: Navbar (top right)  
**How to use**:

- Click the moon (🌙) or sun (☀️) icon in the navbar
- Theme persists across sessions
- Automatically detects system preference on first load

**Pages with dark mode**:

- Dashboard
- Analytics
- Calendar
- Job Details
- All forms and modals

---

### 2. ⚡ Bulk Operations

**Location**: Dashboard page  
**How to use**:

1. **Select jobs**: Click checkboxes on job cards
2. **Select All**: Use "Select All" button (shows count)
3. **Bulk Actions**: Click "⚡ Bulk Actions" button when jobs are selected

**Available actions**:

- 📥 Export as CSV
- 📄 Export as JSON
- 📞 Mark as Interview
- 🎉 Mark as Offer
- ❌ Mark as Rejected
- 🗑️ Delete Selected

---

### 3. 📥 Selective Export

**Location**: Dashboard > Bulk Actions menu  
**How to use**:

1. Select the jobs you want to export (use checkboxes)
2. Click "⚡ Bulk Actions"
3. Choose "Export as CSV" or "Export as JSON"
4. File downloads automatically

**Export formats**:

- **CSV**: Spreadsheet format with all job details
- **JSON**: Complete data with metadata (timestamp, count)

**What's exported**:

- Company, Position, Status
- Applied Date, Deadline
- Match Score, Notes
- Full Description
- Timestamps

---

### 4. 🔍 Search & Filter

**Location**: Dashboard page  
**Features**:

- **Search box**: Search company, position, or description
- **Sort dropdown**:
  - Newest First
  - Oldest First
  - Company A-Z
  - Deadline (earliest first)
- **Status filters**: ALL, APPLIED, INTERVIEW, OFFER, REJECTED

**Tips**:

- Search is real-time (instant results)
- Combine search with filters for precise results
- Results count shows matches

---

### 5. ⏰ Deadline Management

**Location**: Dashboard & Job Cards  
**Features**:

- **Overdue Jobs**: Red border with "⚠️ Overdue by X day(s)"
- **Approaching Deadlines**: Yellow border with "⏰ Deadline in X day(s)" (< 7 days)
- **Overdue Stat**: Dashboard shows total overdue count

**Visual indicators**:

- 🔴 Red = Overdue
- 🟡 Yellow = Due soon (< 7 days)
- ⚪ Normal = More than 7 days away

---

### 6. 📊 Analytics Dashboard

**Location**: Navbar > "📊 Analytics"  
**Features**:

- **Key Metrics**: Total, Success Rate, Offer Rate, Response Time
- **Charts**:
  - Applications Over Time (Line)
  - Status Breakdown (Pie)
  - Top Companies (Bar)
- **Recent Activity**: Latest 10 updates
- **AI Insights**: Personalized recommendations

**Metrics explained**:

- **Success Rate**: (Interviews + Offers) / Total
- **Offer Rate**: Offers / Total
- **Avg Response Time**: Days from application to response

---

### 7. 📅 Calendar View

**Location**: Navbar > "📅 Calendar"  
**Features**:

- **Month View**: Full month calendar grid
- **Week View**: 7-day detailed view
- **Navigation**: Prev/Next buttons, "Today" button
- **Jobs on dates**: Shows jobs on applied date + deadline date
- **Timeline List**: Chronological job list below calendar

**Color coding**:

- 🔵 Blue = Applied
- 🟡 Yellow = Interview
- 🟢 Green = Offer
- 🔴 Red = Rejected

**Interactions**:

- Click any job to view details
- Toggle between Month/Week view
- Today is highlighted with indigo ring
- Up to 3 jobs shown per day ("+X more" for overflow)

---

## Quick Actions Reference

### From Dashboard:

- **Add Job**: Click "+ Add New Job"
- **Search**: Type in search box
- **Filter**: Click status buttons (ALL, APPLIED, etc.)
- **Sort**: Use sort dropdown
- **Select Jobs**: Click checkboxes
- **Bulk Actions**: Click "⚡ Bulk Actions" (appears when jobs selected)
- **View Job**: Click "View Details" on any card
- **Delete Job**: Click "Delete" on any card

### From Job Details Page:

- **Edit**: Modify fields and save
- **AI Match**: Select resume, click "Calculate Match"
- **Get Suggestions**: Click "Generate AI Suggestions" (after matching)
- **Delete**: Click delete button

### Global Actions:

- **Toggle Dark Mode**: Click 🌙/☀️ in navbar
- **Go to Analytics**: Click "📊 Analytics" in navbar
- **Go to Calendar**: Click "📅 Calendar" in navbar
- **Upload Resume**: Click "Resumes" in navbar

---

## Keyboard Shortcuts (Future Enhancement)

Suggested for future implementation:

- `Ctrl/Cmd + K`: Quick search
- `Ctrl/Cmd + N`: New job
- `Ctrl/Cmd + D`: Toggle dark mode
- `Ctrl/Cmd + A`: Select all
- `Esc`: Close modals/dropdowns

---

## Pro Tips 💡

1. **Use Bulk Operations**: Save time by updating multiple jobs at once
2. **Set Deadlines**: Add deadlines to all jobs for better tracking
3. **Check Analytics Weekly**: Monitor your application success rate
4. **Use Calendar View**: Visualize your application timeline
5. **Export Regularly**: Backup your data with exports
6. **Search is Powerful**: Search works across all job fields
7. **Sort by Deadline**: Keep urgent applications at the top
8. **Dark Mode for Night Work**: Easier on the eyes in low light

---

## Troubleshooting

### Dark mode not persisting?

- Check browser localStorage is enabled
- Try clearing cache and toggling again

### Bulk actions not showing?

- Make sure you've selected at least one job (checkbox)
- Look for the purple "⚡ Bulk Actions" button

### Export file not downloading?

- Check browser popup blocker settings
- Ensure you have jobs selected
- Try a different browser

### Calendar not showing jobs?

- Verify jobs have applied dates set
- Check if you're viewing the correct month/week
- Try clicking "Today" to reset view

---

## What's Next?

Potential future enhancements:

- 📧 Email notifications for deadlines
- 🔔 Browser push notifications
- 📱 Mobile app version
- 🤝 Contact/referral tracking
- 💰 Salary tracking
- 📝 Interview notes
- 🎯 Application goals and tracking
- 📈 Advanced analytics and predictions

---

**Need help?** All features are intuitive and include visual feedback. Hover over buttons for additional context!

**Enjoying JobTracker?** Share your feedback for future improvements!
