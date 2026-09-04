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
    const subject = encodeURIComponent(`Nouveau message de ${data.prenom} ${data.nom} — portfolio`);
    const bodyLines = [
      `Nom : ${data.nom}`,
      `Prénom : ${data.prenom}`,
      `E-mail : ${data.email}`,
      data.telephone ? `Téléphone : ${data.telephone}` : null,
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
          errors[name] = 'Ce champ est obligatoire';
        } else if (value.trim().length < 2) {
          errors[name] = 'Minimum 2 caractères';
        }
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          errors.email = 'Adresse e-mail obligatoire';
        } else if (!emailRegex.test(value.trim())) {
          errors.email = 'Adresse e-mail invalide';
        }
        break;

      case 'telephone':
        if (value && (!/^[\d\s+\-().]+$/.test(value) || value.replace(/\D/g, '').length < 6)) {
          errors.telephone = 'Format de téléphone invalide';
        }
        break;

      case 'message':
        if (!value.trim()) {
          errors.message = 'Le message est obligatoire';
        } else if (value.trim().length < 10) {
          errors.message = 'Le message doit contenir au moins 10 caractères';
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
      showStatus('Veuillez corriger les erreurs dans le formulaire', 'error');
      return;
    }

    // Récupérer les données
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Désactiver le bouton
    const submitBtn = form.querySelector('.form-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi en cours...';

    try {
      // Envoyer (Supabase si configuré, sinon e-mail)
      const result = await sendContactMessage(data);

      // Succès
      if (result.via === 'mailto') {
        showStatus('✓ Votre client e-mail va s\'ouvrir avec le message pré-rempli. Il ne reste qu\'à l\'envoyer !', 'success');
      } else {
        showStatus('✓ Message envoyé avec succès ! Je vous recontacterai bientôt.', 'success');
      }
      form.reset();
      displayErrors({});
      
    } catch (error) {
      console.error('Erreur:', error);
      showStatus(`Erreur: ${error.message}. Veuillez réessayer ou me contacter directement.`, 'error');
    } finally {
      // Réactiver le bouton
      submitBtn.disabled = false;
      submitBtn.textContent = submitBtn.dataset.label || 'Envoyer le message ➤';
    }
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