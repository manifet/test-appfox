const faqItemHeads = document.querySelectorAll(".faq__item-wrap")
const faqItems = document.querySelectorAll(".faq__item")

faqItemHeads.forEach((item, index) => {
    item.addEventListener("click", () => {
        const currentItem = faqItems[index]
        const hasActive = currentItem.classList.contains("active")

        faqItems.forEach((item) => {
            item.classList.remove("active")
        })

        if (!hasActive) {
            currentItem.classList.add("active")
        }
    })
})