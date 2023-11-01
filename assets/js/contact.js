document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    const mailtoLink = `mailto:example@example.com?subject=Message from ${name}&body=Sender Email: ${email}%0D%0A%0D%0A${message}`;
    window.location.href = mailtoLink;
});
