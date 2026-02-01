# Layout Guard Rails - DO NOT BREAK THESE PATTERNS

## ⚠️ CRITICAL: Read This First

This document exists because these exact layout patterns were implemented incorrectly **multiple times** in a row. Before making ANY changes to layout or structure in these files, **verify against this document first**.

---

## Multi-Subscription Flow Files

### Files Covered
- `v2-subscription-overview-multi.html` (Overview page)
- `v2-modify-users-workflow-multi.html` (Zone selection page)

### Figma References
- **Zone Selection:** `https://figma.com/design/.../703-55357` and `1485-48316`
- **Always check Figma first** if user mentions the design is wrong

---

## ❌ CRITICAL MISTAKES TO AVOID

### Mistake #1: Wrong Right Panel Structure
**WRONG - DO NOT DO THIS:**
```html
<!-- DON'T put buttons outside the cards -->
<div class="subscription-card">
  <div class="subscription-title">Pro Seats</div>
  <!-- content -->
</div>
<div style="display: flex; gap: 12px;">
  <button>Add Selected User(s)</button>
  <button>Modify Selected Users</button>
</div>
```

**CORRECT - REQUIRED STRUCTURE:**
```html
<!-- Buttons MUST be inside each subscription card -->
<div class="subscription-card">
  <div class="subscription-title">Project Intelligence Pro Seats</div>
  <!-- content -->
  <div class="seat-bar"><div class="seat-fill" style="width: 35%"></div></div>
  
  <!-- BUTTONS INSIDE THE CARD -->
  <div style="display: flex; gap: 12px; margin-top: 16px;">
    <button class="btn btn-secondary" id="addSelectedProBtn" disabled>Add Selected User(s)</button>
    <button class="btn btn-secondary" id="modifySelectedProBtn" disabled>Modify Selected Users</button>
  </div>
</div>

<!-- SEPARATE CARD for Starter -->
<div class="subscription-card">
  <div class="subscription-title">Project Intelligence Starter Seats</div>
  <!-- content -->
  <div class="seat-bar"><div class="seat-fill" style="width: 35%"></div></div>
  
  <!-- BUTTONS INSIDE THIS CARD TOO -->
  <div style="display: flex; gap: 12px; margin-top: 16px;">
    <button class="btn btn-secondary" id="addSelectedStarterBtn" disabled>Add Selected User(s)</button>
    <button class="btn btn-secondary" id="modifySelectedStarterBtn" disabled>Modify Selected Users</button>
  </div>
</div>
```

**Why This Matters:**
- Each subscription (Pro/Starter) must have its OWN set of buttons
- Buttons are contextually tied to that specific subscription type
- Visual hierarchy: buttons belong to the card they act upon

---

### Mistake #2: Wrong PRO Badge Placement

**WRONG - DO NOT DO THIS:**
```html
<!-- DON'T put PRO badge outside the zone-counter -->
<span class="zone-badge">
  Full Access 
  <span class="pro-badge">PRO</span>
  <span class="zone-counter"></span>
</span>

<!-- DON'T put it before the zone-badge -->
<span class="pro-badge">PRO</span>
<span class="zone-badge">Full Access</span>

<!-- DON'T put it as a separate element -->
<span class="zone-badge">Modified</span>
<span class="pro-badge">PRO</span>
<span class="zone-counter">123</span>
```

**CORRECT - REQUIRED STRUCTURE:**

**Full Access with PRO:**
```html
<span class="zone-badge">
  Full Access 
  <span class="zone-counter">
    <span class="pro-badge">PRO</span>
  </span>
</span>
```

**Modified Access with PRO:**
```html
<span class="zone-badge">
  Modified 
  <span class="zone-counter">
    <span class="pro-badge">PRO</span> - 123
  </span>
</span>
```

**Full Access without PRO (Starter):**
```html
<span class="zone-badge">Full Access</span>
```

**Modified Access without PRO (Starter):**
```html
<span class="zone-badge">
  Modified 
  <span class="zone-counter">123</span>
</span>
```

**Why This Matters:**
- The PRO badge MUST be inside the white zone-counter bubble
- The zone-counter is the white circular background
- PRO badge is NEVER outside or separate from zone-counter
- This was corrected 5+ times - the badge goes INSIDE

---

### Mistake #3: Creating Single Combined Card Instead of Two Separate Cards

**WRONG - DO NOT DO THIS:**
```html
<div class="subscription-card">
  <div>Pro Subscription: 7/20 seats</div>
  <div>Starter Subscription: 7/20 seats</div>
  <button>Add Selected User(s)</button>
  <button>Modify Selected Users</button>
</div>
```

**CORRECT - TWO SEPARATE CARDS:**
```html
<!-- Card 1: Pro -->
<div class="subscription-card">
  <div class="subscription-title">Project Intelligence Pro Seats</div>
  <!-- Pro-specific content -->
  <div style="display: flex; gap: 12px; margin-top: 16px;">
    <button id="addSelectedProBtn">Add Selected User(s)</button>
    <button id="modifySelectedProBtn">Modify Selected Users</button>
  </div>
</div>

<!-- Card 2: Starter (SEPARATE CARD) -->
<div class="subscription-card">
  <div class="subscription-title">Project Intelligence Starter Seats</div>
  <!-- Starter-specific content -->
  <div style="display: flex; gap: 12px; margin-top: 16px;">
    <button id="addSelectedStarterBtn">Add Selected User(s)</button>
    <button id="modifySelectedStarterBtn">Modify Selected Users</button>
  </div>
</div>
```

**Why This Matters:**
- Pro and Starter are completely separate subscription products
- Each needs its own visual container and action buttons
- Users must clearly see which buttons control which subscription

---

## ✅ CORRECT PATTERNS - DO NOT CHANGE

### Pattern 1: Default View in v2-modify-users-workflow-multi.html

**Location:** Lines 244-300  
**Purpose:** Shows when no users are selected

```html
<div id="defaultView">
  <div class="content-wrapper">
    <!-- Pro Subscription Card -->
    <div class="subscription-card">
      <div class="subscription-title">Project Intelligence Pro Seats</div>
      <div class="subscription-subtitle">
        Your current assigned seats for Project Intelligence Pro include:
      </div>
      <ul style="margin: 12px 0 12px 20px; font-size: 13px; line-height: 1.8; color: #666;">
        <li>1 Full access</li>
        <li>1 Modified</li>
      </ul>
      <div style="font-size: 13px; line-height: 1.6; color: #666; margin-bottom: 16px;">
        <p style="margin-bottom: 8px;">By clicking 'add' you assign a seat and provide the user full access.</p>
        <p>Once a user has been added, you can then modify their access to specific counties.</p>
      </div>
      <div class="seat-info">
        7 / 20 Seats - 13 seats available
        <div class="info-icon">
          i
          <div class="tooltip">Assigning geography to a user activates one seat.</div>
        </div>
      </div>
      <div class="seat-bar"><div class="seat-fill" style="width: 35%"></div></div>
      
      <!-- Buttons INSIDE the Pro card -->
      <div style="display: flex; gap: 12px; margin-top: 16px;">
        <button class="btn btn-secondary" id="addSelectedProBtn" disabled onclick="addSelectedUsers('Pro')">Add Selected User(s)</button>
        <button class="btn btn-secondary" id="modifySelectedProBtn" disabled onclick="showModifyView('Pro')">Modify Selected Users</button>
      </div>
    </div>

    <!-- Starter Subscription Card (SEPARATE CARD) -->
    <div class="subscription-card">
      <div class="subscription-title">Project Intelligence Starter Seats</div>
      <div class="subscription-subtitle">
        Your current assigned seats for Project Intelligence Starter include:
      </div>
      <ul style="margin: 12px 0 12px 20px; font-size: 13px; line-height: 1.8; color: #666;">
        <li>1 Full access</li>
        <li>1 Modified</li>
      </ul>
      <div style="font-size: 13px; line-height: 1.6; color: #666; margin-bottom: 16px;">
        <p style="margin-bottom: 8px;">By clicking 'add' you assign a seat and provide the user full access.</p>
        <p>Once a user has been added, you can then modify their access to specific counties.</p>
      </div>
      <div class="seat-info">
        7 / 20 Seats - 13 seats available
        <div class="info-icon">
          i
          <div class="tooltip">Assigning geography to a user activates one seat.</div>
        </div>
      </div>
      <div class="seat-bar"><div class="seat-fill" style="width: 35%"></div></div>
      
      <!-- Buttons INSIDE the Starter card -->
      <div style="display: flex; gap: 12px; margin-top: 16px;">
        <button class="btn btn-secondary" id="addSelectedStarterBtn" disabled onclick="addSelectedUsers('Starter')">Add Selected User(s)</button>
        <button class="btn btn-secondary" id="modifySelectedStarterBtn" disabled onclick="showModifyView('Starter')">Modify Selected Users</button>
      </div>
    </div>
  </div>
</div>
```

**DO NOT:**
- Combine these into one card
- Move buttons outside the cards
- Remove the subscription-specific content
- Change the button IDs (they control enable/disable logic)

---

### Pattern 2: PRO Badge Rendering in User Table

**Location:** Lines 467-488 in v2-modify-users-workflow-multi.html  
**Purpose:** Display user geography with PRO badges

```javascript
var zoneHtml = '';
if(u.accessType === 'none') {
  zoneHtml = '<span class="zone-badge no-access">No Access</span>';
} else if(u.accessType === 'full') {
  // Full Access with PRO badge in white container INSIDE the pill
  zoneHtml = '<span class="zone-badge">Full Access';
  if(u.subscription === 'Pro') {
    // PRO badge INSIDE zone-counter
    zoneHtml += ' <span class="zone-counter"><span class="pro-badge">PRO</span></span>';
  }
  zoneHtml += '</span>';
} else if(u.accessType === 'modified' && u.zoneCount) {
  // Modified with counter containing PRO - number
  zoneHtml = '<span class="zone-badge">Modified <span class="zone-counter">';
  if(u.subscription === 'Pro') {
    // PRO badge INSIDE zone-counter, BEFORE the dash and number
    zoneHtml += '<span class="pro-badge">PRO</span> - ';
  }
  zoneHtml += u.zoneCount + '</span></span>';
}
```

**DO NOT:**
- Move PRO badge outside zone-counter
- Put PRO badge before zone-badge
- Create separate elements for PRO badge
- Change the order of PRO - number
- Remove the space and dash between PRO and number

---

### Pattern 3: Button Enable Logic

**Location:** Lines 625-690 in v2-modify-users-workflow-multi.html  
**Purpose:** Context-aware button enabling

```javascript
function updateRightPanel() {
  // Count selected users by type and subscription
  var selectedNoAccess = 0;
  var selectedPro = 0;
  var selectedStarter = 0;
  
  for(var i = 0; i < data.users.length; i++) {
    if(sel.users[data.users[i].id]) {
      if(data.users[i].accessType === 'none') selectedNoAccess++;
      if(data.users[i].subscription === 'Pro') selectedPro++;
      if(data.users[i].subscription === 'Starter') selectedStarter++;
    }
  }
  
  // Pro buttons
  var addProBtn = document.getElementById('addSelectedProBtn');
  var modifyProBtn = document.getElementById('modifySelectedProBtn');
  
  if(addProBtn) {
    // Enable ONLY if: selecting no-access users AND no Starter users
    addProBtn.disabled = !(selectedNoAccess > 0 && selectedStarter === 0);
  }
  if(modifyProBtn) {
    // Enable ONLY if: selecting Pro users AND no Starter AND no No-Access
    modifyProBtn.disabled = !(selectedPro > 0 && selectedStarter === 0 && selectedNoAccess === 0);
  }
  
  // Starter buttons
  var addStarterBtn = document.getElementById('addSelectedStarterBtn');
  var modifyStarterBtn = document.getElementById('modifySelectedStarterBtn');
  
  if(addStarterBtn) {
    // Enable ONLY if: selecting no-access users AND no Pro users
    addStarterBtn.disabled = !(selectedNoAccess > 0 && selectedPro === 0);
  }
  if(modifyStarterBtn) {
    // Enable ONLY if: selecting Starter users AND no Pro AND no No-Access
    modifyStarterBtn.disabled = !(selectedStarter > 0 && selectedPro === 0 && selectedNoAccess === 0);
  }
  
  // Auto-return to default view when no users selected
  var selectedUsers = [];
  for(var i = 0; i < data.users.length; i++) {
    if(sel.users[data.users[i].id]) selectedUsers.push(data.users[i]);
  }
  
  if(selectedUsers.length === 0) {
    document.getElementById('defaultView').style.display = 'flex';
    document.getElementById('zoneSelectionView').style.display = 'none';
  }
}
```

**DO NOT:**
- Remove the subscription type checks
- Change the logic to allow mixed Pro/Starter selections
- Remove the auto-return to default view
- Simplify the conditions (they prevent critical errors)

---

## 🎯 Verification Checklist

Before making ANY layout changes to these files, verify:

### For Right Panel Default View:
- [ ] Are there TWO separate subscription cards?
- [ ] Does each card have its own set of buttons INSIDE the card?
- [ ] Are the button IDs unique (addSelectedProBtn vs addSelectedStarterBtn)?
- [ ] Do buttons have onclick handlers with subscription type parameter?
- [ ] Is the card structure identical to the pattern above?

### For PRO Badge Display:
- [ ] Is the PRO badge INSIDE the zone-counter span?
- [ ] Is the zone-counter the white circular background?
- [ ] For Full Access: Is it `<zone-counter><pro-badge>PRO</pro-badge></zone-counter>`?
- [ ] For Modified: Is it `<zone-counter><pro-badge>PRO</pro-badge> - 123</zone-counter>`?
- [ ] Is there NO PRO badge outside the zone-counter?

### For Button Logic:
- [ ] Do Pro buttons check for selectedStarter === 0?
- [ ] Do Starter buttons check for selectedPro === 0?
- [ ] Does modify logic exclude No Access users?
- [ ] Does add logic require No Access users?
- [ ] Is there auto-return when selectedUsers.length === 0?

---

## 📋 What Went Wrong (Historical Context)

### Round 1: Created single combined card
- Made one card showing both subscriptions
- Buttons were shared, not subscription-specific
- **Fix:** Split into two separate cards

### Round 2: Buttons outside cards
- Created two cards but put buttons in a separate div below
- Lost visual hierarchy and context
- **Fix:** Moved buttons inside each card

### Round 3: PRO badge outside zone-counter
- Put PRO badge as sibling to zone-counter
- Didn't match Figma design (badge not in white bubble)
- **Fix:** Moved PRO badge inside zone-counter span

### Round 4-5: Various PRO badge placement attempts
- Tried before zone-badge, after zone-badge, separate element
- User repeatedly said "IN THE SAME AREA AS THE NUMBER"
- **Fix:** Finally placed inside zone-counter with the number

### Round 6: Forgot to update single subscription file
- Fixed multi file but left single file with old drawer content
- User thought changes didn't work
- **Fix:** Updated all four files (both overview, both workflow)

---

## 🚨 Red Flags to Watch For

If you see these in a proposed change, **STOP and reconsider:**

1. **"Let's simplify by combining the cards"** ❌
   - No. Two separate cards required.

2. **"We can move the buttons outside to reduce duplication"** ❌
   - No. Buttons must be inside their respective cards.

3. **"The PRO badge would look better here"** ❌
   - No. PRO badge goes inside zone-counter only.

4. **"We could make one button control both subscriptions"** ❌
   - No. Each subscription needs its own buttons.

5. **"This button logic is complex, let's simplify"** ❌
   - No. The complexity prevents critical UX errors.

---

## 📖 When to Reference This Document

**ALWAYS check this document when:**
- User mentions Figma design
- Making changes to right panel layout in workflow files
- Modifying PRO badge rendering
- Changing button enable/disable logic
- User says "you did it wrong"
- User references subscription cards or buttons
- Editing lines 244-300 or 467-488 or 625-690 in v2-modify-users-workflow-multi.html

**If user says:**
- "This is wrong" → Check this document
- "Look at Figma" → Check this document + Figma
- "You're not paying attention" → Check this document immediately
- "Why are you changing this" → Check this document before responding

---

## 💡 Best Practices Moving Forward

1. **Read the entire Figma design first** before coding
2. **Match the structure exactly** - don't "improve" or "simplify"
3. **Buttons belong to cards** - keep them together visually and structurally
4. **PRO badge is content, not decoration** - it must be inside zone-counter
5. **Two products = two cards** - Pro and Starter are separate
6. **Context-aware logic exists for a reason** - don't remove safety checks
7. **When in doubt, preserve existing working patterns**

---

## 📞 Contact

If you need to make structural changes that conflict with this document, **consult the UX team first**. These patterns were established through multiple iterations and user feedback.

**Last Updated:** January 16, 2026  
**Created After:** 6+ rounds of layout corrections  
**Purpose:** Prevent repeating the same mistakes
