document.addEventListener('DOMContentLoaded', () => {
    const projectsContainer = document.getElementById('projects-container');
    const uploadProjectLink = document.getElementById('upload-project-link');
    const uploadProjectModal = document.getElementById('upload-project-modal');
    const closeModalBtn = document.querySelector('.close');
    const projectUploadForm = document.getElementById('project-upload-form');

    // Fetch and display projects
    async function fetchProjects() {
        try {
            const response = await fetch('/projects');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new TypeError("Oops, we haven't got JSON!");
            }
            const data = await response.json();
            
            projectsContainer.innerHTML = ''; // Clear existing projects
            
            if (!data.projects || data.projects.length === 0) {
                projectsContainer.innerHTML = '<p class="no-projects">No projects available yet. Be the first to upload!</p>';
                return;
            }

            data.projects.forEach(project => {
                const projectCard = document.createElement('div');
                projectCard.classList.add('project-card');
                projectCard.innerHTML = `
                    <img src="${project.projectPhotos[0]}" alt="${project.name}" onerror="this.src='/images/default-project.jpg'">
                    <h3>${project.name}</h3>
                    <p class="project-type">Type: ${project.type}</p>
                    <p class="project-price">Price: $${project.price.toLocaleString()}</p>
                    <p class="project-innovator">By: ${project.innovatorName}</p>
                    <button class="view-details" data-id="${project._id}">View Details</button>
                `;

                const viewDetailsBtn = projectCard.querySelector('.view-details');
                viewDetailsBtn.addEventListener('click', () => showProjectDetails(project._id));

                projectsContainer.appendChild(projectCard);
            });
        } catch (error) {
            console.error('Error fetching projects:', error);
            projectsContainer.innerHTML = `<p class="error">Error loading projects: ${error.message}</p>`;
        }
    }

    // Show project details
    async function showProjectDetails(projectId) {
        try {
            const response = await fetch(`/projects/${projectId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new TypeError("Oops, we haven't got JSON!");
            }
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || 'Failed to fetch project details');
            }

            const project = data.project;
            
            // Create and show modal with project details
            const detailsModal = document.createElement('div');
            detailsModal.classList.add('modal', 'project-details-modal');
            detailsModal.innerHTML = `
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h2>${project.name}</h2>
                    <div class="project-images">
                        ${project.projectPhotos.map(photo => `
                            <img src="${photo}" alt="${project.name}" class="project-photo">
                        `).join('')}
                    </div>
                    ${project.projectVideo ? `
                        <div class="project-video">
                            <video controls>
                                <source src="${project.projectVideo}" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    ` : ''}
                    <div class="project-info">
                        <p><strong>Type:</strong> ${project.type}</p>
                        <p><strong>Description:</strong> ${project.description}</p>
                        <p><strong>Price:</strong> $${project.price.toLocaleString()}</p>
                        <p><strong>Innovator:</strong> ${project.innovatorName}</p>
                        <p><strong>Contact:</strong> ${project.innovatorContact}</p>
                    </div>
                    <button class="buy-button">Buy Now</button>
                </div>
            `;

            document.body.appendChild(detailsModal);

            // Close button functionality
            const closeBtn = detailsModal.querySelector('.close');
            closeBtn.onclick = () => {
                detailsModal.remove();
            };

            // Buy button functionality
            const buyButton = detailsModal.querySelector('.buy-button');
            buyButton.onclick = () => {
                alert('Purchase functionality will be implemented soon!');
            };

            // Close on outside click
            window.onclick = (event) => {
                if (event.target === detailsModal) {
                    detailsModal.remove();
                }
            };
        } catch (error) {
            console.error('Error fetching project details:', error);
            alert(`Error loading project details: ${error.message}`);
        }
    }

    // Handle form submission
    if (projectUploadForm) {
        projectUploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                const formData = new FormData(projectUploadForm);
                
                const response = await fetch('/projects/upload', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const contentType = response.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    throw new TypeError("Response was not JSON");
                }

                const data = await response.json();

                if (!data.success) {
                    throw new Error(data.message || 'Upload failed');
                }

                // Close modal and reset form
                uploadProjectModal.style.display = 'none';
                projectUploadForm.reset();
                
                // Refresh projects list
                fetchProjects();
                
                alert('Project uploaded successfully!');
            } catch (error) {
                console.error('Error uploading project:', error);
                alert(`Error uploading project: ${error.message}`);
            }
        });
    }

    // Modal functionality
    if (uploadProjectLink) {
        uploadProjectLink.addEventListener('click', () => {
            uploadProjectModal.style.display = 'block';
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            uploadProjectModal.style.display = 'none';
            projectUploadForm.reset();
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target === uploadProjectModal) {
            uploadProjectModal.style.display = 'none';
            if (projectUploadForm) {
                projectUploadForm.reset();
            }
        }
    });

    // Initial fetch of projects
    fetchProjects();
});
