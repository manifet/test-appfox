"use strict";var faqItemHeads=document.querySelectorAll(".faq__item-wrap"),faqItems=document.querySelectorAll(".faq__item");faqItemHeads.forEach(function(e,a){e.addEventListener("click",function(){var e=faqItems[a],t=e.classList.contains("active");faqItems.forEach(function(e){e.classList.remove("active")}),t||e.classList.add("active")})});