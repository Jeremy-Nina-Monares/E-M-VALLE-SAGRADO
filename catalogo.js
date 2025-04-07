document.addEventListener('DOMContentLoaded', function() {
    // Filter Variables
    const filterButton = document.querySelector('.filter-button');
    const propertyTypeSelect = document.getElementById('property-type');
    const locationSelect = document.getElementById('location');
    const priceRangeSelect = document.getElementById('price-range');
    const sortBySelect = document.getElementById('sort-by');
    const catalogProperties = document.querySelectorAll('.catalog-property');
    
    // Save/Favorite Properties
    const saveButtons = document.querySelectorAll('.property-save');
    saveButtons.forEach(button => {
        button.addEventListener('click', function() {
            const heartIcon = this.querySelector('i');
            heartIcon.classList.toggle('far');
            heartIcon.classList.toggle('fas');
            heartIcon.classList.toggle('text-danger');
            
            // Here you could add logic to save to localStorage or send to server
            if (heartIcon.classList.contains('fas')) {
                // Property saved to favorites
                console.log('Property added to favorites');
            } else {
                // Property removed from favorites
                console.log('Property removed from favorites');
            }
        });
    });
    
    // Filter Properties Function
    function filterProperties() {
        const selectedType = propertyTypeSelect.value;
        const selectedLocation = locationSelect.value;
        const selectedPriceRange = priceRangeSelect.value;
        
        catalogProperties.forEach(property => {
            const propertyType = property.getAttribute('data-type');
            const propertyLocation = property.getAttribute('data-location');
            const propertyPrice = parseInt(property.getAttribute('data-price'));
            
            // Type match check
            const typeMatch = selectedType === 'all' || propertyType === selectedType;
            
            // Location match check
            const locationMatch = selectedLocation === 'all' || propertyLocation === selectedLocation;
            
            // Filter by price range
            let priceMatch = true;
            if (selectedPriceRange !== 'all') {
                const priceRange = selectedPriceRange.split('-');
                if (priceRange.length === 2) {
                    const minPrice = parseInt(priceRange[0]);
                    const maxPrice = parseInt(priceRange[1]);
                    priceMatch = propertyPrice >= minPrice && propertyPrice <= maxPrice;
                } else if (selectedPriceRange === '500000+') {
                    priceMatch = propertyPrice >= 500000;
                }
            }
            
            // Show or hide property based on filters
            if (typeMatch && locationMatch && priceMatch) {
                property.style.display = 'block';
            } else {
                property.style.display = 'none';
            }
        });
        
        // Update count or display message if no results
        updateResultsCount();
    }
    
    // Sort Properties Function
    function sortProperties() {
        const sortValue = sortBySelect.value;
        const propertiesArray = Array.from(catalogProperties);
        
        switch (sortValue) {
            case 'price-low':
                propertiesArray.sort((a, b) => {
                    return parseInt(a.getAttribute('data-price')) - parseInt(b.getAttribute('data-price'));
                });
                break;
            case 'price-high':
                propertiesArray.sort((a, b) => {
                    return parseInt(b.getAttribute('data-price')) - parseInt(a.getAttribute('data-price'));
                });
                break;
            case 'size':
                propertiesArray.sort((a, b) => {
                    const sizeA = extractSize(a);
                    const sizeB = extractSize(b);
                    return sizeB - sizeA;
                });
                break;
            case 'newest':
                // In a real application, you would sort by date added
                // Here we'll just keep the default order
                break;
        }
        
        // Reappend sorted properties to the grid
        const catalogGrid = document.querySelector('.catalog-grid');
        propertiesArray.forEach(property => {
            catalogGrid.appendChild(property);
        });
    }
    
    // Helper function to extract size from property features
    function extractSize(property) {
        const featuresSpans = property.querySelectorAll('.property-features span');
        let size = 0;
        
        featuresSpans.forEach(span => {
            const sizeText = span.innerText.match(/\d+\s*m²/);
            if (sizeText) {
                size = parseInt(sizeText[0]);
            }
        });
        
        return size;
    }
    
    // Update the count of displayed properties
    function updateResultsCount() {
        const visibleProperties = Array.from(catalogProperties).filter(prop => prop.style.display !== 'none');
        const totalProperties = catalogProperties.length;
        const catalogHeader = document.querySelector('.catalog-header h2');
        
        if (visibleProperties.length === 0) {
            catalogHeader.textContent = 'No se encontraron propiedades';
            // You could also display a message in the grid
        } else if (visibleProperties.length === totalProperties) {
            catalogHeader.textContent = 'Nuestras Propiedades';
        } else {
            catalogHeader.textContent = `Propiedades (${visibleProperties.length} de ${totalProperties})`;
        }
    }
    
    // Event Listeners
    filterButton.addEventListener('click', filterProperties);
    
    sortBySelect.addEventListener('change', sortProperties);
    
    // Pagination (dummy functionality)
    const paginationLinks = document.querySelectorAll('.pagination a');
    paginationLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            paginationLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // In a real application, you would load different properties here
            // For this demo, we'll just scroll to top
            window.scrollTo({
                top: document.querySelector('.catalog-section').offsetTop - 100,
                behavior: 'smooth'
            });
        });
    });
    
    // Save favorites to localStorage
    function saveFavorites() {
        const favoriteProperties = [];
        document.querySelectorAll('.property-save i.fas').forEach(icon => {
            const property = icon.closest('.catalog-property');
            const propertyId = property.querySelector('h3').textContent;
            favoriteProperties.push(propertyId);
        });
        
        localStorage.setItem('favoriteProperties', JSON.stringify(favoriteProperties));
    }
    
    // Load favorites from localStorage
    function loadFavorites() {
        const favoriteProperties = JSON.parse(localStorage.getItem('favoriteProperties')) || [];
        
        favoriteProperties.forEach(propertyId => {
            document.querySelectorAll('.catalog-property').forEach(property => {
                if (property.querySelector('h3').textContent === propertyId) {
                    const heartIcon = property.querySelector('.property-save i');
                    heartIcon.classList.remove('far');
                    heartIcon.classList.add('fas');
                    heartIcon.classList.add('text-danger');
                }
            });
        });
    }
    
    // Execute on page load
    loadFavorites();
    
    // Save favorites when leaving page
    window.addEventListener('beforeunload', saveFavorites);
});