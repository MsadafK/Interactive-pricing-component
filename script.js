document.addEventListener("DOMContentLoaded", () => {
  // retrieving DOM elements
  const range_input_el = document.getElementById("pricing");
  const princing_value = document.querySelector(
    ".main__billing-container__pricing-value"
  );

  const subscription_btn_el = document.querySelector(
    ".main__billing-container__form__reload-button"
  );

  const monthly_or_yearly_btn_el = document.querySelector(
    ".main__billing-container__monthly-or-yearly-button-container__monthly-or-yearly-button"
  );

  const page_count_el = document.querySelector(
    ".main__billing-container__page-count-value"
  );

  const price_values = [8, 12, 16, 24, 36];
  const page_count = ["10k", "50k", "100k", "500k", "1M"];

  let flag = false;

  // Improve range input accessibility
  range_input_el.setAttribute("aria-valuemin", "1");
  range_input_el.setAttribute("aria-valuemax", price_values.length);
  range_input_el.setAttribute("aria-valuenow", range_input_el.value);
  range_input_el.setAttribute("role", "slider");
  range_input_el.setAttribute("aria-orientation", "horizontal");

  range_input_el.addEventListener("input", updatePricing);

  function updatePricing() {
    const actual_value = princing_value.querySelector(
      ".main__billing-container__pricing-value__actual-value"
    );
    const monthly_or_yearly_tag = document.querySelector(
      ".main__billing-container__pricing-value__monthly-or-yearly-tag"
    );

    // Update aria attributes for range input
    range_input_el.setAttribute("aria-valuenow", range_input_el.value);

    // Create descriptive aria-label for current price
    const currentIndex = range_input_el.value - 1;
    const currentPageviews = page_count[currentIndex];
    const currentPrice = flag
      ? (Number(price_values[currentIndex]) * 12 * 0.75).toFixed(2)
      : Number(price_values[currentIndex]).toFixed(2);

    range_input_el.setAttribute(
      "aria-label",
      `Select pricing tier: ${currentPageviews} pageviews at $${currentPrice} ${
        flag ? "yearly" : "monthly"
      }`
    );

    if (flag) {
      const x = Number(price_values[currentIndex]) * 12;
      const y = x * 0.25;
      const z = x - y;
      actual_value.textContent = `$${z.toFixed(2)} `;
      monthly_or_yearly_tag.textContent = "/ year";
    } else {
      actual_value.textContent = `$${Number(price_values[currentIndex]).toFixed(
        2
      )} `;
      monthly_or_yearly_tag.textContent = "/ month";
    }

    page_count_el.textContent = `${page_count[currentIndex]} Pageviews`;

    updateSliderBackground();
  }

  function updateSliderBackground() {
    // Calculate the percentage of the slider's current value
    const value =
      ((range_input_el.value - 1) / (price_values.length - 1)) * 100;

    // Update the background using a linear gradient
    range_input_el.style.background = `linear-gradient(
      to right,
      hsl(174, 77%, 80%) 0%,
      hsl(174, 77%, 80%) ${value}%,
      hsl(224, 65%, 95%) ${value}%,
      hsl(224, 65%, 95%) 100%
    )`;
  }

  updatePricing();

  // Improve toggle button accessibility
  monthly_or_yearly_btn_el.addEventListener("click", () => {
    monthly_or_yearly_btn_el.classList.toggle("active");
    flag = !flag;

    // Update aria-checked attribute
    monthly_or_yearly_btn_el.setAttribute("aria-checked", flag);

    // Add audible feedback for screen readers
    const statusAnnouncement = document.createElement("div");
    statusAnnouncement.setAttribute("aria-live", "polite");
    statusAnnouncement.style.position = "absolute";
    statusAnnouncement.style.width = "1px";
    statusAnnouncement.style.height = "1px";
    statusAnnouncement.style.padding = "0";
    statusAnnouncement.style.overflow = "hidden";
    statusAnnouncement.style.clip = "rect(0, 0, 0, 0)";
    statusAnnouncement.style.whiteSpace = "nowrap";
    statusAnnouncement.textContent = flag
      ? "Yearly billing selected with 25% discount"
      : "Monthly billing selected";

    document.body.appendChild(statusAnnouncement);

    // Remove the announcement after a short delay
    setTimeout(() => {
      document.body.removeChild(statusAnnouncement);
    }, 3000);

    updatePricing();
  });

  subscription_btn_el.addEventListener("click", (event) => {
    event.preventDefault();

    // Add confirmation dialog for screen reader users
    const confirmReload = confirm(
      "Are you sure you want to restart the trial? This will reset the page."
    );
    if (confirmReload) {
      window.location.reload();
    }
  });
});
