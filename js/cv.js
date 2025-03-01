document.addEventListener("DOMContentLoaded", function () {
    fetch("/content/resume.json")
        .then((response) => response.json())
        .then((data) => {
            renderResume(data);
            renderSectionLinks(data);
            addSmoothScroll();
        })
        .catch((error) => console.error("Error loading resume data:", error));
});

function renderResume(data) {
    const mainContent = document.getElementById("content");

    for (const [sectionKey, sectionValue] of Object.entries(data)) {
        const section = document.createElement("section");
        section.id = sectionKey;

        const heading = document.createElement("h2");
        heading.textContent = sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1);
        section.appendChild(heading);

        const sectionBox = document.createElement("div");
        sectionBox.className = "section-box";

        const tabulatedContent = document.createElement("div");
        tabulatedContent.className = "tabulated-content";

        if (Array.isArray(sectionValue)) {
            sectionValue.forEach((item) => {
                const itemDiv = document.createElement("div");
                itemDiv.className = "item";

                for (const [key, value] of Object.entries(item)) {
                    const p = document.createElement("p");
                    if (key.toLowerCase() === "email") {
                        p.innerHTML = `<strong>${key.charAt(0).toUpperCase() + key.slice(1)}</strong> <a href="mailto:${value}">${value}</a>`;
                    } else if (key.toLowerCase() === "link" || key.toLowerCase() === "url") {
                        p.innerHTML = `<strong>${key.charAt(0).toUpperCase() + key.slice(1)}</strong> <a href="${value}" target="_blank">Link</a>`;
                    } else {
                        p.innerHTML = `<strong>${key.charAt(0).toUpperCase() + key.slice(1)}</strong> ${value}`;
                    }
                    itemDiv.appendChild(p);
                }

                tabulatedContent.appendChild(itemDiv);
            });
        } else {
            const itemDiv = document.createElement("div");
            itemDiv.className = "item";

            for (const [key, value] of Object.entries(sectionValue)) {
                const p = document.createElement("p");
                if (key.toLowerCase() === "email") {
                    p.innerHTML = `<strong>${key.charAt(0).toUpperCase() + key.slice(1)}</strong> <a href="mailto:${value}">${value}</a>`;
                } else if (key.toLowerCase() === "link" || key.toLowerCase() === "url") {
                    p.innerHTML = `<strong>${key.charAt(0).toUpperCase() + key.slice(1)}</strong> <a href="${value}" target="_blank">Link</a>`;
                } else {
                    p.innerHTML = `<strong>${key.charAt(0).toUpperCase() + key.slice(1)}</strong> ${value}`;
                }
                itemDiv.appendChild(p);
            }

            tabulatedContent.appendChild(itemDiv);
        }

        sectionBox.appendChild(tabulatedContent);
        section.appendChild(sectionBox);
        mainContent.appendChild(section);
    }
}

function renderSectionLinks(data) {
    const sectionLinksContainer = document.querySelector(".section-links");

    for (const sectionKey of Object.keys(data)) {
        const listItem = document.createElement("li");
        const link = document.createElement("a");
        link.href = `#${sectionKey}`;
        link.textContent = sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1);
        listItem.appendChild(link);
        sectionLinksContainer.appendChild(listItem);
    }
}

function addSmoothScroll() {
    const links = document.querySelectorAll('.section-links a');
    links.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            const headerOffset = 1; // Adjust this value based on the height of your header
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });
}