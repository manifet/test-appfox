const faqItems = document.querySelectorAll(".faq__item")
faqItems.forEach((item) => {
    item.addEventListener("click", () => {
        const hasActive = item.classList.contains("active")

        faqItems.forEach((item) => {
            item.classList.remove("active")
        })

        if (!hasActive) {
            item.classList.add("active")
        }
    })
})