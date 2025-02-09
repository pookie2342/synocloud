document.getElementById('uploadForm').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const fileInput = document.getElementById('fileInput');
    if (!fileInput.files.length) {
      alert('Please select a file.');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
  
    try {
      const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
      });
  
      const result = await response.json();
      document.getElementById('status').textContent = result.message;
    } catch (error) {
      document.getElementById('status').textContent = 'Upload failed. Try again.';
    }
  });
  function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }
  
  /* Set the width of the side navigation to 0 */
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }  
  