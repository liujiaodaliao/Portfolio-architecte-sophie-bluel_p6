document.addEventListener('DOMContentLoaded', function () {

  /////////////////////filter//////////////////////////////////
  const gallery = document.querySelector('.gallery');
  const imageContainer = document.getElementById('image-container');
  const buttonContainer = document.querySelector('.button-container');
  let currentCategory = '';
  let projects = [];
  let categories = [];

  // 异步获取类别数据
  async function fetchCategories() {
    const response = await fetch('http://localhost:5678/api/categories');
    console.log('Response status code (fetchCategories):', response.status);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return response.json();
  }

  // 存储类别数据到全局变量
  function storeCategories(categoryData) {
    categories = categoryData;  // Store category data in a global variable 将类别数据存储到全局变量
    console.log('Loaded categories:', categories);
  }

  //主函数 异步加载类别和项目数据
  async function loadCategories() {
    try {
      const categoryData = await fetchCategories();
      storeCategories(categoryData);
      createCategoryButtons(categories);
      await loadProjects();
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  }
  loadCategories();
  // Create buttons of categories and add them to the page 
  //创建其他类别筛选按钮并添加到页面
  function createCategoryButtons(categories) {
    buttonContainer.innerHTML = ''; //clear 
    const tousButton = document.createElement('button');
    tousButton.id = 'tous';
    tousButton.className = 'filter-button';
    tousButton.textContent = 'Tous';
    buttonContainer.appendChild(tousButton);
    // Iterate through other category data and create buttons 
    //遍历其他类别并创建按钮
    categories.forEach((category) => {
      const button = document.createElement('button');
      button.id = category.name;
      button.className = 'filter-button';
      button.textContent = category.name;
      buttonContainer.appendChild(button);
    });
  }

  // Load project data 异步加载项目数据
  async function fetchProjects() {
    const response = await fetch('http://localhost:5678/api/works');
    console.log('Response status code (fetchProjects):', response.status);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    return response.json();
  }

  // Store project data in a global variable 将项目数据存储到全局变量
  function storeProjects(projectData) {
    projects = projectData;
    console.log('Loaded projectData:', projects);
  }

  //主函数来加载主页面项目数据
  async function loadProjects() {
    try {
      const projectData = await fetchProjects();
      storeProjects(projectData);
      displayProjectsInContainer(projects, 'gallery');
      // displayProjectsInContainer(projects, containerType);
    } catch (error) {
      console.error('Failed to load projectData:', error);
    }
  }

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
      currentCategory = selectedCategory;
      // Add an active state to the current button 给当前按钮添加激活状态
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
        // const figure = createProjectFigure(project);
        createProjectFigure(project);
      } else if (containerType === 'image-container') {
        // const imageBlock = openFirstPopup(project);
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
      location.href = './index.html'; // redirection to homepage
    } else {
      console.log('User clicked "login"');
      location.href = './login.html';
    }
  });
  //end of filter//

  //////////// the first popup deletion////////////////////////////////////////////
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
    openFirstPopup();
  });

  // Hide the popup when the close icon/overlay is clicked 点击关闭/遮盖层时隐藏弹窗
  closeFirstPopupIcon.addEventListener("click", () => {
    console.log("Close icon clicked");
    overlay.style.display = "none";
    firstPopup.style.display = "none";
    if (deletedProjectIds.length > 0) {
      triggerImageDeletedEvent(deletedProjectIds);
    }

  });

  closeSecondPopupIcon.addEventListener("click", () => {
    console.log("Close icon clicked");
    overlay.style.display = "none";
    secondPopup.style.display = "none";
    if (deletedProjectIds.length > 0) {
      triggerImageDeletedEvent(deletedProjectIds);
    }

  });

  //  event listener that returns the first pop-up window
  backButton.addEventListener("click", (e) => {
    e.stopPropagation();
    secondPopup.style.display = "none";
    firstPopup.style.display = "block";
    overlay.style.display = "block";
    console.log("Second popup hidden, First popup shown");
    if (deletedProjectIds.length > 0) {
      triggerImageDeletedEvent(deletedProjectIds);
    }
      clearForm();
    
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
    if (e.target === overlay) {
      overlay.style.display = "none";
      firstPopup.style.display = "none";
      secondPopup.style.display = "none";
      console.log("overlay clicked");
    }
    if (deletedProjectIds.length > 0) {
      triggerImageDeletedEvent(deletedProjectIds);
    }

  });

  // 打开弹窗1时的逻辑
  const deletedProjectIds = []; // 存储待删除的项目 ID 的数组

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

      deleteIcon.addEventListener('click', () => {
        if (imageId) {
          deletedProjectIds.push(imageId);
          console.log('ID de l\'image supprimée : ' + imageId);
          removeImageBlock(imageId);
          projects = projects.filter((project) => project.id !== imageId);
          displayProjectsInContainer(projects, 'gallery');
          displayProjectsInContainer(projects, 'image-container');
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

  // 在弹窗内的删除操作成功后触发自定义事件
  function triggerImageDeletedEvent(imageId) {
    const event = new CustomEvent('imageDeleted', { detail: imageId });
    window.dispatchEvent(event);
  }

  // 在主页面的JavaScript中监听删除事件
  window.addEventListener('imageDeleted', async (event) => {
    const deletedImageId = event.detail;
    const token = getUserToken();
    console.log('ID de l\'image supprimée : ' + deletedImageId);
    if (token) {
      // const success = await deleteImage(deletedImageId);
      // if (success) {
      //   loadProjects();
      // }
      await deleteImage(deletedImageId);
      loadProjects();
    }
  });

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
  //end of first popup//

  //////////// second popup ajout///////////////////////////////////////////////////
  // Add project form, API interaction 添加项目表单，api/works post交互
  const fileInput = document.getElementById('file-input');
  const imageTitleInput = document.getElementById('image-title');
  const imageCategorySelect = document.getElementById('image-category');
  const validerButton = document.querySelector('.valider-button');
  const imageThumbnail = document.createElement('img');
  const imageIcon = document.getElementById('image-icon');
  const customFileLabel = document.querySelector('.custom-file-label');
  const paragraph = document.querySelector('.upload-block p');
  const uploadBlock = document.querySelector('.upload-block');


  // builds the request body headers，构建请求头
  // function buildHeaders() {
  //   const token = localStorage.getItem('token');
  //   const headers = new Headers();
  //   headers.append('Authorization', `Bearer ${token}`);
  //   return headers;
  // }

  // builds the request body，构建请求体
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

  // Call these functions in the event 调用这些函数
  validerButton.addEventListener('click', async (event) => {
    event.preventDefault();
    validerButton.style.backgroundColor = '#1D6154';
    //////////是否可以调用创建imageblock函数（newImageData）

    if (validateUserInput()) {
      imageCategoryName = imageCategorySelect.value;
      const newImageData = getNewImageData(imageDataURL);
      projects.push(newImageData);

      addNewImageToProjects();
      clearForm();
      uploadBlock.removeChild(imageThumbnail);
      showFileInputElements();

      // displayProjectsInContainer(projects, 'gallery');
      // displayProjectsInContainer(projects, 'image-container');
    }
  });

  function getNewImageData(imageDataURL) {
    // const category = imageCategorySelect.value;
    const file = fileInput.files[0];
    const title = imageTitleInput.value;
    const imageCategoryName = imageCategorySelect.value;
    const categoryMap = {
      'Objets': 1,
      'Appartements': 2,
      'Hotels & restaurants': 3,
    };
    const category = {
      id: categoryMap[imageCategoryName], 
      name: imageCategorySelect.value 
    };

    const newImageData = {
      title: title,
      imageUrl: imageDataURL,
      category: category
    };
    return newImageData;
  }

  // Create a function that validates user input
  function validateUserInput() {
    const errorMessage = document.querySelector('.error-message');
    const title = imageTitleInput.value;
    const imageCategoryName = imageCategorySelect.value;
    console.log('title:', title);
    console.log('imageCategoryName:', imageCategoryName);
    console.log('fileInput.files[0]:', fileInput.files[0]);
    // Verify user input is complete验证用户输入是否完整
    if (!title || !imageCategoryName || !fileInput.files[0]) {
      errorMessage.style.display = 'block';
      console.log('Validation failed: Please fill in all required fields.');
      return false;
    } else {
      errorMessage.style.display = 'none';
      return true;
    }
  }

  // add event change to display image thumbnails in the interface为文件输入添加事件监听器
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) {
      hideFileInputElements();
      displayThumbnailImage(file);
      // showOverlayAndPopup();
    } else {
      uploadBlock.removeChild(imageThumbnail);
    }
  });

  // clear form fields用于处理成功上传图片后的操作的函数
  function clearForm() {
    fileInput.value = null;
    imageTitleInput.value = '';
    imageCategorySelect.value = '';
    imageThumbnail.style.display = 'none';
  }

  function addNewImageToProjects(newImageData) {
    projects.push(newImageData);
  }

  // 隐藏文件输入相关元素
  function hideFileInputElements() {
    imageIcon.style.display = 'none';
    // fileInput.style.display = 'none';
    customFileLabel.style.display = 'none';
    paragraph.style.display = 'none';
  }

  function showFileInputElements() {
    imageIcon.style.display = 'block';
    // fileInput.style.display = 'none';
    customFileLabel.style.display = 'block';
    paragraph.style.display = 'block';
  }
  // 显示缩略图图像
  let imageDataURL = '';
  function displayThumbnailImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imageDataURL = e.target.result;
      imageThumbnail.src = imageDataURL;
      imageThumbnail.alt = imageTitleInput.value
      imageThumbnail.style.display = 'block';
    };
    reader.readAsDataURL(file);
    uploadBlock.appendChild(imageThumbnail);
  }

  // 在弹窗内的添加操作成功后触发自定义事件
  function triggerImageAddedEvent() {
    const event = new CustomEvent('imageAdded', {
      detail: {
        fileInput: fileInput.files[0], // 图像文件
        title: imageTitleInput.value, // 图像标题
        imageCategoryName: imageCategorySelect.value, // 图像类别
      },
    });
    window.dispatchEvent(event);
  }

  // 在主页面的JavaScript中监听添加事件
  window.addEventListener('imageAdded', async (event) => {
    const formData = buildFormData(); // 获取要上传的图像数据
    const token = getUserToken();
    if (token) {
      const newData = await newImage(formData);
      if (newData) {
        loadProjects(newData);
        console.log('Newdata:', newData);
        // openFirstPopup(newData); //此处需要加这一步吗？有空测试下
      }
    }
  });



});


