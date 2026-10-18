/**
 * List mode: a simple searchable, sortable reference table. Good for
 * a quick lookup or old-fashioned studying.
 */

const ListView = (() => {
  let tbody, search;
  let sortField = "name";
  let sortAsc = true;

  function init() {
    tbody = document.getElementById("list-tbody");
    search = document.getElementById("list-search");
    search.addEventListener("input", render);

    document.querySelectorAll("#list-table th[data-field]").forEach((th) => {
      th.addEventListener("click", () => {
        const field = th.dataset.field;
        if (sortField === field) {
          sortAsc = !sortAsc;
        } else {
          sortField = field;
          sortAsc = true;
        }
        updateSortIndicators();
        render();
      });
    });

    updateSortIndicators();
    render();
  }

  function reset() {
    // A group with no details (the actives) sorts by name, since the
    // column it was sorted on is about to disappear.
    if (sortField !== "name" && !Roster.groupDetailFields().some((f) => f.field === sortField)) {
      sortField = "name";
      sortAsc = true;
    }
    updateSortIndicators();
    render();
  }

  function updateSortIndicators() {
    document.querySelectorAll("#list-table th[data-field]").forEach((th) => {
      th.classList.toggle("sort-asc", th.dataset.field === sortField && sortAsc);
      th.classList.toggle("sort-desc", th.dataset.field === sortField && !sortAsc);
    });
  }

  function render() {
    // Only show detail columns somebody in this group actually has.
    const fields = Roster.groupDetailFields();
    document.querySelectorAll("#list-table th[data-field]").forEach((th) => {
      th.hidden = th.dataset.field !== "name" && !fields.some((f) => f.field === th.dataset.field);
    });
    document.getElementById("list-swipe-hint").hidden = fields.length === 0;

    const q = search.value.trim().toLowerCase();
    let people = Roster.people().filter((p) => Roster.matches(p, q));

    people = people.slice().sort((a, b) => {
      // In "Everyone" the actives have no major/housing/hometown, so a
      // detail sort has to tolerate a missing value.
      const av = (sortField === "name" ? Utils.fullName(a) : a[sortField] || "").toLowerCase();
      const bv = (sortField === "name" ? Utils.fullName(b) : b[sortField] || "").toLowerCase();
      return av < bv ? -1 : av > bv ? 1 : 0;
    });
    if (!sortAsc) people.reverse();

    tbody.innerHTML = "";
    if (people.length === 0) {
      const row = Utils.el("tr");
      const cell = Utils.el("td", "empty-state", "No one matches that search.");
      cell.colSpan = fields.length + 1;
      row.appendChild(cell);
      tbody.appendChild(row);
      return;
    }

    for (const p of people) {
      const row = Utils.el("tr");
      row.appendChild(Utils.el("td", null, Utils.fullName(p)));
      for (const { field } of fields) {
        row.appendChild(Utils.el("td", null, p[field] || "—"));
      }
      tbody.appendChild(row);
    }
  }

  return { init, reset };
})();
