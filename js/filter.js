/* Portfolio Filter & Search Logic */
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const searchInput = document.getElementById('projectSearch');

    function filterProjects() {
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
        const searchTerm = searchInput.value.toLowerCase();

        projectCards.forEach(card => {
            const category = card.dataset.category;
            const title = card.querySelector('h3').textContent.toLowerCase();
            const text = card.querySelector('p').textContent.toLowerCase();
            
            const matchesFilter = activeFilter === 'all' || category === activeFilter;
            const matchesSearch = title.includes(searchTerm) || text.includes(searchTerm);

            if (matchesFilter && matchesSearch) {
                card.style.display = 'block';
                card.classList.add('show');
            } else {
                card.style.display = 'none';
                card.classList.remove('show');
            }
        });
    }

    /* Filter Button Click */
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterProjects();
        });
    });

    /* Search Input Event */
    searchInput.addEventListener('input', filterProjects);
});
