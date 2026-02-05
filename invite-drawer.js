// Invite Users Drawer JavaScript - Shared across all pages

// Drawer functions
function openInviteDrawer() {
  document.getElementById('inviteDrawer').classList.add('active');
  document.getElementById('drawerOverlay').classList.add('active');
  loadIndividualMode();
}

function closeInviteDrawer() {
  document.getElementById('inviteDrawer').classList.remove('active');
  document.getElementById('drawerOverlay').classList.remove('active');
}

// Toggle modes
function loadIndividualMode() {
  const content = document.getElementById('drawerContent');
  content.innerHTML = `
    <!-- Column 1: User Information -->
    <div style="width: 418px; display: flex; flex-direction: column;">
      <div style="padding: 10px 5px; border-bottom: 2px solid #4a4f55; height: 38px; display: flex; align-items: center;">
        <span style="font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 12px; line-height: 14px; color: #4a4f55;">User Information</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 13px; margin-top: 13px;">
        <div style="display: flex; gap: 10px;">
          <div style="width: 204px; display: flex; flex-direction: column; gap: 3px;">
            <label style="font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 12px; line-height: 14px; color: #1c1f22;">First Name <span style="color: #b70900;">*</span></label>
            <input type="text" style="background: #fffffa; border: 1px solid #dad8d7; border-radius: 4px; height: 32px; padding: 8px 7px; font-family: 'Montserrat', sans-serif; font-weight: 500; font-size: 14px; line-height: 16px; color: #1c1f22; width: 100%;" placeholder="First Name">
          </div>
          <div style="width: 204px; display: flex; flex-direction: column; gap: 3px;">
            <label style="font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 12px; line-height: 14px; color: #1c1f22;">Last Name <span style="color: #b70900;">*</span></label>
            <input type="text" style="background: #fffffa; border: 1px solid #dad8d7; border-radius: 4px; height: 32px; padding: 8px 7px; font-family: 'Montserrat', sans-serif; font-weight: 500; font-size: 14px; line-height: 16px; color: #1c1f22; width: 100%;" placeholder="Last Name">
          </div>
        </div>
        <div style="display: flex; gap: 10px;">
          <div style="width: 204px; display: flex; flex-direction: column; gap: 3px;">
            <label style="font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 12px; line-height: 14px; color: #1c1f22;">Role</label>
            <div style="position: relative;">
              <select style="background: #fffffa; border: 1px solid #dad8d7; border-radius: 4px; height: 32px; padding: 3px 7px 0; font-family: 'Montserrat', sans-serif; font-weight: 500; font-size: 14px; line-height: 16px; color: #88888e; width: 100%; cursor: pointer; appearance: none;">
                <option>Team Member</option>
              </select>
              <i class="fa-regular fa-chevron-down" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); font-size: 14px; color: #4a4f55; pointer-events: none;"></i>
            </div>
          </div>
          <div style="width: 204px; display: flex; flex-direction: column; gap: 3px;">
            <label style="font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 12px; line-height: 14px; color: #1c1f22;">Title</label>
            <input type="text" style="background: #fffffa; border: 1px solid #dad8d7; border-radius: 4px; height: 32px; padding: 8px 7px; font-family: 'Montserrat', sans-serif; font-weight: 500; font-size: 14px; line-height: 16px; color: #1c1f22; width: 100%;" placeholder="Title">
          </div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 3px; width: 100%;">
          <label style="font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 12px; line-height: 14px; color: #1c1f22;">Email Address <span style="color: #b70900;">*</span></label>
          <input type="email" style="background: #fffffa; border: 1px solid #dad8d7; border-radius: 4px; height: 32px; padding: 8px 7px; font-family: 'Montserrat', sans-serif; font-weight: 500; font-size: 14px; line-height: 16px; color: #1c1f22; width: 100%;" placeholder="username@email.com">
        </div>
        <div style="display: flex; flex-direction: column; gap: 3px; width: 100%;">
          <label style="font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 12px; line-height: 14px; color: #1c1f22;">Phone Number</label>
          <input type="tel" style="background: #fffffa; border: 1px solid #dad8d7; border-radius: 4px; height: 32px; padding: 8px 7px; font-family: 'Montserrat', sans-serif; font-weight: 500; font-size: 14px; line-height: 16px; color: #1c1f22; width: 100%;" placeholder="(000) 000-0000">
        </div>
      </div>
    </div>
    
    <!-- Column 2: License(s) -->
    <div style="width: 218px; display: flex; flex-direction: column;">
      <div style="padding: 10px 5px; border-bottom: 2px solid #4a4f55; height: 38px; display: flex; align-items: center;">
        <span style="font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 12px; line-height: 14px; color: #4a4f55;">License(s)</span>
      </div>
      <div style="margin-top: 13px; display: flex; justify-content: flex-start;">
        <button style="background: #e7e6e5; border: none; border-radius: 30px; height: 26px; padding: 6px 8px; font-family: 'Montserrat', sans-serif; font-weight: 600; font-size: 12px; line-height: 14px; color: #1c1f22; cursor: pointer; display: flex; align-items: center; gap: 6px;">
          <i class="fa-regular fa-briefcase" style="font-size: 12px;"></i>
          Bid Center
        </button>
      </div>
    </div>
    
    <!-- Column 3: License Tables -->
    <div style="width: 365px; display: flex; flex-direction: column; gap: 20px;">
      ${getLicenseTablesHTML()}
    </div>
  `;
}

function loadBulkMode() {
  const content = document.getElementById('drawerContent');
  content.innerHTML = `
    <!-- Column 1: Upload Instructions -->
    <div style="width: 418px; display: flex; flex-direction: column; background: #ffffff; padding: 10px 30px; gap: 10px;">
      <div style="font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 14px; line-height: 16px; color: #1c1f22;">
        To invite multiple users to this company's account:
      </div>
      
      <ul style="margin: 0; padding-left: 20px; font-family: 'Montserrat', sans-serif; font-weight: 500; font-size: 14px; line-height: 16px; color: #1c1f22;">
        <li style="margin-bottom: 8px;">Download the template and complete the required fields: First Name, Last Name, and Email</li>
        <li style="margin-bottom: 8px;">Save as .xls or .csv format</li>
        <li>Upload your file to invite the users listed in your file</li>
      </ul>
      
      <div style="display: flex; gap: 10px; margin-top: 10px;">
        <button class="btn-ghost" style="height: 32px; padding: 8px; border: 1px solid #88888e; border-radius: 4px; background: transparent; font-family: 'Montserrat', sans-serif; font-weight: 500; font-size: 14px; line-height: 16px; color: #4a4f55; cursor: pointer; display: flex; align-items: center;">
          Download Template
        </button>
        <button class="btn-secondary" style="height: 32px; padding: 8px; border-radius: 4px; background: #e7e6e5; font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 14px; line-height: 16px; color: #4a4f55; cursor: pointer; display: flex; align-items: center; border: none;">
          Upload File
        </button>
      </div>
    </div>
    
    <!-- Spacer to align license tables with Individual Mode -->
    <div style="width: 233px;"></div>
    
    <!-- Column 2: License Tables (same width and position as Individual Mode) -->
    <div style="width: 365px; display: flex; flex-direction: column; gap: 20px;">
      ${getLicenseTablesHTML()}
    </div>
  `;
}

function getLicenseTablesHTML() {
  return `
    <!-- Project Intelligence Licenses Table -->
    <div style="display: flex; flex-direction: column;">
      <div style="background: #f4f4f4; border-bottom: 2px solid #88888e; padding: 8px 10px; display: flex; justify-content: space-between; align-items: center; height: 40px;">
        <div style="display: flex; align-items: center; gap: 4px;">
          <span style="font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 12px; line-height: 14px; color: #4a4f55;">Project Intelligence Licenses</span>
          <div style="background: #185a7d; border-radius: 20px; padding: 2px 6px; display: flex; align-items: center; justify-content: center;">
            <span style="font-family: 'Montserrat', sans-serif; font-weight: 600; font-size: 12px; line-height: 14px; color: #ffffff;">31</span>
          </div>
        </div>
        <button class="btn-ghost" style="height: 32px; padding: 8px; border: 1px solid #88888e; border-radius: 4px; background: transparent; font-family: 'Montserrat', sans-serif; font-weight: 500; font-size: 14px; line-height: 16px; color: #4a4f55; cursor: pointer;">
          View Info
        </button>
      </div>
      
      <div style="display: flex;">
        <div style="width: 185px; display: flex; flex-direction: column;">
          <div style="background: #ffffff; border-bottom: 2px solid #4a4f55; padding: 8px 10px; height: 38px; display: flex; align-items: center;">
            <span style="font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 12px; line-height: 14px; color: #4a4f55;">Feature</span>
          </div>
          <div style="border-bottom: 1px solid #dad8d7; padding: 8px 10px; height: 38px; display: flex; align-items: center; gap: 5px;">
            <span style="font-family: 'Montserrat', sans-serif; font-weight: 500; font-size: 14px; line-height: 18px; color: #4a4f55;">NY - Nassau / Suffolk</span>
          </div>
          <div style="border-bottom: 1px solid #dad8d7; padding: 8px 10px; height: 38px; display: flex; align-items: center; gap: 5px;">
            <span style="font-family: 'Montserrat', sans-serif; font-weight: 500; font-size: 14px; line-height: 18px; color: #4a4f55;">NY - Long Island</span>
          </div>
          <div style="border-bottom: 1px solid #dad8d7; padding: 8px 10px; height: 38px; display: flex; align-items: center; gap: 5px;">
            <span style="font-family: 'Montserrat', sans-serif; font-weight: 500; font-size: 14px; line-height: 18px; color: #4a4f55;">PA - Philadelphia</span>
          </div>
          <div style="border-bottom: 1px solid #dad8d7; padding: 8px 10px; height: 38px; display: flex; align-items: center; gap: 5px;">
            <span style="font-family: 'Montserrat', sans-serif; font-weight: 500; font-size: 14px; line-height: 18px; color: #4a4f55;">PA - Keystone</span>
          </div>
        </div>
        
        <div style="width: 170px; display: flex; flex-direction: column;">
          <div style="background: #ffffff; border-bottom: 2px solid #4a4f55; padding: 8px 10px; height: 38px; display: flex; align-items: center;">
            <span style="font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 12px; line-height: 14px; color: #4a4f55;">Availability</span>
          </div>
          <div style="border-bottom: 1px solid #dad8d7; padding: 8px 10px 8px 0; height: 38px; display: flex; align-items: center; justify-content: flex-end; gap: 6px;">
            <div style="background: #e7e6e5; border-radius: 30px; padding: 6px 8px; height: 26px; display: flex; align-items: center;">
              <span style="font-family: 'Montserrat', sans-serif; font-weight: 600; font-size: 12px; line-height: 14px; color: #1c1f22;">2 Available</span>
            </div>
            <button style="background: transparent; border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">
              <i class="fa-regular fa-plus" style="font-size: 18px; color: #4a4f55;"></i>
            </button>
          </div>
          <div style="border-bottom: 1px solid #dad8d7; padding: 8px 10px 8px 0; height: 38px; display: flex; align-items: center; justify-content: flex-end; gap: 6px;">
            <div style="background: #e7e6e5; border-radius: 30px; padding: 6px 8px; height: 26px; display: flex; align-items: center;">
              <span style="font-family: 'Montserrat', sans-serif; font-weight: 600; font-size: 12px; line-height: 14px; color: #1c1f22;">3 Available</span>
            </div>
            <button style="background: transparent; border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">
              <i class="fa-regular fa-plus" style="font-size: 18px; color: #4a4f55;"></i>
            </button>
          </div>
          <div style="border-bottom: 1px solid #dad8d7; padding: 8px 10px 8px 0; height: 38px; display: flex; align-items: center; justify-content: flex-end; gap: 6px;">
            <div style="background: #e7e6e5; border-radius: 30px; padding: 6px 8px; height: 26px; display: flex; align-items: center;">
              <span style="font-family: 'Montserrat', sans-serif; font-weight: 600; font-size: 12px; line-height: 14px; color: #1c1f22;">6 Available</span>
            </div>
            <button style="background: transparent; border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">
              <i class="fa-regular fa-plus" style="font-size: 18px; color: #4a4f55;"></i>
            </button>
          </div>
          <div style="border-bottom: 1px solid #dad8d7; padding: 8px 10px 8px 0; height: 38px; display: flex; align-items: center; justify-content: flex-end; gap: 6px;">
            <div style="background: #e7e6e5; border-radius: 30px; padding: 6px 8px; height: 26px; display: flex; align-items: center;">
              <span style="font-family: 'Montserrat', sans-serif; font-weight: 600; font-size: 12px; line-height: 14px; color: #1c1f22;">6 Available</span>
            </div>
            <button style="background: transparent; border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">
              <i class="fa-regular fa-plus" style="font-size: 18px; color: #4a4f55;"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Takeoff & Estimating Licenses Table -->
    <div style="display: flex; flex-direction: column;">
      <div style="background: #f4f4f4; border-bottom: 2px solid #88888e; padding: 8px 10px; display: flex; justify-content: space-between; align-items: center; height: 40px;">
        <div style="display: flex; align-items: center; gap: 4px;">
          <span style="font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 12px; line-height: 14px; color: #4a4f55;">Takeoff & Estimating Licenses</span>
          <div style="background: #185a7d; border-radius: 20px; padding: 2px 6px; display: flex; align-items: center; justify-content: center;">
            <span style="font-family: 'Montserrat', sans-serif; font-weight: 600; font-size: 12px; line-height: 14px; color: #ffffff;">31</span>
          </div>
        </div>
        <button class="btn-ghost" style="height: 32px; padding: 8px; border: 1px solid #88888e; border-radius: 4px; background: transparent; font-family: 'Montserrat', sans-serif; font-weight: 500; font-size: 14px; line-height: 16px; color: #4a4f55; cursor: pointer;">
          View Info
        </button>
      </div>
      
      <div style="display: flex;">
        <div style="width: 185px; display: flex; flex-direction: column;">
          <div style="background: #ffffff; border-bottom: 2px solid #4a4f55; padding: 8px 10px; height: 38px; display: flex; align-items: center;">
            <span style="font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 12px; line-height: 14px; color: #4a4f55;">Product</span>
          </div>
          <div style="border-bottom: 1px solid #dad8d7; padding: 8px 10px; height: 38px; display: flex; align-items: center; gap: 5px;">
            <span style="font-family: 'Montserrat', sans-serif; font-weight: 500; font-size: 14px; line-height: 18px; color: #4a4f55;">OnScreen Takeoff</span>
          </div>
          <div style="border-bottom: 1px solid #dad8d7; padding: 8px 10px; height: 38px; display: flex; align-items: center; gap: 5px;">
            <span style="font-family: 'Montserrat', sans-serif; font-weight: 500; font-size: 14px; line-height: 18px; color: #4a4f55;">OnScreen Takeoff with AI</span>
          </div>
          <div style="border-bottom: 1px solid #dad8d7; padding: 8px 10px; height: 38px; display: flex; align-items: center; gap: 5px;">
            <span style="font-family: 'Montserrat', sans-serif; font-weight: 500; font-size: 14px; line-height: 18px; color: #4a4f55;">OST Planviewer</span>
          </div>
          <div style="border-bottom: 1px solid #dad8d7; padding: 8px 10px; height: 38px; display: flex; align-items: center; gap: 5px;">
            <span style="font-family: 'Montserrat', sans-serif; font-weight: 500; font-size: 14px; line-height: 18px; color: #4a4f55;">QuickBid</span>
          </div>
        </div>
        
        <div style="width: 170px; display: flex; flex-direction: column;">
          <div style="background: #ffffff; border-bottom: 2px solid #4a4f55; padding: 8px 10px; height: 38px; display: flex; align-items: center;">
            <span style="font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 12px; line-height: 14px; color: #4a4f55;">Availability</span>
          </div>
          <div style="border-bottom: 1px solid #dad8d7; padding: 8px 10px 8px 0; height: 38px; display: flex; align-items: center; justify-content: flex-end; gap: 6px;">
            <div style="background: #e7e6e5; border-radius: 30px; padding: 6px 8px; height: 26px; display: flex; align-items: center;">
              <span style="font-family: 'Montserrat', sans-serif; font-weight: 600; font-size: 12px; line-height: 14px; color: #1c1f22;">3 Available</span>
            </div>
            <button style="background: transparent; border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">
              <i class="fa-regular fa-plus" style="font-size: 18px; color: #4a4f55;"></i>
            </button>
          </div>
          <div style="border-bottom: 1px solid #dad8d7; padding: 8px 10px 8px 0; height: 38px; display: flex; align-items: center; justify-content: flex-end; gap: 6px;">
            <div style="background: #e7e6e5; border-radius: 30px; padding: 6px 8px; height: 26px; display: flex; align-items: center;">
              <span style="font-family: 'Montserrat', sans-serif; font-weight: 600; font-size: 12px; line-height: 14px; color: #1c1f22;">1 Available</span>
            </div>
            <button style="background: transparent; border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">
              <i class="fa-regular fa-plus" style="font-size: 18px; color: #4a4f55;"></i>
            </button>
          </div>
          <div style="border-bottom: 1px solid #dad8d7; padding: 8px 10px 8px 0; height: 38px; display: flex; align-items: center; justify-content: flex-end; gap: 6px;">
            <div style="background: #e7e6e5; border-radius: 30px; padding: 6px 8px; height: 26px; display: flex; align-items: center;">
              <span style="font-family: 'Montserrat', sans-serif; font-weight: 600; font-size: 12px; line-height: 14px; color: #1c1f22;">6 Available</span>
            </div>
            <button style="background: transparent; border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">
              <i class="fa-regular fa-plus" style="font-size: 18px; color: #4a4f55;"></i>
            </button>
          </div>
          <div style="border-bottom: 1px solid #dad8d7; padding: 8px 10px 8px 0; height: 38px; display: flex; align-items: center; justify-content: flex-end; gap: 6px;">
            <div style="background: #e7e6e5; border-radius: 30px; padding: 6px 8px; height: 26px; display: flex; align-items: center;">
              <span style="font-family: 'Montserrat', sans-serif; font-weight: 600; font-size: 12px; line-height: 14px; color: #1c1f22;">6 Available</span>
            </div>
            <button style="background: transparent; border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">
              <i class="fa-regular fa-plus" style="font-size: 18px; color: #4a4f55;"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function toggleInviteMode() {
  const toggle = document.getElementById('inviteModeToggle');
  
  toggle.classList.toggle('bulk');
  if (toggle.classList.contains('bulk')) {
    // Switch to Bulk Mode
    toggle.style.justifyContent = 'flex-end';
    loadBulkMode();
  } else {
    // Switch to Individual Mode
    toggle.style.justifyContent = 'flex-start';
    loadIndividualMode();
  }
}

// Close drawer when clicking overlay
document.addEventListener('DOMContentLoaded', function() {
  const overlay = document.getElementById('drawerOverlay');
  if (overlay) {
    overlay.addEventListener('click', function() {
      closeInviteDrawer();
    });
  }
});
