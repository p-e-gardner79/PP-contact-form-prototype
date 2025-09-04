document.addEventListener('DOMContentLoaded', function() {
    // --- HEADER SCRIPT ---
    const mainNav = document.querySelector('.main-nav');
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    if (mobileNavToggle && mainNav) {
        mobileNavToggle.addEventListener('click', function() {
            const isOpen = mainNav.classList.toggle('is-open');
            mobileNavToggle.setAttribute('aria-expanded', isOpen);
        });
    }
    const megaMenuItems = document.querySelectorAll('.main-nav .mega-menu-item');
    megaMenuItems.forEach(menuItem => {
        const link = menuItem.querySelector('a');
        if (link) {
            link.addEventListener('click', function(event) {
                if (window.innerWidth < 992 && menuItem.querySelector('.mega-menu')) {
                    event.preventDefault();
                    megaMenuItems.forEach(item => { if (item !== menuItem) { item.classList.remove('is-open'); } });
                    menuItem.classList.toggle('is-open');
                }
            });
        }
    });
    const userMenuToggle = document.querySelector('.user-menu-toggle');
    const userMenuDropdown = document.querySelector('.user-menu-dropdown');
    if (userMenuToggle && userMenuDropdown) {
        userMenuToggle.addEventListener('click', function(event) {
            event.stopPropagation();
            const isOpen = userMenuDropdown.classList.toggle('is-open');
            userMenuToggle.setAttribute('aria-expanded', isOpen);
        });
    }
    document.addEventListener('click', function(event) {
        if (userMenuDropdown && userMenuDropdown.classList.contains('is-open')) {
            if (!userMenuToggle.contains(event.target) && !userMenuDropdown.contains(event.target)) {
                userMenuDropdown.classList.remove('is-open');
                userMenuToggle.setAttribute('aria-expanded', 'false');
            }
        }
    });

    // --- ROLE & VIEW VISIBILITY SCRIPT ---
    function applyRoleVisibility() {
        if (window.MEMBER_ROLES && Array.isArray(window.MEMBER_ROLES)) {
            const userRoles = window.MEMBER_ROLES.map(role => role.toLowerCase().trim());
            const isLoggedIn = userRoles.length > 0;
            
            // Toggle Header Elements
            document.querySelectorAll('.role-conditional').forEach(function(el) {
                const allowedRolesRaw = el.dataset.roles || "";
                if (allowedRolesRaw === "") { el.style.display = isLoggedIn ? 'none' : 'flex'; return; }
                const allowedRoles = allowedRolesRaw.split(',').map(role => role.toLowerCase().trim());
                const hasAccess = userRoles.some(userRole => allowedRoles.includes(userRole));
                el.style.display = hasAccess ? 'flex' : 'none';
            });

            // Toggle Main Page Content View
            const loggedOutView = document.getElementById('logged-out-view');
            const loggedInView = document.getElementById('logged-in-view');
            if(loggedInView && loggedOutView) {
                if (isLoggedIn) {
                    loggedOutView.style.display = 'none';
                    loggedInView.style.display = 'block';
                } else {
                    loggedOutView.style.display = 'block';
                    loggedInView.style.display = 'none';
                }
            }
        }
    }
    const loginToggle = document.getElementById('login-toggle');
    loginToggle.addEventListener('change', function() {
        if (this.checked) { window.MEMBER_ROLES = ['active']; } 
        else { window.MEMBER_ROLES = []; }
        applyRoleVisibility();
    });
    window.MEMBER_ROLES = [];
    applyRoleVisibility();
    
    // --- CONTACT HUB SCRIPT ---
    const triageCards = document.querySelectorAll('.triage-card');
    const contactHubContentPanels = document.querySelectorAll('#logged-out-view .content-panel');
    function showContactPanel(targetId) {
        let panelToShow = document.getElementById(targetId);
        let cardToSelect = document.querySelector(`.triage-card[data-target="${targetId}"]`);
        if (!panelToShow || !cardToSelect) { return; }
        contactHubContentPanels.forEach(panel => { panel.classList.remove('active'); });
        triageCards.forEach(card => { card.classList.remove('selected'); });
        panelToShow.classList.add('active');
        cardToSelect.classList.add('selected');
        panelToShow.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    triageCards.forEach(card => {
        card.addEventListener('click', function() { showContactPanel(this.dataset.target); });
        card.addEventListener('keydown', function(event) { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); this.click(); } });
    });
    const urlParams = new URLSearchParams(window.location.search);
    const userType = urlParams.get('user_type');
    if (userType) {
        const targetId = userType + 'Content';
        setTimeout(() => { showContactPanel(targetId); }, 100);
    }
    
    // --- SECURE MESSAGE CENTRE SCRIPT ---
    const messageItems = document.querySelectorAll('.message-item');
    const messageContentPanels = document.querySelectorAll('#logged-in-view .content-view');
    const composeBtn = document.getElementById('compose-btn');
    const composeView = document.getElementById('compose-view');
    function showMessagePanel(targetId) {
        messageItems.forEach(item => item.classList.remove('active'));
        messageContentPanels.forEach(panel => panel.classList.remove('active'));
        const targetPanel = document.getElementById(targetId);
        const targetItem = document.querySelector(`.message-item[data-target="${targetId}"]`);
        if (targetPanel) { targetPanel.classList.add('active'); }
        if (targetItem) { targetItem.classList.add('active'); }
    }
    messageItems.forEach(item => {
        item.addEventListener('click', function() { showMessagePanel(this.dataset.target); });
    });
    if(composeBtn) {
        composeBtn.addEventListener('click', function() {
            messageItems.forEach(item => item.classList.remove('active'));
            messageContentPanels.forEach(panel => panel.classList.remove('active'));
            if(composeView) composeView.classList.add('active');
        });
    }
    const attachmentInput = document.getElementById('attachment-file');
    const attachmentName = document.getElementById('attachment-name');
    if (attachmentInput) {
        attachmentInput.addEventListener('change', function() {
            attachmentName.textContent = this.files.length > 0 ? this.files[0].name : '';
        });
    }
});