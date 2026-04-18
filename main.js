let menuItems = [];

document.addEventListener("DOMContentLoaded", () => {
    fetch('../menu.json')
        .then(response => {
            if (!response.ok) throw new Error();
            return response.json();
        })
        .then(data => {
            menuItems = data;
            displayItems(menuItems);
            setupMenuLogic();
        })
        .catch(error => {
            const container = document.getElementById("menu-container");
            if (container) container.innerHTML = "Error loading data.";
        });
});

function displayItems(filteredList) {
    const container = document.getElementById("menu-container");
    if (!container) return;
    container.innerHTML = "";

    if (filteredList.length === 0) {
        container.innerHTML = `<div class="col-12 text-start py-5"><h3 class="text-muted">No items match.</h3></div>`;
        return;
    }

    filteredList.forEach(item => {
        const col = document.createElement("div");
        col.className = "col-md-4 mb-4"; 
        col.innerHTML = `
            <div class="card h-100 shadow-sm border-0">
                ${item.image ? `<img src="${item.image}" class="card-img-top" style="height: 200px; object-fit: cover;">` : ""}
                <div class="card-header d-flex justify-content-between align-items-center bg-white border-0 pt-3">
                    <h6 class="mb-0 fw-bold">${item.name}</h6>
                    <span class="text-success small fw-bold">${item.price}</span>
                </div>
                <div class="card-body py-2">
                    <p class="card-text text-muted small">${item.description || ""}</p>
                </div>
                <div class="card-footer bg-white border-0 pb-3 d-flex justify-content-between">
                    ${item.calories ? `<span class="badge bg-success rounded-pill">${item.calories} Cal</span>` : "<span></span>"}
                    <span>${item.icon || ""}</span>
                </div>
            </div>`;
        container.appendChild(col);
    });
}

function setupMenuLogic() {
    const searchInput = document.getElementById("menuSearch");
    const filterButtons = document.querySelectorAll(".filter-btn");

    if (searchInput) {
        searchInput.addEventListener("input", function() {
            const searchTerm = this.value.toLowerCase();
            const searchResults = menuItems.filter(item => 
                item.name.toLowerCase().includes(searchTerm)
            );
            displayItems(searchResults);

            if (searchTerm !== "") {
                filterButtons.forEach(btn => {
                    btn.classList.remove("btn-success", "text-white");
                    btn.classList.add("btn-outline-success");
                });
            }
        });
    }

    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => {
                b.classList.remove("btn-success", "text-white");
                b.classList.add("btn-outline-success");
            });
            btn.classList.add("btn-success", "text-white");
            btn.classList.remove("btn-outline-success");

            if (searchInput) searchInput.value = ""; 

            const cat = btn.getAttribute("data-category");
            const results = cat === "All" ? menuItems : menuItems.filter(i => i.category === cat);
            displayItems(results);
        });
    });
}
//maps
document.addEventListener("DOMContentLoaded", () => {
    const map = L.map('map').setView([31.96, 35.86], 11);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    const branches = [
        {
            name: "Fitness Kitchen - Um Al Summaq",
            coords: [31.97952866441413, 35.85622693503841]
        },
        {
            name: "Fitness Kitchen - Al jubaiha",
            coords: [32.02589102283303, 35.86340540520551]
        },
        {
            name: "Fitness Kitchen - Marj Alhamam",
            coords: [31.883342171865394, 35.85368507614711]
        }
    ];

    branches.forEach(branch => {
        const marker = L.marker(branch.coords).addTo(map);
        
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${branch.coords[0]},${branch.coords[1]}`;
        
        marker.bindPopup(`
            <div style="text-align: center; font-family: 'DM Sans', sans-serif; padding: 5px;">
                <strong style="color: #1a1a2e; display: block; margin-bottom: 8px; font-size: 14px;">${branch.name}</strong>
                <a href="${googleMapsUrl}" target="_blank" 
                   style="display: inline-block; padding: 8px 15px; background-color: #1a7a40; color: white !important; text-decoration: none; border-radius: 5px; font-size: 12px; font-weight: bold; transition: 0.3s;">
                   Get Directions
                </a>
            </div>
        `);
    });
});