document.querySelectorAll('.task-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const taskId = this.getAttribute('data-id');
      const completed = this.checked;

      fetch(`/update-task?id=${taskId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ completed })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          window.location.reload();  // Refresh to reflect changes
        }
      });
    });
  });




const toggleButton = document.getElementById('theme-toggle');
const root = document.documentElement;

toggleButton.addEventListener('click', () => {
  const isDark = root.style.getPropertyValue('--bg-color') === '#f9f9f9';

  if (isDark) {
    // Switch to Dark Theme
    root.style.setProperty('--bg-color', '#2c2c2c');
    root.style.setProperty('--text-color', '#ffffff');
    root.style.setProperty('--container-bg', '#3a3a3a');
    root.style.setProperty('--border-color', '#555');
    root.style.setProperty('--primary-color', '#9b7bff');
    root.style.setProperty('--completed-text', '#888');
  } else {
    // Switch to Light Theme
    root.style.setProperty('--bg-color', '#f9f9f9');
    root.style.setProperty('--text-color', '#333333');
    root.style.setProperty('--container-bg', '#ffffff');
    root.style.setProperty('--border-color', '#ccc');
    root.style.setProperty('--primary-color', '#7b5fff');
    root.style.setProperty('--completed-text', '#aaa');
  }
});
