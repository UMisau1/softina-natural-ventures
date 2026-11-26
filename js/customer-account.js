(() => {
  'use strict';

  const supabase = window.softinaSupabase;
  const $ = (id) => document.getElementById(id);
  const authPanel = $('authPanel');
  const profilePanel = $('profilePanel');
  const ordersPanel = $('ordersPanel');
  const notice = $('notice');
  let currentUser = null;

  $('year').textContent = new Date().getFullYear();

  function showNotice(message, isError = false) {
    notice.textContent = message;
    notice.classList.toggle('error', isError);
    notice.hidden = false;
    notice.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function clearNotice() {
    notice.hidden = true;
    notice.textContent = '';
    notice.classList.remove('error');
  }

  function setBusy(form, busy, buttonText) {
    const button = form.querySelector('button[type="submit"]');
    if (!button) return;
    if (busy) {
      button.dataset.originalText = button.textContent;
      button.disabled = true;
      button.textContent = buttonText || 'Please wait...';
    } else {
      button.disabled = false;
      button.textContent = button.dataset.originalText || button.textContent;
    }
  }

  function showAuth(mode = 'login') {
    authPanel.hidden = false;
    profilePanel.hidden = true;
    ordersPanel.hidden = true;
    const isRegister = mode === 'register';
    $('loginForm').hidden = isRegister;
    $('registerForm').hidden = !isRegister;
    $('loginTab').classList.toggle('active', !isRegister);
    $('registerTab').classList.toggle('active', isRegister);
    $('loginTab').setAttribute('aria-selected', String(!isRegister));
    $('registerTab').setAttribute('aria-selected', String(isRegister));
  }

  function showProfile(user) {
    authPanel.hidden = true;
    profilePanel.hidden = false;
    ordersPanel.hidden = true;
    $('profileName').value = user.user_metadata?.full_name || '';
    $('profilePhone').value = user.user_metadata?.phone || '';
  }

  function escapeText(value) {
    return String(value ?? '');
  }

  function renderOrders(orders) {
    const list = $('ordersList');
    list.replaceChildren();
    if (!Array.isArray(orders) || orders.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = 'No orders are linked to this account yet. Orders placed with your verified email will appear here.';
      list.appendChild(empty);
      return;
    }

    orders.forEach((order) => {
      const card = document.createElement('article');
      card.className = 'order-card';

      const top = document.createElement('div');
      top.className = 'order-top';
      const number = document.createElement('div');
      number.className = 'order-number';
      number.textContent = escapeText(order.order_number);
      const status = document.createElement('span');
      status.className = 'status';
      status.textContent = escapeText(order.status);
      top.append(number, status);

      const meta = document.createElement('p');
      meta.className = 'order-meta';
      const date = order.created_at ? new Date(order.created_at).toLocaleString() : '';
      meta.textContent = `${date} · Payment: ${escapeText(order.payment_status)} · Delivery: ${escapeText(order.delivery_lga)}, ${escapeText(order.delivery_state)}`;

      const items = document.createElement('ul');
      items.className = 'order-items';
      (Array.isArray(order.items) ? order.items : []).forEach((item) => {
        const li = document.createElement('li');
        li.textContent = `${escapeText(item.product_name)} × ${escapeText(item.quantity)} — ₦${Number(item.line_total || 0).toLocaleString()}`;
        items.appendChild(li);
      });

      const total = document.createElement('div');
      total.className = 'order-total';
      total.textContent = `Total: ₦${Number(order.total || 0).toLocaleString()}`;
      card.append(top, meta, items, total);
      list.appendChild(card);
    });
  }

  async function loadOrders() {
    if (!supabase || !currentUser) return;
    clearNotice();
    $('refreshOrders').disabled = true;
    $('refreshOrders').textContent = 'Refreshing...';
    try {
      const { data, error } = await supabase.rpc('customer_list_softina_orders');
      if (error) throw error;
      const payload = Array.isArray(data) ? data[0] : data;
      if (payload?.success !== true) throw new Error('Could not load your orders.');
      renderOrders(payload.orders || []);
      $('accountEmail').textContent = currentUser.email || '';
      authPanel.hidden = true;
      profilePanel.hidden = true;
      ordersPanel.hidden = false;
    } catch (error) {
      showNotice(error.message || 'Unable to load your orders.', true);
    } finally {
      $('refreshOrders').disabled = false;
      $('refreshOrders').textContent = 'Refresh orders';
    }
  }

  async function finishAccountSetup(user, fullName, phone) {
    const { data, error } = await supabase.rpc('customer_claim_softina_orders', {
      p_full_name: fullName,
      p_phone: phone
    });
    if (error) throw error;
    const payload = Array.isArray(data) ? data[0] : data;
    if (payload?.success !== true) throw new Error('Your account profile could not be saved.');
    localStorage.removeItem('softinaPendingCustomerProfile');
    currentUser = user;
    showNotice(`Account ready. ${Number(payload.linked_orders || 0)} matching order(s) linked to your account.`);
    await loadOrders();
  }

  async function handleSession(session) {
    currentUser = session?.user || null;
    if (!currentUser) {
      showAuth('login');
      return;
    }

    if (!currentUser.email_confirmed_at && !currentUser.confirmed_at) {
      showAuth('login');
      showNotice('Please verify your email using the link sent to your inbox, then log in.', true);
      return;
    }

    const pending = JSON.parse(localStorage.getItem('softinaPendingCustomerProfile') || 'null');
    const fullName = currentUser.user_metadata?.full_name || pending?.fullName || '';
    const phone = currentUser.user_metadata?.phone || pending?.phone || '';

    if (fullName && phone) {
      try {
        await finishAccountSetup(currentUser, fullName, phone);
      } catch (error) {
        showProfile(currentUser);
        showNotice(error.message || 'Please complete your customer profile.', true);
      }
    } else {
      showProfile(currentUser);
    }
  }

  $('loginTab').addEventListener('click', () => { clearNotice(); showAuth('login'); });
  $('registerTab').addEventListener('click', () => { clearNotice(); showAuth('register'); });

  $('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!supabase) return showNotice('Supabase could not be initialized. Please refresh the page.', true);
    const form = event.currentTarget;
    setBusy(form, true, 'Signing in...');
    clearNotice();
    try {
      const email = $('loginEmail').value.trim();
      const password = $('loginPassword').value;
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      await handleSession(data.session);
    } catch (error) {
      showNotice(error.message || 'Login failed.', true);
    } finally {
      setBusy(form, false);
    }
  });

  $('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!supabase) return showNotice('Supabase could not be initialized. Please refresh the page.', true);
    const form = event.currentTarget;
    setBusy(form, true, 'Creating account...');
    clearNotice();
    const fullName = $('registerName').value.trim();
    const phone = $('registerPhone').value.trim();
    const email = $('registerEmail').value.trim();
    const password = $('registerPassword').value;
    localStorage.setItem('softinaPendingCustomerProfile', JSON.stringify({ fullName, phone }));
    try {
      const redirectTo = window.location.href.split('#')[0].split('?')[0];
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectTo,
          data: { full_name: fullName, phone }
        }
      });
      if (error) throw error;
      if (data.session) {
        await handleSession(data.session);
      } else {
        showAuth('login');
        showNotice('Registration received. Check your email and click the verification link. After verification, return here and log in.');
      }
    } catch (error) {
      localStorage.removeItem('softinaPendingCustomerProfile');
      showNotice(error.message || 'Account registration failed.', true);
    } finally {
      setBusy(form, false);
    }
  });

  $('profileForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setBusy(form, true, 'Saving profile...');
    try {
      await finishAccountSetup(currentUser, $('profileName').value.trim(), $('profilePhone').value.trim());
    } catch (error) {
      showNotice(error.message || 'Could not save your profile.', true);
    } finally {
      setBusy(form, false);
    }
  });

  $('forgotPassword').addEventListener('click', async () => {
    if (!supabase) return showNotice('Supabase could not be initialized.', true);
    const email = $('loginEmail').value.trim();
    if (!email) return showNotice('Enter your email address first.', true);
    try {
      const redirectTo = window.location.href.split('#')[0].split('?')[0];
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (error) throw error;
      showNotice('If this email is registered, a password reset link will be sent to it.');
    } catch (error) {
      showNotice(error.message || 'Could not request a password reset.', true);
    }
  });

  $('refreshOrders').addEventListener('click', loadOrders);
  $('logoutButton').addEventListener('click', async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      currentUser = null;
      showAuth('login');
      showNotice('You have logged out successfully.');
    } catch (error) {
      showNotice(error.message || 'Logout failed.', true);
    }
  });

  if (!supabase) {
    showAuth('login');
    showNotice('Supabase could not be initialized. Check that js/supabase-config.js loads correctly.', true);
    return;
  }

  supabase.auth.getSession().then(({ data, error }) => {
    if (error) {
      showAuth('login');
      showNotice(error.message, true);
      return;
    }
    handleSession(data.session);
  });

  supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      currentUser = session.user;
    } else {
      currentUser = null;
    }
  });
})();
