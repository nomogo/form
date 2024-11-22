// Ouvrir et fermer la popup
document.getElementById('openFormBtn').addEventListener('click', function () {
    // Ouvrir la popup
    document.getElementById('popupForm').style.display = 'flex';

    // Modifier l'URL avec History API
    history.pushState({ formOpen: true }, '', '#form-popup');
});

document.getElementById('closeFormBtn').addEventListener('click', function () {
    // Fermer la popup
    document.getElementById('popupForm').style.display = 'none';

    // Retourner à l'URL précédente lorsque le formulaire est fermé
    history.back();
});

// Gérer le bouton "Retour" du navigateur
window.addEventListener('popstate', function (event) {
    if (!event.state || !event.state.formOpen) {
        document.getElementById('popupForm').style.display = 'none';
    }
});

// Sauvegarder les données dans localStorage à chaque modification du formulaire
const form = document.getElementById('feedbackForm');

form.addEventListener('input', function () {
    const formData = {
        name: form.name.value,
        email: form.email.value,
        phone: form.phone.value,
        organization: form.organization.value,
        message: form.message.value,
        policy: form.policy.checked
    };
    localStorage.setItem('feedbackFormData', JSON.stringify(formData));
});

// Restaurer les données depuis localStorage lorsque la page est rechargée
window.addEventListener('load', function () {
    const savedData = JSON.parse(localStorage.getItem('feedbackFormData'));
    if (savedData) {
        form.name.value = savedData.name || '';
        form.email.value = savedData.email || '';
        form.phone.value = savedData.phone || '';
        form.organization.value = savedData.organization || '';
        form.message.value = savedData.message || '';
        form.policy.checked = savedData.policy || false;
    }
});

// Envoyer les données du formulaire
form.addEventListener('submit', function (event) {
    event.preventDefault();

    // Préparer les données du formulaire
    const formData = new FormData(form);
    
    fetch('https://formcarry.com/s/po61YWE6Kld', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('statusMessage').innerText = 'Le formulaire a été envoyé avec succès!';
            form.reset(); // Réinitialiser le formulaire
            localStorage.removeItem('feedbackFormData'); // Supprimer les données de localStorage
        } else {
            document.getElementById('statusMessage').innerText = 'Erreur lors de l\'envoi du formulaire. Essayez plus tard.';
        }
    })
    .catch(error => {
        document.getElementById('statusMessage').innerText = 'Erreur lors de l\'envoi du formulaire. Essayez plus tard.';
        console.error('Erreur:', error);
    });
});
