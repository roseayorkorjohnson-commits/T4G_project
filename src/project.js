
// Hamburger icon

const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
}



//shop script


    const searchInput = document.getElementById('searchInput');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const productsGrid = document.querySelector('.products');
    const hiddenWrapper = document.querySelector('.hidden-products');
    const viewMoreBtn = document.querySelector('.view-more-btn');
    const noResultsEl = document.querySelector('.no-results');

    const allCards = Array.from(document.querySelectorAll('.products .card')).concat(Array.from(document.querySelectorAll('.hidden-products .card')));

    function getCardName(card){
        return (card.dataset.name || (card.querySelector('h3') && card.querySelector('h3').textContent) || '').toLowerCase();
    }

    function getCardCategory(card){
        return (card.dataset.category || '').toLowerCase();
    }

    function updateNoResults(show){
        if(!noResultsEl) return;
        noResultsEl.style.display = show ? 'block' : 'none';
    }

    function filterProducts(){
        const query = (searchInput && searchInput.value || '').trim().toLowerCase();
        const activeCatBtn = document.querySelector('.category-btn.active');
        const activeCat = activeCatBtn ? activeCatBtn.dataset.category : 'all';

        let anyVisible = false;
        let anyHiddenVisible = false;

        allCards.forEach(card => {
            const name = getCardName(card);
            const category = getCardCategory(card);
            const matchesCat = activeCat === 'all' || category === activeCat;
            const matchesSearch = !query || name.includes(query) || category.includes(query);
            const shouldShow = matchesCat && matchesSearch;

            if(shouldShow){
                card.classList.remove('filtered-out');
                anyVisible = true;
                if(card.closest('.hidden-products')){
                    anyHiddenVisible = true;
                    card.classList.add('visible');
                }
            } else {
                card.classList.add('filtered-out');
                if(card.closest('.hidden-products')){
                    card.classList.remove('visible');
                }
            }
        });

        // open/close hidden wrapper based on matches
        if(anyHiddenVisible){
            hiddenWrapper.classList.add('open');
        } else {
            hiddenWrapper.classList.remove('open');
        }

        // update button text
        if(viewMoreBtn){
            viewMoreBtn.textContent = hiddenWrapper.classList.contains('open') ? 'Show Less' : 'View More Products';
        }

        // show no results
        const visibleCount = allCards.filter(c => !c.classList.contains('filtered-out')).length;
        updateNoResults(visibleCount === 0);
    }

    // category button handlers
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterProducts();
        });
    });

    // search input
    if(searchInput){
        searchInput.addEventListener('input', () => {
            filterProducts();
        });
    }

    // view more explicit toggle
    if(viewMoreBtn){
        viewMoreBtn.addEventListener('click', () => {
            const isOpen = hiddenWrapper.classList.toggle('open');
            if(isOpen){
                // show hidden matches with stagger
                document.querySelectorAll('.hidden-products .card').forEach((card, idx) => {
                    if(!card.classList.contains('filtered-out')){
                        setTimeout(() => card.classList.add('visible'), idx * 80);
                    }
                });
                viewMoreBtn.textContent = 'Show Less';
            } else {
                document.querySelectorAll('.hidden-products .card').forEach(card => card.classList.remove('visible'));
                viewMoreBtn.textContent = 'View More Products';
            }
        });
    }        
              document.querySelector(".shop-controls button").addEventListener("click", filterProducts);
    // initial filter to respect category/search defaults
    filterProducts();


//Custom script

const uploadZone = document.getElementById('uploadZone');
        const orderImageInput = document.getElementById('orderImageInput');
        const uploadPreview = document.getElementById('uploadPreview');
        const previewThumb = document.getElementById('previewThumb');
        const previewName = document.getElementById('previewName');
        const removeImageBtn = document.getElementById('removeImageBtn');

        function updatePreview(file) {
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
                previewThumb.style.backgroundImage = `url(${reader.result})`;
                previewName.textContent = file.name;
                uploadPreview.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        }

        uploadZone.addEventListener('click', () => orderImageInput.click());

        uploadZone.addEventListener('dragover', (event) => {
            event.preventDefault();
            uploadZone.classList.add('upload-hover');
        });

        ['dragleave', 'drop'].forEach((eventName) => {
            uploadZone.addEventListener(eventName, (event) => {
                event.preventDefault();
                uploadZone.classList.remove('upload-hover');
            });
        });

        uploadZone.addEventListener('drop', (event) => {
            const file = event.dataTransfer.files[0];
            if (file) {
                orderImageInput.files = event.dataTransfer.files;
                updatePreview(file);
            }
        });

        orderImageInput.addEventListener('change', () => {
            const file = orderImageInput.files[0];
            if (file) {
                updatePreview(file);
            }
        });

        removeImageBtn.addEventListener('click', () => {
            orderImageInput.value = '';
            uploadPreview.classList.add('hidden');
            previewThumb.style.backgroundImage = '';
            previewName.textContent = '';
        });





