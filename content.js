// JIRA Sprint Details Display Extension
(function() {
  'use strict';

  let sprintDetailsElement = null;
  let observer = null;
  let showNotifications = false; // Default to false
  let sprintCache = {}; // Cache sprint data per board ID

  // Extract board ID from URL
  function getBoardId() {
    const match = window.location.pathname.match(/\/boards\/(\d+)/);
    return match ? match[1] : null;
  }

  // Check if current page is the active sprint board
  function isActiveSprintPage() {
    const url = window.location.href;
    const boardId = getBoardId();
    
    if (!boardId) return false;
    
    // Active sprint page pattern: ends with /boards/{id} or /boards/{id}?params
    // NOT backlog, calendar, timeline, reports, etc.
    const isActiveSprint = url.match(new RegExp(`/boards/${boardId}(?:\\?|$)`)) && 
                          !url.includes('/backlog') &&
                          !url.includes('/calendar') &&
                          !url.includes('/timeline') &&
                          !url.includes('/reports');
    
    return isActiveSprint;
  }

  // Show status notification
  function showStatus(message, type = 'info') {
    if (!showNotifications) return; // Only show if enabled
    
    const notification = document.createElement('div');
    notification.className = `jira-sprint-notification jira-sprint-${type}`;
    notification.textContent = `Sprint Extension: ${message}`;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      background: ${type === 'error' ? '#FF5630' : type === 'success' ? '#36B37E' : '#0052CC'};
      color: white;
      border-radius: 4px;
      z-index: 10000;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      animation: slideInRight 0.3s ease;
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }

  // Wait for the page to fully load
  function waitForElement(selector, callback, maxAttempts = 50) {
    let attempts = 0;
    const interval = setInterval(() => {
      const element = document.querySelector(selector);
      if (element) {
        clearInterval(interval);
        showStatus(`Found button after ${attempts} attempts`, 'success');
        callback(element);
      } else if (++attempts >= maxAttempts) {
        clearInterval(interval);
        showStatus(`Button not found after ${maxAttempts} attempts`, 'error');
        // Try alternative search
        findSprintButtonAlternative();
      }
    }, 300);
  }

  // Alternative method to find sprint button
  function findSprintButtonAlternative() {
    showStatus('Trying alternative search...', 'info');
    
    // Look for any button with "Sprint details" text
    const buttons = Array.from(document.querySelectorAll('button'));
    const sprintButton = buttons.find(btn => 
      btn.textContent.includes('Sprint details') || 
      btn.querySelector('span')?.textContent.includes('Sprint details')
    );
    
    if (sprintButton) {
      showStatus('Found button with alternative method!', 'success');
      setTimeout(() => fetchSprintDetails(sprintButton), 500);
    } else {
      showStatus('Sprint button not available on this page', 'error');
    }
  }

  // Extract sprint information from the popup
  function extractSprintInfo(popup) {
    try {
      const sprintName = popup.querySelector('h2 strong')?.textContent || 'N/A';
      const sprintGoal = popup.querySelector('span.css-19w20bv')?.textContent || 'No goal set';
      const daysLeft = popup.querySelector('span.css-f7yz8z')?.textContent || 'N/A';
      
      const dateElements = popup.querySelectorAll('.css-gtihfx');
      let startDate = 'N/A';
      let endDate = 'N/A';
      
      dateElements.forEach(el => {
        const label = el.querySelector('.css-1yjtuno')?.textContent;
        const value = el.querySelector('.css-f7yz8z')?.textContent;
        if (label === 'Start date') startDate = value;
        if (label === 'End date') endDate = value;
      });

      return {
        sprintName,
        sprintGoal,
        daysLeft,
        startDate,
        endDate
      };
    } catch (error) {
      console.error('Error extracting sprint info:', error);
      return null;
    }
  }

  // Create the sprint details display element
  function createSprintDisplay(info) {
    const container = document.createElement('div');
    container.id = 'jira-sprint-display-extension';
    container.className = 'sprint-display-container';
    
    container.innerHTML = `
      <div class="sprint-display-content">
        <div class="sprint-time-left">${info.daysLeft}</div>
        <div class="sprint-dates">
          <span>${info.startDate}</span>
          <span>→</span>
          <span>${info.endDate}</span>
        </div>
      </div>
    `;
    
    return container;
  }

  // Find the controls bar and insert sprint details
  function insertSprintDisplay(sprintInfo) {
    // Remove existing display if present
    const existing = document.getElementById('jira-sprint-display-extension');
    if (existing) {
      // Display already exists, don't re-insert
      return;
    }
    
    // Look for the right side controls container (css-u345ti class)
    const rightControls = document.querySelector('.css-u345ti');
    
    if (rightControls) {
      const sprintDisplay = createSprintDisplay(sprintInfo);
      // Insert at the beginning of the right controls (before Complete sprint)
      rightControls.insertAdjacentElement('afterbegin', sprintDisplay);
      showStatus('Display inserted successfully!', 'success');
    } else {
      showStatus('Controls bar not found, retrying...', 'info');
      setTimeout(() => insertSprintDisplay(sprintInfo), 1000);
    }
  }

  // Click the sprint details button and extract info
  function fetchSprintDetails(button = null) {
    const boardId = getBoardId();
    
    // Check if we have cached data for this board
    if (boardId && sprintCache[boardId]) {
      showStatus('Using cached sprint data for board ' + boardId, 'info');
      insertSprintDisplay(sprintCache[boardId]);
      return;
    }
    
    const sprintButton = button || document.querySelector('[data-testid="software-board.header.sprint-controls.sprint-details.trigger-button.icon-button"]');
    
    if (!sprintButton) {
      showStatus('Sprint button not found', 'error');
      return;
    }

    showStatus('Fetching fresh sprint data...', 'info');
    
    // Click to open popup
    sprintButton.click();

    // Wait for popup to appear
    setTimeout(() => {
      showStatus('Looking for popup...', 'info');
      
      // Try multiple ways to find the popup
      let popup = document.querySelector('[role="dialog"][aria-label*="Popup with details about the current active sprints"]');
      
      if (!popup) {
        popup = document.querySelector('[role="dialog"]');
        showStatus('Trying generic dialog selector...', 'info');
      }
      
      if (!popup) {
        popup = document.querySelector('[id^="_r"][data-placement]');
        showStatus('Trying popup by ID pattern...', 'info');
      }
      
      if (popup) {
        showStatus('Popup found! Extracting data...', 'success');
        const sprintInfo = extractSprintInfo(popup);
        
        if (sprintInfo && boardId) {
          sprintCache[boardId] = sprintInfo; // Cache by board ID
          insertSprintDisplay(sprintInfo);
          showStatus('Sprint details cached for board ' + boardId, 'success');
          setupObserver();
        } else {
          showStatus('Could not extract sprint info', 'error');
        }
        
        // Close the popup
        setTimeout(() => {
          document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
          sprintButton.click();
        }, 100);
      } else {
        showStatus('Popup not found', 'error');
      }
    }, 1200);
  }

  // Monitor for DOM changes (navigation in JIRA) - DISABLED
  function setupObserver() {
    // Observer disabled - we only rely on URL changes and initial load
    // This prevents re-triggering on filter changes
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }

  // Initialize the extension
  function init() {
    // Check if we're on an active sprint page
    if (!isActiveSprintPage()) {
      showStatus('Not on active sprint page, skipping', 'info');
      return;
    }
    
    const boardId = getBoardId();
    showStatus('Initializing for board ' + boardId, 'info');
    
    // Check if display already exists (avoid duplicates)
    const existingDisplay = document.getElementById('jira-sprint-display-extension');
    if (existingDisplay) {
      showStatus('Display already exists, skipping', 'info');
      return;
    }
    
    // If we have cached data for this board, use it immediately
    if (boardId && sprintCache[boardId]) {
      showStatus('Using cached data immediately', 'info');
      insertSprintDisplay(sprintCache[boardId]);
      return;
    }
    
    // Otherwise, fetch fresh data
    // First, wait for the page to fully load
    setTimeout(() => {
      showStatus('Searching for sprint button...', 'info');
      
      // Wait for the sprint button to appear
      waitForElement(
        '[data-testid="software-board.header.sprint-controls.sprint-details.trigger-button.icon-button"]',
        (button) => {
          showStatus('Button found! Waiting before clicking...', 'success');
          setTimeout(() => fetchSprintDetails(button), 1000);
        }
      );
    }, 2000); // Wait 2 seconds for JIRA to fully load
  }

  // Start when DOM is ready - ONE TIME ONLY
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Load settings after initialization
  setTimeout(() => {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
        chrome.storage.sync.get(['showNotifications'], (result) => {
          showNotifications = result.showNotifications || false;
        });

        // Listen for settings updates
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
          if (request.action === 'updateSettings') {
            showNotifications = request.showNotifications;
          }
        });
      }
    } catch (e) {
      console.log('Storage API not available, notifications disabled');
    }
  }, 1000);

  // Watch for URL changes ONLY (not DOM changes)
  let lastUrl = location.href;
  let lastPathname = location.pathname;
  let checkCount = 0;
  
  // Use setInterval instead of MutationObserver for URL checking
  setInterval(() => {
    const currentUrl = location.href;
    const currentPathname = location.pathname;
    
    checkCount++;
    
    // Only act if the pathname changed (actual navigation, not just query params)
    if (currentPathname !== lastPathname) {
      showStatus(`Navigation detected (check #${checkCount})`, 'info');
      lastUrl = currentUrl;
      lastPathname = currentPathname;
      
      // Small delay then re-initialize
      setTimeout(() => {
        showStatus('Re-initializing after navigation...', 'info');
        init();
      }, 2000);
    } else if (currentUrl !== lastUrl) {
      // URL params changed but not pathname (filtering)
      showStatus(`Filter detected (check #${checkCount}), ignoring`, 'info');
      lastUrl = currentUrl;
    }
  }, 1000); // Check every second

})();