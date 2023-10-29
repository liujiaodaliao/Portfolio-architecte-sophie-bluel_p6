document.addEventListener('DOMContentLoaded', function () {

  //filter//
  // Get the button elements 获取按钮元素
  const gallery = document.querySelector('.gallery');
  const buttonContainer = document.querySelector('.button-container');
  let currentCategory = '';
  let projectsData = [];
  let categories = [];

  //  Filter projects 筛选项目
  function filterProjects(category) {
    if (category === 'tous') {
      // If button "Tous"is clicked, display all projects 如果点 "Tous" 按钮，显示所有项目
      displayAllProjects(projectsData);
    } else {
      // Otherwise, filter projects based on the selected category 否则，根据选定的类别筛选项目
      const filteredProjects = projectsData.filter((project) => project.category.name === category);
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

function displayAllProjects(data) {
  gallery.innerHTML = '';
  data.forEach((project) => {
    const figure = createProjectFigure(project);
    gallery.appendChild(figure);
  });
}

function createProjectFigure(project) {
  const figure = document.createElement('figure');
  const image = document.createElement('img');
  image.src = project.imageUrl;
  image.alt = project.title;
  const figcaption = document.createElement('figcaption');
  figcaption.textContent = project.title;
  figure.appendChild(image);
  figure.appendChild(figcaption);
  return figure;
}

  //  Create filter buttons (add event listeners) 创建筛选按钮（添加事件监听器）
  buttonContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('filter-button')) {
      const selectedCategory = event.target.id;
      console.log('Selected category:', selectedCategory);
      // Check if the same category is already selected, if so, return 检查是否已经选中相同类别，如果是则返回
      if (selectedCategory === currentCategory) {
        return;
      }
      // Remove the active state from the previous button 移除上一个按钮的激活状态
      const currentActiveButton = document.querySelector('.filter-button.active');
      if (currentActiveButton) {
        currentActiveButton.classList.remove('active');
      }
      // Update the currently selected category更新当前选中的类别
      currentCategory = selectedCategory;
      // Add an active state to the current button 给当前按钮添加激活状态
      event.target.classList.add('active');
      // Call the filter projects function and pass the selected category 调用筛选项目函数，并传递所选的类别
      filterProjects(currentCategory);
    }
  });

  //  Load category data 加载类别数据
  loadCategories();

  async function loadCategories() {
    try {
      const response = await fetch('http://localhost:5678/api/categories');
      if (response.ok) {
        const data = await response.json();
        categories = data;  // Store category data in a global variable 将类别数据存储到全局变量
        console.log('Loaded categories:', categories);
        // Create filter buttons for other categories and add them to the page 创建其他类别按钮并添加到页面
        createCategoryButtons(categories);
        await loadData(); //   Load project data 加载项目数据
      } else {
        throw new Error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  }

  // Create filter buttons for other categories and add them to the page 创建其他类别筛选按钮并添加到页面
  function createCategoryButtons(categories) {
    buttonContainer.innerHTML = ''; //先清空
    const tousButton = document.createElement('button');
    tousButton.id = 'tous';
    tousButton.className = 'filter-button';
    tousButton.textContent = 'Tous';
    buttonContainer.appendChild(tousButton);
    // Iterate through other category data and create buttons 遍历其他类别数据并创建按钮
    categories.forEach((category) => {
      const button = document.createElement('button');
      button.id = category.name;
      button.className = 'filter-button';
      button.textContent = category.name;
      buttonContainer.appendChild(button);
    });

  }
  // Load project data
  async function loadData() {
    try {
      const response = await fetch('http://localhost:5678/api/works');
      if (response.ok) {
        const data = await response.json();
        projectsData = data; // Store project data in a global variable 将项目数据存储到全局变量
        console.log('Loaded data:', projectsData);
        // Display all projects on page load 页面加载后显示所有项目
        displayAllProjects(projectsData);
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  }

  // Get login status
  // const email = localStorage.getItem('email');
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
    // 隐藏筛选按钮，因为用户已登录
    buttonContainer.style.display = 'none';
  }


  loginLink.addEventListener('click', function () {
    if (userId) {
      // if click logout 
      console.log('User clicked "logout"');
      localStorage.removeItem('userId');
      localStorage.removeItem('token');
      location.href = './index.html'; // redirection to homepage
    } else {
      console.log('User clicked "login"');
      location.href = './login.html';
    }
  });
  //end of filter//

  // popup//
  // Get the overlay and element 获取弹窗和遮罩层元素
  const projetsEditIcon = document.getElementById("edit-button");
  const overlay = document.getElementById("overlay-id");
  const addPhotoButton = document.querySelector(".add-photo-button");
  const firstPopup = document.getElementById("first-popup");
  const secondPopup = document.getElementById("second-popup");
  const closeFirstPopupIcon = firstPopup.querySelector(".close-popup");
  const closeSecondPopupIcon = secondPopup.querySelector(".close-popup");
  const backButton = document.getElementById("back-button");

  //  Show the popup when the "projets" edit icon is clicked 点击 "projets" 编辑图标时显示弹窗
  projetsEditIcon.addEventListener("click", () => {
    overlay.style.display = "block";
    firstPopup.style.display = "block";
    secondPopup.style.display = "none";
    console.log("Edit icon clicked");
  });

  // Hide the popup when the close icon/overlay is clicked 点击关闭/遮盖层时隐藏弹窗
  closeFirstPopupIcon.addEventListener("click", () => {
    console.log("Close icon clicked");
    overlay.style.display = "none";
    firstPopup.style.display = "none";
  });

  closeSecondPopupIcon.addEventListener("click", () => {
    console.log("Close icon clicked");
    overlay.style.display = "none";
    secondPopup.style.display = "none";
  });

  //  event listener that returns the first pop-up window
  backButton.addEventListener("click", (e) => {
    e.stopPropagation();
    secondPopup.style.display = "none";
    firstPopup.style.display = "block";
    console.log("Second popup hidden, First popup shown");
  });

  //click button ajouter photo Switch from the first pop-up to the second
  addPhotoButton.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    firstPopup.style.display = "none";
    secondPopup.style.display = "block";
    console.log("First popup hidden, Second popup shown");
  });

  // overlay
  overlay.addEventListener("click", (e) => {
    // get element clicked
    const target = e.target;
    // Check whether the clicked element in the pop-up判断点击的元素是否是弹窗内的元素
    const isInsideFirstPopup = firstPopup.contains(target);
    const isInsideSecondPopup = secondPopup.contains(target);

    // If the clicked element is not in the pop-up close 如果点击的元素不在弹窗内，关闭弹窗
    if (!isInsideFirstPopup && !isInsideSecondPopup) {
      overlay.style.display = "none";
      console.log("overlay clicked");
    }
    
  });

  // Create an image block 创建图片盒子
  function createImageBlock(image) {
    const imageBlock = document.createElement('div');
    imageBlock.classList.add('image-block');
    imageBlock.setAttribute('data-image-id', image.id);
    // To identify images for deletion 
    const imgElement = document.createElement('img');
    imgElement.src = image.imageUrl;
    imgElement.alt = image.title;

    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('fa-solid', 'fa-trash-can');
    deleteIcon.addEventListener('click', (event) => {
      event.preventDefault();
      deleteImage(image.id);
      //  Remove the image from the interface 
      imageBlock.remove();
    });

    imageBlock.appendChild(imgElement);
    imageBlock.appendChild(deleteIcon);

    return imageBlock;
  }

  // Delete an image 
  async function deleteImage(imageId) {
    // get token
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('User is not authenticated. Cannot delete image.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5678/api/works/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log(`Image with ID ${imageId} deleted successfully.`);
        // Remove the image block from the DOM
        const imageBlock = document.querySelector(`.image-block[data-image-id="${imageId}"]`);
        getAndRenderImages();
        if (imageBlock) {
          imageBlock.remove();
        }
      } else {
        console.error(`Failed to delete image with ID ${imageId}.`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }


  // Get all image data and render it in the container 获取所有图片数据并渲染到盒子中
  async function getAndRenderImages() {
    try {
      const response = await fetch('http://localhost:5678/api/works');
      if (response.ok) {
        const imagesData = await response.json();
        console.log('Images data from API:', imagesData);

        const imageContainer = document.getElementById('image-container');
        imageContainer.innerHTML = '';
        // Render each image 
        imagesData.forEach((image) => {
          const imageBlock = createImageBlock(image);
          imageContainer.appendChild(imageBlock);
        });
      } else {
        console.error('Failed to fetch images.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  getAndRenderImages();
  //end of first popup//

  // Add project form, API interaction 添加项目表单，api/works post交互
  const uploadForm = document.getElementById('upload-form');
  const fileInput = document.getElementById('file-input');
  const imageTitleInput = document.getElementById('image-title');
  const imageCategorySelect = document.getElementById('image-category');
  const emptyOption = document.querySelector('.empty-option');
  const validerButton = document.querySelector('.valider-button');
  const imageThumbnail = document.createElement('img');
  const imageIcon = document.getElementById('image-icon');
  const customFileLabel = document.querySelector('.custom-file-label');
  const paragraph = document.querySelector('.upload-block p');
  const uploadBlock = document.querySelector('.upload-block');

  // 在 "change" 事件监听器中触发弹窗显示
  fileInput.addEventListener('change', () => {
    if (fileInput.files[0]) {
      imageIcon.style.display = 'none';
      fileInput.style.display = 'none';
      customFileLabel.style.display = 'none';
      paragraph.style.display = 'none';
      // display imageThumbnail 显示图片缩略图
      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        imageThumbnail.src = e.target.result;
        imageThumbnail.style.display = 'block';
      };
      reader.readAsDataURL(file);
      uploadBlock.appendChild(imageThumbnail);

      // pop-up window display
      overlay.style.display = 'block';
      secondPopup.style.display = 'block';

      console.log('File input change event triggered.');
    } else {
      // Hide image thumbnails
      imageThumbnail.style.display = 'none';
    }
  });

  // 创建一个函数，用于构建请求头
  function buildHeaders() {
    const token = localStorage.getItem('token');
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);
    return headers;
  }

  // 创建一个函数，用于构建请求体
  function buildFormData() {
    const formData = new FormData();
    formData.append('image', fileInput.files[0]);
    formData.append('title', imageTitle);
    const categoryMap = {
      'Objets': 1,
      'Appartements': 2,
      'Hotels & restaurants': 3,
    };
    const imageCategoryId = categoryMap[imageCategoryName];
    formData.append('category', imageCategoryId);
    return formData;
  }

  // 创建一个函数，用于发送 POST 请求并处理响应
  async function sendPostRequest(formData, headers) {
    try {
      const response = await fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: headers,
        body: formData,
      });

      if (response.ok) {
        return await response.json();
      } else {
        console.error('Failed to add image.');
        return null;
      }
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      return null;
    }
  }

  // 用于处理成功上传图片后的操作的函数
  function handleSuccessfulUpload() {
    // 清空表单字段
    fileInput.value = '';
    imageTitleInput.value = '';
    imageCategorySelect.value = '';
    imageThumbnail.style.display = 'none';
    // 关闭弹窗
    overlay.style.display = 'none';
    // 刷新项目库以显示新图片
    getAndRenderImages();
    console.log('Image added successfully.');
  }
  // 创建一个函数，用于验证用户输入
  function validateUserInput() {
    const errorMessage = document.querySelector('.error-message');
    let imageTitle = imageTitleInput.value;
    let imageCategoryName = imageCategorySelect.value;
    console.log('imageTitle:', imageTitle);
    console.log('imageCategoryName:', imageCategoryName);
    console.log('fileInput.files[0]:', fileInput.files[0]);
    // 验证用户输入是否完整，如果有错误，返回 false，否则返回 true
    if (!imageTitle || !imageCategoryName || !fileInput.files[0]) {
      errorMessage.style.display = 'block';
      console.log('Validation failed: Please fill in all required fields.');
      return false;
    } else {
      errorMessage.style.display = 'none';
      return true;
    }
  }

  // 在 valider 按钮的事件处理程序中调用这些函数
  validerButton.addEventListener('click', async () => {
    validerButton.style.backgroundColor = '#1D6154';  // 重置按钮样式
    imageTitle = imageTitleInput.value;
    imageCategoryName = imageCategorySelect.value;
    if (validateUserInput()) {
      const headers = buildHeaders();
      const formData = buildFormData();
      const data = await sendPostRequest(formData, headers);

      if (data !== null) {
        handleSuccessfulUpload();
      }
    }
  });






});


