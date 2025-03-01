document.addEventListener("DOMContentLoaded", function() {
    fetch('../content/resume.json')
        .then(response => response.json())
        .then(data => {
            const keywordsContainer = document.getElementById('keywords-container');
            const content = document.getElementById('content');

            // Create hyperlinks for main sections in the aside container
            Object.keys(data).forEach(section => {
                const link = document.createElement('a');
                link.href = `#${section}`;
                link.textContent = section.charAt(0).toUpperCase() + section.slice(1);
                keywordsContainer.appendChild(link);
                keywordsContainer.appendChild(document.createElement('br'));

                // Create titles in the main content area
                const sectionElement = document.createElement('section');
                sectionElement.id = section;
                const title = document.createElement('h2');
                title.textContent = section.charAt(0).toUpperCase() + section.slice(1);
                sectionElement.appendChild(title);

                // Add content based on section
                if (Array.isArray(data[section])) {
                    data[section].forEach(item => {
                        const itemElement = document.createElement('div');
                        itemElement.classList.add('item');
                        Object.keys(item).forEach(key => {
                            const keyElement = document.createElement('p');
                            keyElement.innerHTML = `<strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${item[key]}`;
                            itemElement.appendChild(keyElement);
                        });
                        sectionElement.appendChild(itemElement);
                    });
                } else if (typeof data[section] === 'object') {
                    Object.keys(data[section]).forEach(key => {
                        const keyElement = document.createElement('p');
                        keyElement.innerHTML = `<strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${data[section][key]}`;
                        sectionElement.appendChild(keyElement);
                    });
                }

                content.appendChild(sectionElement);
            });
        })
        .catch(error => console.error('Error fetching JSON:', error));
});