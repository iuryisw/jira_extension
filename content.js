// JIRA Sprint Details Display Extension
(function() {
  'use strict';

  let sprintDetailsElement = null;
  let observer = null;
  let showNotifications = false; // Default to false

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
      existing.remove();
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
    const sprintButton = button || document.querySelector('[data-testid="software-board.header.sprint-controls.sprint-details.trigger-button.icon-button"]');
    
    if (!sprintButton) {
      showStatus('Sprint button parameter missing', 'error');
      return;
    }

    showStatus('Clicking sprint button...', 'info');
    
    // Click to open popup
    sprintButton.click();

    // Wait longer for popup to appear and try multiple selectors
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
        
        if (sprintInfo) {
          insertSprintDisplay(sprintInfo);
          showStatus('Sprint details loaded!', 'success');
          setupObserver();
        } else {
          showStatus('Could not extract sprint info', 'error');
        }
        
        // Close the popup
        setTimeout(() => {
          document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
          // Or try clicking the button again to toggle it closed
          sprintButton.click();
        }, 100);
      } else {
        showStatus('Popup not found - checking page structure', 'error');
        // Log what dialogs we can find
        const allDialogs = document.querySelectorAll('[role="dialog"]');
        showStatus(`Found ${allDialogs.length} dialogs on page`, 'info');
      }
    }, 1200); // Increased wait time
  }

  // Monitor for DOM changes (navigation in JIRA)
  function setupObserver() {
    if (observer) {
      observer.disconnect();
    }

    observer = new MutationObserver((mutations) => {
      // Check if we're on a board page and sprint button exists
      const sprintButton = document.querySelector('[data-testid="software-board.header.sprint-controls.sprint-details.trigger-button.icon-button"]');
      const existingDisplay = document.getElementById('jira-sprint-display-extension');
      
      if (sprintButton && !existingDisplay) {
        fetchSprintDetails();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Initialize the extension
  function init() {
    showStatus('Initializing...', 'info');
    
    // First, wait longer for the page to fully load
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

  // Start when DOM is ready
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

  // Also re-initialize on URL changes (JIRA is a SPA)
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      setTimeout(init, 1000);
    }
  }).observe(document, { subtree: true, childList: true });

})();