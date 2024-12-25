document.addEventListener("DOMContentLoaded", () => {
    const openFormBtn = document.getElementById("openFormBtn");
    const closeFormBtn = document.getElementById("closeFormBtn");
    const formPopup = document.getElementById("formPopup");
    const feedbackForm = document.getElementById("feedbackForm");
    const notification = document.getElementById("notification");


    const loadFormData = () => {
        const data = JSON.parse(localStorage.getItem("formData"));
        if (data) {
            Object.keys(data).forEach((key) => {
                const input = feedbackForm.querySelector(`#${key}`);
                if (input) input.value = data[key];
            });
        }
    };

  
    const saveFormData = () => {
        const formData = {};
        new FormData(feedbackForm).forEach((value, key) => {
            formData[key] = value;
        });
        localStorage.setItem("formData", JSON.stringify(formData));
    };

   
    openFormBtn.addEventListener("click", () => {
        formPopup.classList.remove("hidden");
        openFormBtn.classList.add("hidden");
        history.pushState({ formOpen: true }, "", "#form");
        loadFormData();
    });

    
    closeFormBtn.addEventListener("click", () => {
        formPopup.classList.add("hidden"); 
        openFormBtn.classList.remove("hidden"); 
        history.back();
    });

  
    window.addEventListener("popstate", (event) => {
        if (event.state && event.state.formOpen) {
            formPopup.classList.remove("hidden");
            openFormBtn.classList.add("hidden");
        } else {
            formPopup.classList.add("hidden");
            openFormBtn.classList.remove("hidden");
        }
    });


    feedbackForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(feedbackForm);
        saveFormData(); 

        try {
            const response = await fetch("https://formcarry.com/s/YOUR_FORM_ID", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                notification.textContent = "Данные успешно отправлены!";
                notification.style.backgroundColor = "#28a745";
                feedbackForm.reset(); 
                localStorage.removeItem("formData"); 
            } else {
                throw new Error("Ошибка отправки данных.");
            }
        } catch (error) {
            notification.textContent = error.message;
            notification.style.backgroundColor = "#dc3545";
        }

        notification.classList.remove("hidden");
        setTimeout(() => notification.classList.add("hidden"), 3000);
    });
});
