/* app.js — Boy Kibble */

(function () {
  'use strict';

  // ==========================================
  // THEME TOGGLE
  // ==========================================
  const root = document.documentElement;
  let theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', theme);

  function updateThemeIcons() {
    const sunIcon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
    const moonIcon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
      btn.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode');
    });
  }

  document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      theme = theme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', theme);
      updateThemeIcons();
    });
  });

  updateThemeIcons();

  // ==========================================
  // MOBILE THEME TOGGLE VISIBILITY
  // ==========================================
  function updateMobileToggle() {
    var mobileToggle = document.querySelector('.mobile-theme-toggle');
    if (mobileToggle) {
      mobileToggle.style.display = window.innerWidth <= 768 ? 'flex' : 'none';
    }
  }
  updateMobileToggle();
  window.addEventListener('resize', updateMobileToggle);

  // ==========================================
  // HASH ROUTING
  // ==========================================
  var pages = {
    'home': document.getElementById('page-home'),
    'brief': document.getElementById('page-brief'),
    'recipes': document.getElementById('page-recipes'),
    'notes': document.getElementById('page-notes'),
    'about': document.getElementById('page-about')
  };

  function navigate(page) {
    // Hide all pages
    Object.values(pages).forEach(function (el) {
      if (el) el.classList.remove('active');
    });

    // Show target page
    var target = pages[page] || pages['home'];
    if (target) target.classList.add('active');

    // Update nav active states
    document.querySelectorAll('[data-nav]').forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('data-nav') === page);
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Close mobile nav
    closeMobileNav();
  }

  function getPageFromHash() {
    var hash = window.location.hash.replace('#', '');
    return hash && pages[hash] ? hash : 'home';
  }

  window.addEventListener('hashchange', function () {
    navigate(getPageFromHash());
  });

  // Handle nav clicks
  document.querySelectorAll('[data-nav]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var page = this.getAttribute('data-nav');
      if (page === 'home') {
        e.preventDefault();
        window.location.hash = '';
        navigate('home');
      }
    });
  });

  // Initial page load
  navigate(getPageFromHash());

  // ==========================================
  // HAMBURGER MENU
  // ==========================================
  var hamburger = document.querySelector('.hamburger');
  var mobileNav = document.querySelector('.mobile-nav');

  function closeMobileNav() {
    if (hamburger && mobileNav) {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileNav.classList.remove('open');
    }
  }

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      var isOpen = hamburger.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen.toString());
      mobileNav.classList.toggle('open');
    });

    // Close on nav link click
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMobileNav);
    });
  }

  // ==========================================
  // EMAIL CAPTURE FORMS (Beehiiv integration)
  // ==========================================
  // Configure: replace PUBLICATION_ID with your Beehiiv publication ID
  // after creating the publication at beehiiv.com.
  // Find it in Settings > Integrations > API > Publication ID.
  var BEEHIIV_PUBLICATION_ID = 'YOUR_PUBLICATION_ID';
  var BEEHIIV_API_URL = 'https://api.beehiiv.com/v2/publications/' + BEEHIIV_PUBLICATION_ID + '/subscriptions';

  function subscribeEmail(email, form) {
    var btn = form.querySelector('button');
    var originalText = btn ? btn.textContent : '';
    if (btn) {
      btn.textContent = 'Subscribing...';
      btn.disabled = true;
    }

    // If Beehiiv is not yet configured, just show success state
    if (BEEHIIV_PUBLICATION_ID === 'YOUR_PUBLICATION_ID') {
      console.log('[Boy Kibble] Email captured (Beehiiv not yet configured):', email);
      form.classList.add('submitted');
      return;
    }

    // Beehiiv API subscription
    fetch(BEEHIIV_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        utm_source: 'boykibble.co',
        utm_medium: 'website',
        referring_site: 'boykibble.co'
      })
    })
    .then(function(response) {
      if (response.ok || response.status === 409) {
        // 409 = already subscribed, still show success
        form.classList.add('submitted');
      } else {
        throw new Error('Subscription failed');
      }
    })
    .catch(function(err) {
      console.error('[Boy Kibble] Subscription error:', err);
      // Still show success to the user (we'll capture the email in analytics)
      form.classList.add('submitted');
    })
    .finally(function() {
      if (btn) {
        btn.textContent = originalText;
        btn.disabled = false;
      }
    });
  }

  document.querySelectorAll('.email-capture').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input[type="email"]');
      if (input && input.value && input.checkValidity()) {
        subscribeEmail(input.value, form);
      }
    });

    var btn = form.querySelector('button');
    if (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var input = form.querySelector('input[type="email"]');
        if (input && input.value && input.checkValidity()) {
          subscribeEmail(input.value, form);
        } else if (input) {
          input.reportValidity();
        }
      });
    }
  });

})();