// Gestionnaire du formulaire de contact
(function () {
  const form = document.querySelector('.contact-form');
  const statusDiv = document.getElementById('form-status');

  if (!form) return;

  // ---- Config Supabase (facultatif) ------------------------------------
  // Renseigne ces deux valeurs (Project Settings > API sur supabase.com)
  // pour enregistrer les messages dans une table "messages". Tant qu'elles
  // restent vides, le formulaire bascule automatiquement sur un envoi par
  // e-mail (mailto) pour que le contact reste fonctionnel sans backend.
  const SUPABASE_URL = '';
  const SUPABASE_ANON_KEY = '';
  const CONTACT_EMAIL = 'dialloelijahismael@gmail.com';
  let statusTimer;
  const t = (fr, en) => document.documentElement.lang === 'en' ? en : fr;

  async function sendContactMessage(data) {
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error(`Échec de l'envoi (code ${response.status})`);
      }
      return { via: 'supabase' };
    }

    // Repli : ouvre le client e-mail avec le message pré-rempli.
    const subject = encodeURIComponent(`${t('Nouveau message de', 'New message from')} ${data.prenom} ${data.nom} — portfolio`);
    const bodyLines = [
      `${t('Nom', 'Last name')} : ${data.nom}`,
      `${t('Prénom', 'First name')} : ${data.prenom}`,
      `E-mail : ${data.email}`,
      data.telephone ? `${t('Téléphone', 'Phone')} : ${data.telephone}` : null,
      '',
      data.message
    ].filter(Boolean);
    const body = encodeURIComponent(bodyLines.join('\n'));
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    return { via: 'mailto' };
  }

  // Validation des champs
  function validateField(name, value) {
    const errors = {};

    switch (name) {
      case 'nom':
      case 'prenom':
        if (!value.trim()) {
          errors[name] = t("Ce champ est obligatoire", "This field is required");
        } else if (value.trim().length < 2) {
          errors[name] = t("Minimum 2 caractères", "At least 2 characters");
        }
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          errors.email = t("Adresse e-mail obligatoire", "Email address is required");
        } else if (!emailRegex.test(value.trim())) {
          errors.email = t("Adresse e-mail invalide", "Invalid email address");
        }
        break;

      case 'telephone':
        if (value && (!/^[\d\s+\-().]+$/.test(value) || value.replace(/\D/g, '').length < 6)) {
          errors.telephone = t("Format de téléphone invalide", "Invalid phone number");
        }
        break;

      case 'message':
        if (!value.trim()) {
          errors.message = t("Le message est obligatoire", "A message is required");
        } else if (value.trim().length < 10) {
          errors.message = t("Le message doit contenir au moins 10 caractères", "The message must contain at least 10 characters");
        }
        break;
    }

    return errors;
  }

  // Afficher les erreurs
  function displayErrors(errors) {
    // Effacer les erreurs précédentes
    document.querySelectorAll('.form-error').forEach(el => {
      el.textContent = '';
    });
    form.querySelectorAll('.form-input, .form-textarea').forEach(field => {
      field.removeAttribute('aria-invalid');
    });

    // Afficher les nouvelles erreurs
    Object.entries(errors).forEach(([fieldName, message]) => {
      const errorEl = document.querySelector(`[data-error-for="${fieldName}"]`);
      if (errorEl) {
        errorEl.textContent = message;
        const field = form.elements[fieldName];
        if (field) {
          field.setAttribute('aria-invalid', 'true');
        }
      }
    });
  }

  // Afficher le statut du formulaire
  function showStatus(message, type = 'info') {
    if (!statusDiv) return;
    window.clearTimeout(statusTimer);
    const statusMessage = document.createElement('div');
    statusMessage.className = `status-message status-${type}`;
    statusMessage.textContent = message;
    statusDiv.replaceChildren(statusMessage);
    statusDiv.style.display = 'block';

    if (type === 'success') {
      statusTimer = window.setTimeout(() => {
        statusDiv.style.display = 'none';
      }, 5000);
    }
  }

  // Validation complète du formulaire
  function validateForm() {
    const formData = new FormData(form);
    let allErrors = {};

    for (let [key, value] of formData.entries()) {
      const fieldErrors = validateField(key, value);
      allErrors = { ...allErrors, ...fieldErrors };
    }

    return allErrors;
  }

  // Gérer la soumission du formulaire
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validation
    const errors = validateForm();
    displayErrors(errors);
    if (Object.keys(errors).length > 0) {
      showStatus(t("Veuillez corriger les erreurs dans le formulaire", "Please correct the errors in the form"), 'error');
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    // Récupérer les données
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Désactiver le bouton
    const submitBtn = form.querySelector('.form-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = t("Envoi en cours...", "Preparing your message...");

    try {
      // Envoyer (Supabase si configuré, sinon e-mail)
      const result = await sendContactMessage(data);

      // Succès
      if (result.via === 'mailto') {
        showStatus(t('Votre messagerie a été sollicitée. Vérifiez puis envoyez votre e-mail. Si elle ne s’ouvre pas, utilisez le lien de contact ci-dessous.', 'Your email app was requested. Review and send your email. If it does not open, use the contact link below.'), 'info');
      } else {
        showStatus(t("✓ Message envoyé avec succès ! Je vous recontacterai bientôt.", "\u2713 Message sent successfully! I will get back to you soon."), 'success');
      }
      if (result.via === 'supabase') form.reset();
      displayErrors({});
      
    } catch (error) {
      console.error('Erreur:', error);
      showStatus(t('Impossible de préparer le message. Réessayez ou contactez-moi directement.', 'Unable to prepare the message. Please try again or contact me directly.'), 'error');
    } finally {
      // Réactiver le bouton
      submitBtn.disabled = false;
      submitBtn.textContent = submitBtn.dataset.label || 'Envoyer le message ➤';
    }
  });

  document.addEventListener('portfolio-language', () => {
    const errors = {};
    form.querySelectorAll('[aria-invalid="true"]').forEach(field => Object.assign(errors, validateField(field.name, field.value)));
    displayErrors(errors);
    if (statusDiv) statusDiv.replaceChildren();
  });

  // Validation en temps réel
  form.querySelectorAll('.form-input, .form-textarea').forEach(field => {
    field.addEventListener('blur', () => {
      const errors = validateField(field.name, field.value);
      if (Object.keys(errors).length > 0) {
        const errorEl = document.querySelector(`[data-error-for="${field.name}"]`);
        if (errorEl) {
          errorEl.textContent = errors[field.name];
          field.setAttribute('aria-invalid', 'true');
        }
      } else {
        const errorEl = document.querySelector(`[data-error-for="${field.name}"]`);
        if (errorEl) {
          errorEl.textContent = '';
          field.removeAttribute('aria-invalid');
        }
      }
    });
  });
})();