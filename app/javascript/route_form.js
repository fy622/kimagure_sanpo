document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("routeForm");
  
    if (form) { // フォームが存在する場合にのみイベントを設定
      form.addEventListener("submit", function(event) {
        event.preventDefault();
  
        // フォームのデータを取得
        const formData = new FormData(form);
        const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  
        fetch(form.action, {
          method: "POST",
          headers: {
            "X-CSRF-Token": token,
            "Accept": "application/json"
          },
          body: formData
        })
        .then(response => response.json())
        .then(data => {
          console.log("Success:", data);
        })
        .catch(error => {
          console.error("Error:", error);
        });
      });
    }
  });