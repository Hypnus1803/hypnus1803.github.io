document.addEventListener("DOMContentLoaded", () => {
    // Only proceed if there are item cards on the page
    const cards = document.querySelectorAll(".item-card");
    if (cards.length === 0) return;

    // 1. Create Modal DOM structure dynamically
    const modal = document.createElement("div");
    modal.className = "quickview-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.style.display = "none";

    modal.innerHTML = `
        <div class="quickview-backdrop"></div>
        <div class="quickview-container">
            <button class="quickview-close" aria-label="Close quick view">&times;</button>
            <div class="quickview-content">
                <div class="quickview-media">
                    <img class="quickview-img" src="" alt="">
                </div>
                <div class="quickview-details">
                    <div class="quickview-header-slot"></div>
                    <div class="quickview-body-slot"></div>
                    <div class="quickview-action-slot">
                        <a href="" class="quickview-contact-btn">I'm Interested - Send Message</a>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // 2. Select modal elements
    const backdrop = modal.querySelector(".quickview-backdrop");
    const closeBtn = modal.querySelector(".quickview-close");
    const qImg = modal.querySelector(".quickview-img");
    const qHeaderSlot = modal.querySelector(".quickview-header-slot");
    const qBodySlot = modal.querySelector(".quickview-body-slot");
    const qContactBtn = modal.querySelector(".quickview-contact-btn");

    // 3. Open Modal Handler
    const openModal = (card) => {
        const img = card.querySelector("img");
        const header = card.querySelector(".item-header");

        // Collect all description text and lists, excluding the image and the header
        let bodyHtml = "";
        const children = Array.from(card.children);
        children.forEach(child => {
            if (child.tagName !== "IMG" && !child.classList.contains("item-header")) {
                bodyHtml += child.outerHTML;
            }
        });

        // Populate slots
        qImg.src = img.src;
        qImg.alt = img.alt;
        qHeaderSlot.innerHTML = header.outerHTML;
        qBodySlot.innerHTML = bodyHtml;

        // Extract item name for the prefilled mailto link
        const h2Element = header.querySelector("h2");
        const itemTitle = h2Element ? h2Element.textContent.trim() : "Item Inquiry";
        
        // Detect language from HTML lang attribute
        const isCzech = document.documentElement.lang === "cs";
        
        // Subject line
        const mailSubjectText = isCzech ? `Mám zájem o: ${itemTitle}` : `Regarding: ${itemTitle}`;
        const mailSubject = encodeURIComponent(mailSubjectText);
        
        // Prefilled body text
        const mailBodyText = isCzech 
            ? `Dobrý den,\n\nmám zájem o vaši věc "${itemTitle}". Je stále k dispozici k vyzvednutí po 15. červnu?\n\nS pozdravem,\n[Vaše jméno]`
            : `Hi,\n\nI am interested in your item "${itemTitle}". Is it still available for pickup after June 15th?\n\nBest regards,\n[Your Name]`;
        const mailBody = encodeURIComponent(mailBodyText);
        
        // Set dynamic contact button text and link
        qContactBtn.textContent = isCzech ? "Mám zájem - Poslat zprávu" : "I'm Interested - Send Message";
        qContactBtn.href = `mailto:rozo@asu.cas.cz?subject=${mailSubject}&body=${mailBody}`;

        // Open modal with styling
        modal.style.display = "flex";
        document.body.style.overflow = "hidden"; // Prevent scrolling main page behind modal

        // Focus on close button for accessibility
        closeBtn.focus();
    };

    // 4. Close Modal Handler
    const closeModal = () => {
        modal.style.display = "none";
        document.body.style.overflow = ""; // Re-enable background scrolling
    };

    // 5. Setup Card Click Listeners and status determination
    cards.forEach(card => {
        // Detect current status (class or data-status)
        let isSold = card.classList.contains("sold") || card.getAttribute("data-status") === "sold";
        let isTaken = card.classList.contains("taken") || card.getAttribute("data-status") === "taken";

        // Auto-detect based on labels/text content if not already explicitly set
        if (!isSold && !isTaken) {
            const sectionLabel = card.querySelector(".section-label");
            const priceTag = card.querySelector(".price-tag, .free-tag");
            
            const checks = [];
            if (sectionLabel) checks.push(sectionLabel.textContent.toLowerCase().trim());
            if (priceTag) checks.push(priceTag.textContent.toLowerCase().trim());
            
            checks.forEach(text => {
                if (text.includes("sold") || text.includes("prodáno")) {
                    isSold = true;
                }
                if (text.includes("taken") || text.includes("darováno") || text.includes("převzato") || text.includes("vybráno")) {
                    isTaken = true;
                }
            });
        }

        // Apply status class and data attributes if detected
        if (isSold) {
            card.classList.add("sold");
            card.setAttribute("data-status", "sold");
        } else if (isTaken) {
            card.classList.add("taken");
            card.setAttribute("data-status", "taken");
        }

        const img = card.querySelector("img");
        if (img) {
            img.addEventListener("click", (e) => {
                if (card.classList.contains("sold") || card.classList.contains("taken")) {
                    return; // Prevent opening modal for sold or taken items
                }
                e.stopPropagation();
                openModal(card);
            });
        }
    });

    // 6. Close Event Listeners
    closeBtn.addEventListener("click", closeModal);
    backdrop.addEventListener("click", closeModal);
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.style.display === "flex") {
            closeModal();
        }
    });
});
