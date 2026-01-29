document.addEventListener("DOMContentLoaded", function () {
    fetch("/content/publications.json")
        .then((response) => response.json())
        .then((data) => {
            renderPublications(data);
            renderSectionLinks(data);
            addSmoothScroll();
        })
        .catch((error) => console.error("Error loading publications data:", error));
});

function renderPublications(data) {
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
                    appendPublicationField(itemDiv, key, value);
                }

                tabulatedContent.appendChild(itemDiv);
            });
        } else {
            const itemDiv = document.createElement("div");
            itemDiv.className = "item";

            for (const [key, value] of Object.entries(sectionValue)) {
                appendPublicationField(itemDiv, key, value);
            }

            tabulatedContent.appendChild(itemDiv);
        }

        sectionBox.appendChild(tabulatedContent);
        section.appendChild(sectionBox);
        mainContent.appendChild(section);
    }
}

function appendPublicationField(container, key, value) {
    const normalizedKey = key.toLowerCase();
    const label = key.charAt(0).toUpperCase() + key.slice(1);

    if (normalizedKey === "email") {
        const p = document.createElement("p");
        p.innerHTML = `<strong>${label}</strong> <a href="mailto:${value}">${value}</a>`;
        container.appendChild(p);
        return;
    }

    if (normalizedKey === "link" || normalizedKey === "url" || normalizedKey === "adsurl") {
        const p = document.createElement("p");
        p.innerHTML = `<strong>${label}</strong> <a href="${value}" target="_blank">Link</a>`;
        container.appendChild(p);
        return;
    }

    if (normalizedKey === "abstract" && value && typeof value === "object" && !Array.isArray(value)) {
        const abstractParagraph = document.createElement("p");
        abstractParagraph.className = "abstract-paragraph";
        const subEntries = Object.entries(value);
        const lines = subEntries.map(([subKey, subValue]) => {
            const subLabel = subKey.charAt(0).toUpperCase() + subKey.slice(1);
            return `<em>${subLabel}</em>: ${subValue}`;
        });
        abstractParagraph.innerHTML = `<span class="abstract-label">${label}</span><span class="abstract-content">${lines.join("<br>")}</span>`;
        container.appendChild(abstractParagraph);
        return;
    }

    const p = document.createElement("p");
    p.innerHTML = `<strong>${label}</strong> ${value}`;
    container.appendChild(p);
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

// function addSmoothScroll() {
//     const links = document.querySelectorAll('.section-links a');
//     links.forEach(link => {
//         link.addEventListener('click', function (event) {
//             event.preventDefault();
//             const targetId = this.getAttribute('href').substring(1);
//             const targetElement = document.getElementById(targetId);
//             const headerOffset = 1; // Adjust this value based on the height of your header
//             const elementPosition = targetElement.getBoundingClientRect().top;
//             const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

//             window.scrollTo({
//                 top: offsetPosition,
//                 behavior: 'smooth'
//             });
//         });
//     });
// }