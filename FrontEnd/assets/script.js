document.addEventListener('DOMContentLoaded', function () {

  /////////////////////filter//////////////////////////////////
  const gallery = document.querySelector('.gallery');
  const imageContainer = document.getElementById('image-container');
  const buttonContainer = document.querySelector('.button-container');
  let currentCategory = '';
  let projects = [];
  let categories = [];

  // get categoryData from api
  async function fetchCategories() {
    try {
      const response = await fetch('http://localhost:5678/api/categories');
      console.log('Response status code (fetchCategories):', response.status);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      return response.json();
    } catch (error) {
      console.error('Failed get categories:', error);
    }
  }

  //loading Categories
  async function loadCategories() {
    try {
      const categorieData = await fetchCategories();
      categories = categorieData;
      console.log('Loaded categories:', categories);
      createCategoryButtons(categories);
      await loadProjects();
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  }
  loadCategories();

  // Create buttons of categories and add them to the page 
  function createCategoryButtons(categories) {
    buttonContainer.innerHTML = ''; //clear 
    const tousButton = document.createElement('button');
    tousButton.id = 'tous';
    tousButton.className = 'filter-button';
    tousButton.textContent = 'Tous';
    buttonContainer.appendChild(tousButton);
    // Iterate through other category data and create buttons 
    categories.forEach((category) => {
      const button = document.createElement('button');
      button.id = category.name;
      button.className = 'filter-button';
      button.textContent = category.name;
      buttonContainer.appendChild(button);
    });
  }

  // get projectdata 异步加载项目数据
  async function fetchProjects() {
    try {
      const response = await fetch('http://localhost:5678/api/works');
      console.log('Response status code (fetchProjects):', response.status);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      return response.json();
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  }

  //load main page projects
  async function loadProjects() {
    try {
      const projectData = await fetchProjects();
      projects = projectData;
      console.log('Loaded projects:', projects);
      displayProjectsInContainer(projects, 'gallery');
      // displayProjectsInContainer(projects, 'image-container');
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  }

  buttonContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('filter-button')) {
      const selectedCategory = event.target.id;
      console.log('Selected category:', selectedCategory);
      // Check if the same category is already selected, if so, return 检查是否已经选中相同类别，是则返回
      if (selectedCategory === currentCategory) {
        return;
      }
      // Remove the active state from the previous button 移除上一个按钮的激活状态
      const currentActiveButton = document.querySelector('.filter-button.active');
      if (currentActiveButton) {
        currentActiveButton.classList.remove('active');
      }
      currentCategory = selectedCategory;
      event.target.classList.add('active');
      // Call the filter projects function 调用筛选项目函数，并传递所选的类别
      filterProjects(currentCategory);
    }
  });

  //  Filter projects 筛选项目
  function filterProjects(category) {
    if (category === 'tous') {
      displayProjectsInContainer(projects, 'gallery');
    } else {
      // Otherwise, filter projects based on the selected category 否则，根据选定的类别筛选项目
      const filteredProjects = projects.filter((project) => project.category.name === category);
      displayFilteredProjects(filteredProjects);
    }
  }

  function displayFilteredProjects(filteredProjects) {
    gallery.innerHTML = '';
    if (filteredProjects.length > 0) {
      filteredProjects.forEach((project) => {
        const figure = createProjectFigure(project);
        gallery.appendChild(figure);
      });
    } else {
      gallery.innerHTML = 'No matching items';
    }
  }

  // render主页面时调用 gallery render弹窗时调用 imagecontainer
  function displayProjectsInContainer(projects, containerType) {
    const container = document.getElementById(containerType);
    container.innerHTML = '';
    if (!container) {
      console.error(`Container element "${containerType}" not found.`);
      return;
    }
    projects.forEach((project) => {
      if (containerType === 'gallery') {
        createProjectFigure(project);
      } else if (containerType === 'image-container') {
        openFirstPopup(project);
      }
    });
  }

  function createProjectFigure(project) {
    const figure = document.createElement('figure');
    const image = document.createElement('img');
    const figcaption = document.createElement('figcaption');
    image.src = project.imageUrl;
    image.alt = project.title;
    figcaption.textContent = project.title;
    figure.appendChild(image);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
    return figure;
  }

  // Get login status
  const userId = localStorage.getItem('userId');
  const loginLink = document.getElementById('login-link');
  const topBar = document.querySelector('.top-bar');
  const topBarIcon = document.querySelector('.top-bar .fa-pen-to-square');
  const topBarText = document.querySelector('.modifier');
  const mesProjetsIcon = document.querySelector('#portfolio .fa-pen-to-square');
  const mesProjetsText = document.querySelector('#portfolio .tool-text');
  // Check if user is logged in
  console.log('User ID:', userId);

  if (userId) {
    loginLink.textContent = 'logout'; //   login to logout
    if (topBar) {
      topBar.style.display = 'block';
      topBarIcon.style.display = 'block';
      topBarText.style.display = 'block';
      mesProjetsIcon.style.display = 'block';
      mesProjetsText.style.display = 'block';
    }
    buttonContainer.style.display = 'none';
  }

  loginLink.addEventListener('click', function () {
    if (userId) {
      // if click logout 
      console.log('User clicked "logout"');
      localStorage.removeItem('userId');
      localStorage.removeItem('token');
      location.href = './index.html';
    } else {
      console.log('User clicked "login"');
      location.href = './login.html';
    }
  });
  ////////////end of filter////////////

  //////////// the first popup deletion//////////////
  const projetsEditIcon = document.getElementById("edit-button");
  const overlay = document.getElementById("overlay-id");
  const addPhotoButton = document.querySelector(".add-photo-button");
  const firstPopup = document.getElementById("first-popup");
  const secondPopup = document.getElementById("second-popup");
  const closePopupIcons = document.querySelectorAll(".close-popup");
  const backButton = document.getElementById("back-button");

  //  Show the popup when the "projets" edit icon is clicked 
  projetsEditIcon.addEventListener("click", () => {
    overlay.style.display = "block";
    firstPopup.style.display = "block";
    secondPopup.style.display = "none";
    console.log("Edit icon clicked");
    openFirstPopup();
  });

  closePopupIcons.forEach((closePopupIcon) => {
    closePopupIcon.addEventListener("click", () => {
      overlay.style.display = "none";
      console.log("Close icon clicked");
    });
  });

  backButton.addEventListener("click", (e) => {
    e.stopPropagation();
    secondPopup.style.display = "none";
    firstPopup.style.display = "block";
    overlay.style.display = "block";
    console.log("Second popup hidden, First popup shown");
    openFirstPopup();
  });

  addPhotoButton.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    firstPopup.style.display = "none";
    secondPopup.style.display = "block";
    console.log("First popup hidden, Second popup shown");
    const file = fileInput.files[0];
    if (file) {
      showFileInputElements();
      uploadBlock.removeChild(imageThumbnail);
    }
    clearForm();
    const errorMessage = document.querySelector('.error-message');
    errorMessage.style.display = 'none';
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.style.display = "none";
      console.log("overlay clicked");
    }
  });

  function openFirstPopup() {
    imageContainer.innerHTML = '';
    // 循环遍历项目数据并渲染到 'imageContainer'
    projects.forEach((project) => {
      const imageBlock = document.createElement('div');
      imageBlock.className = 'image-block';
      const imageId = project.id;
      imageBlock.setAttribute('data-id', imageId);
      const image = document.createElement('img');
      image.src = project.imageUrl;
      image.alt = project.title;
      const deleteIcon = document.createElement('i');
      deleteIcon.className = 'fa-solid fa-trash-can';

      deleteIcon.addEventListener('click', async () => {
        if (imageId) {
          const token = getUserToken();
          if (token) {
            removeImageBlock(imageId);
            await deleteImage(imageId);
            projects = projects.filter((project) => project.id !== imageId);

            await loadProjects();
            displayProjectsInContainer(projects, 'image-container');
            console.log('ID of deleted image from popup : ' + imageId);
          }
        }
      });
      imageBlock.appendChild(image);
      imageBlock.appendChild(deleteIcon);
      imageContainer.appendChild(imageBlock);
      return imageBlock;
    });
  }

  // Remove the image block from the DOM
  function removeImageBlock(imageId) {
    const imageBlock = document.querySelector(`.image-block[data-id="${imageId}"]`);
    if (imageBlock) {
      imageBlock.remove();
      console.log('Image block removed from the DOM.');
    }
  }

  // request headers
  function getUserToken() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('User is not authenticated. Cannot delete image.');
    }
    return token;
  }

  //fetch delete api
  async function deleteImage(imageId) {
    if (!imageId) {
      console.error('Image ID is missing. Cannot delete image.');
      return false;
    }
    try {
      const token = getUserToken();
      if (token) {
        const response = await fetch(`http://localhost:5678/api/works/${imageId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        console.log('Response status code (deleteImage):', response.status);
        if (response.ok) {
          console.log(`Image with ID ${imageId} deleted from api
           successfully.`);
          return true;
        } else {
          console.error(`Failed to delete image with ID ${imageId}.`);
          return false;
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  ////////////end of first popup////////////

  //////////// second popup ////////////
  const fileInput = document.getElementById('file-input');
  const imageTitleInput = document.getElementById('image-title');
  const imageCategorySelect = document.getElementById('image-category');
  const validerButton = document.querySelector('.valider-button');
  const imageThumbnail = document.createElement('img');
  const imageIcon = document.getElementById('image-icon');
  const customFileLabel = document.querySelector('.custom-file-label');
  const paragraph = document.querySelector('.upload-block p');
  const uploadBlock = document.querySelector('.upload-block');

  // builds the request body
  function buildFormData() {
    const formData = new FormData();
    formData.append('image', fileInput.files[0]);
    formData.append('title', imageTitleInput.value);
    const categoryMap = {
      'Objets': 1,
      'Appartements': 2,
      'Hotels & restaurants': 3,
    };
    const CategoryId = categoryMap[imageCategorySelect.value];
    formData.append('category', CategoryId);
    return formData;
  }

  async function newImage(formData) {
    try {
      const token = getUserToken();
      if (token) {
        const response = await fetch('http://localhost:5678/api/works', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });
        console.log('Response status code (newImage):', response.status);
        if (response.ok) {
          // return await response.json();
          console.log(`newImage added from api
           successfully.`);
          return true;
        } else {
          console.error('Failed to add image.');
          return false;
        }
      }
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }

  // add iamge 
  validerButton.addEventListener('click', async (event) => {
    event.preventDefault();
    validerButton.style.backgroundColor = '#1D6154';

    if (validateUserInput()) {
      const formData = buildFormData();
      const token = getUserToken();
      if (token) {
        const newImageData = await newImage(formData);
        if (newImageData) {
          projects.push(newImageData);
          clearForm();
          uploadBlock.removeChild(imageThumbnail);
          showFileInputElements();

          displayProjectsInContainer(projects, 'gallery');
          displayProjectsInContainer(projects, 'image-container');
        }
      }
    }
    await loadProjects();
  });

  // add event change to display image thumbnails 为文件输入添加事件监听器
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) {
      hideFileInputElements();
      displayThumbnailImage(file);
    } else {
      uploadBlock.removeChild(imageThumbnail);
    }
  });

  // Create a function that validates user input
  function validateUserInput() {
    const errorMessage = document.querySelector('.error-message');
    const title = imageTitleInput.value;
    const imageCategoryName = imageCategorySelect.value;
    if (!title || !imageCategoryName || !fileInput.files[0]) {
      errorMessage.style.display = 'block';
      return false;
    } else {
      errorMessage.style.display = 'none';
      return true;
    }
  }

  function clearForm() {
    fileInput.value = null;
    imageTitleInput.value = '';
    imageCategorySelect.value = '';
  }

  function hideFileInputElements() {
    imageIcon.style.display = 'none';
    customFileLabel.style.display = 'none';
    paragraph.style.display = 'none';
  }

  function showFileInputElements() {
    imageIcon.style.display = 'block';
    customFileLabel.style.display = 'block';
    paragraph.style.display = 'block';
  }
  // 显示缩略图图像
  function displayThumbnailImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imageThumbnail.src = e.target.result;
      imageThumbnail.alt = imageTitleInput.value
      imageThumbnail.style.display = 'block';
    };
    reader.readAsDataURL(file);
    uploadBlock.appendChild(imageThumbnail);
  }
});


