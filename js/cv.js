document.addEventListener("DOMContentLoaded", function () {
    fetch("/content/resume.json")
        .then((response) => response.json())
        .then((data) => {
            renderResume(data);
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

        if (Array.isArray(sectionValue)) {
            sectionValue.forEach((item) => {
                const itemDiv = document.createElement("div");
                itemDiv.className = "item";

                for (const [key, value] of Object.entries(item)) {
                    const p = document.createElement("p");
                    p.innerHTML = `<strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${value}`;
                    itemDiv.appendChild(p);
                }

                section.appendChild(itemDiv);
            });
        } else {
            for (const [key, value] of Object.entries(sectionValue)) {
                const p = document.createElement("p");
                p.innerHTML = `<strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${value}`;
                section.appendChild(p);
            }
        }

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