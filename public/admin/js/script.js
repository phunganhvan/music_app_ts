// preview ảnh
//preview
const upload = document.querySelector("[upload-image]");
if (upload) {
    const uploadImage = document.querySelector("[upload-image-input]");
    const uploadPreview = document.querySelector("[upload-image-preview]");
    const defaultSrcImg = uploadPreview.getAttribute("defaultValue");
    // console.log(defaultSrcImg);
    uploadImage.addEventListener("change", () => {
        const [file] = uploadImage.files
        if (file) {
            // console.log(file);
            uploadPreview.src = URL.createObjectURL(file);
        }
    });
    const closePreview = document.querySelector("[close-preview]")
    closePreview.addEventListener("click", () => {
        let value = uploadImage.value
        if (value) {
            uploadImage.value = "";
            uploadPreview.src = defaultSrcImg || "";
        }
        else {
            alert("Vui lòng chọn 1 ảnh");
            return;
        }
    })
}


// alert
// logic cho alert 

const showAlert = document.querySelector("[show-alert]");

if (showAlert) {
    const time = parseInt(showAlert.getAttribute("data-time"));
    const closeAlert = showAlert.querySelector("[close-alert]");
    // console.log(closeAlert);
    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden")
        return;
    })
    setTimeout(() => {
        showAlert.classList.add("alert-hidden")
    }, time)
}