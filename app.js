const app = document.getElementById("app");

let allGuesthouses = [];
let showingAll = false;

window.addEventListener("hashchange", router);
window.addEventListener("load", router);

async function router() {
  const hash = window.location.hash;

  if (hash.startsWith("#/guesthouse/")) {
    const id = hash.split("/")[2];
    showGuesthouse(id);
  } else {
    showHome();
  }
}

/* HOME – LIST GUESTHOUSES */
async function showHome() {
  app.innerHTML = `<div class="container">Loading guesthouses...</div>`;

  const { data, error } = await supabaseclient
    .from("guesthouses")
    .select(`
      *,
      images(image_url)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    app.innerHTML = "Failed to load guesthouses.";
    return;
  }

  allGuesthouses = data;
  showingAll = false;

  renderGuesthouses();
}

function renderGuesthouses() {
  const maxToShow = showingAll ? allGuesthouses.length : 10;
  const guesthousesToDisplay = allGuesthouses.slice(0, maxToShow);

  app.innerHTML = `
    <div class="container guesthouse-grid">
      ${guesthousesToDisplay.map(g => `
        <div class="card">
          <img src="${g.images?.[0]?.image_url || ''}" />
          <div class="card-content">
            <h3>${g.name}</h3>
            <p>${g.location}</p>
            <span class="badge">${g.price_range}</span>
            <a class="button" href="#/guesthouse/${g.id}">View Details</a>
          </div>
        </div>
      `).join("")}
    </div>

    ${!showingAll && allGuesthouses.length > 10 ? '<div class="container"><button id="viewMore" class="button">View More</button></div>' : ''}
  `;

  const viewMoreBtn = document.getElementById("viewMore");
  if (viewMoreBtn) {
    viewMoreBtn.addEventListener("click", () => {
      showingAll = true;
      renderGuesthouses();
    });
  }
}

/* DETAIL PAGE */
async function showGuesthouse(id) {
  app.innerHTML = `<div class="container">Loading...</div>`;

  const { data: guesthouse, error } = await supabaseclient
    .from("guesthouses")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    app.innerHTML = "Guesthouse not found.";
    return;
  }

  const { data: rooms } = await supabaseclient 
    .from("rooms")
    .select("*")
    .eq("guesthouse_id", id);

  const { data: images } = await supabaseclient 
    .from("images")
    .select("*")
    .eq("guesthouse_id", id)
    .order("sort_order");

  app.innerHTML = `
    <div class="container">
      <div class="carousel">
        ${images.map(img => `<img src="${img.image_url}" />`).join("")}
      </div>

      <h2>${guesthouse.name}</h2>
      <p>${guesthouse.location}</p>

      <h3>Rooms</h3>
      ${rooms.map(r => `
        <div class="room">
          <span>${r.room_type}</span>
          <strong>P ${r.price_per_night}</strong>
        </div>
      `).join("")}

      <h3>Amenities</h3>
      <div class="amenities">
        ${guesthouse.amenities.map(a => `
          <span class="amenity">${a}</span>
        `).join("")}
      </div>

      <a class="button" 
         href="https://wa.me/${guesthouse.whatsapp}?text=${encodeURIComponent(`Hello, I saw your guesthouse on Accolink and would like to book a room.`)}"
         target="_blank">
        WhatsApp to Book
      </a>

      <a class="button" href="tel:${guesthouse.phone}">
        Call to Book
      </a>

      <a class="button" href="#/">Back to Home</a>
    </div>
  `;
}
