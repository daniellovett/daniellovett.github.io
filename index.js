function carouselBtnClick(evt) {
    var current = document.getElementsByClassName("headline active");
    current[0].className = current[0].className.replace(" active", "");
    evt.target.className += " active";
}

function init() {
    const newDiv = "<div></div>";

    $("#carousel-container").load("carousel.html");
    $("#navbar-container").load("navbar.html");
    $("#skills-container").load("skills.html");

    $.get("config.json", function (config) {
        const strengths = config.strengths;
        const carouselBtns = $("#strengths-carousel-btns");
        const carousel = $("#strengths-carousel");
        Object.entries(strengths).forEach(function (strength, i) {
            let btn = $(`<button>${strength[0]}</button>`);
            btn.addClass("headline")
                .prop("type", "button")
                .attr({
                    "data-bs-target": "#strengths-carousel",
                    "data-bs-slide-to": i,
                    "aria-label": strength[0]
                })
                .click(carouselBtnClick)
                .appendTo(carouselBtns);

            let item = $(newDiv);
            item.addClass("carousel-item")
                .appendTo(carousel);

            let card = $(newDiv);
            card.addClass("card h-100 text-white bg-dark mx-1")
                .appendTo(item);

            let body = $(newDiv);
            body.addClass("card-body strength-card")
                .appendTo(card);

            if (strength[1].text) {
                let text = $(`<p>${strength[1].text}</p>`);
                text.addClass("card-text")
                    .appendTo(body);
            };

            if (strength[1].skills) {
                strength[1].skills.forEach(function (skill) {
                    let badge = $(`<span>${skill}</span>`);
                    badge.addClass(`badge skill-badge bg-info text-dark`);
                    badge.appendTo(body);
                });
            };

            if (i === 0) {
                btn.addClass("active")
                    .attr("aria-current", "true");
                item.addClass("active");
            };
        });


        const levels = config.skillLevels;
        const techSkills = config.techSkills;
        const skillsList = $("#skills-list")[0];
        Object.entries(techSkills).forEach(function (area) {
            let li = $(`<li>${area[0]}: </li>`);
            li.addClass("list-group-item skills-list-item");
            li.appendTo(skillsList);

            Object.entries(area[1]).forEach(function (level) {
                level[1].forEach(function (skill) {
                    let badge = $(`<span>${skill}</span>`);
                    let levelText = level[0];
                    badge.addClass(`badge skill-badge ${levels[levelText]}`);
                    badge.appendTo(li);
                    let hiddenText = $(`<span> (${levelText})</span>`);
                    hiddenText.addClass("visually-hidden");
                    hiddenText.appendTo(badge);
                })
            })
        })
    })

}

window.addEventListener("DOMContentLoaded", function (evt) {
    init();
})