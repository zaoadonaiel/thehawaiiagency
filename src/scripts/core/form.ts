/**
 * Contact form enhancement.
 *
 * - With PUBLIC_FORM_ENDPOINT configured, the form's action is that endpoint
 *   (Formspree, Web3Forms, Getform, Basin… anything that accepts a form POST and
 *   answers JSON). We submit with fetch and only report success on a 2xx reply.
 * - Without an endpoint (data-mode="mailto") we never pretend to send: the
 *   visitor's email app is opened with the message pre-filled.
 * Without JavaScript the browser falls back to a normal POST / mailto.
 */

type FieldEl = HTMLInputElement | HTMLTextAreaElement;

const messages: Record<string, (el: FieldEl) => string | null> = {
  name: (el) => (el.value.trim().length < 2 ? 'Please tell us your name.' : null),
  email: (el) =>
    !el.value.trim()
      ? 'Please add your email so we can reply.'
      : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim())
        ? 'That email address doesn’t look quite right.'
        : null,
  phone: (el) => (el.value.trim() && !/^[+()\d\s.-]{7,}$/.test(el.value.trim()) ? 'Please use digits, spaces, + ( ) or - only.' : null),
  message: (el) => (el.value.trim().length < 4 ? 'Let us know which service you need.' : null),
};

function validateField(el: FieldEl) {
  const check = messages[el.name];
  const error = check ? check(el) : null;
  const slot = document.getElementById(`${el.id}-error`);
  el.setAttribute('aria-invalid', error ? 'true' : 'false');
  if (slot) slot.textContent = error ?? '';
  el.closest('.field')?.classList.toggle('has-error', Boolean(error));
  return !error;
}

export function initForms() {
  document.querySelectorAll<HTMLFormElement>('form[data-contact-form]').forEach((form) => {
    const status = form.querySelector<HTMLElement>('[data-form-status]');
    const submit = form.querySelector<HTMLButtonElement>('[type="submit"]');
    const fields = [...form.querySelectorAll<FieldEl>('input:not([type="hidden"]):not([name="botcheck"]), textarea')];
    form.noValidate = true;

    fields.forEach((el) => {
      el.addEventListener('blur', () => el.value && validateField(el));
      el.addEventListener('input', () => el.getAttribute('aria-invalid') === 'true' && validateField(el));
    });

    const setStatus = (text: string, tone: 'info' | 'success' | 'error') => {
      if (!status) return;
      status.textContent = text;
      status.dataset.tone = tone;
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const valid = fields.map(validateField).every(Boolean);
      if (!valid) {
        fields.find((f) => f.getAttribute('aria-invalid') === 'true')?.focus();
        setStatus('Please check the highlighted fields.', 'error');
        return;
      }
      const data = new FormData(form);
      if (data.get('botcheck')) return; // honeypot

      if (form.dataset.mode === 'mailto') {
        const to = form.dataset.mailto ?? '';
        const subject = `Website enquiry from ${data.get('name')}`;
        const body = [
          `Name: ${data.get('name')}`,
          `Email: ${data.get('email')}`,
          `Phone: ${data.get('phone') || '—'}`,
          '',
          `${data.get('message')}`,
        ].join('\n');
        window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setStatus('Your email app should now be open with your message ready to send. If it didn’t open, email us directly or give us a call.', 'info');
        return;
      }

      form.setAttribute('aria-busy', 'true');
      submit?.setAttribute('disabled', '');
      setStatus('Sending your message…', 'info');
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: { Accept: 'application/json' },
        });
        let ok = res.ok;
        try {
          const json = await res.clone().json();
          if (json && json.success === false) ok = false;
        } catch {
          /* non-JSON response — rely on the status code */
        }
        if (!ok) throw new Error(`HTTP ${res.status}`);
        form.reset();
        fields.forEach((f) => f.removeAttribute('aria-invalid'));
        form.classList.add('is-sent');
        setStatus('Mahalo for your message. We will get back to you right away.', 'success');
      } catch {
        setStatus('There was an error trying to send your message. Please try again, or call us directly.', 'error');
      } finally {
        form.removeAttribute('aria-busy');
        submit?.removeAttribute('disabled');
      }
    });
  });
}
