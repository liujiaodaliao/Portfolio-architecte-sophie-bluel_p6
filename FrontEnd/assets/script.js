document.addEventListener('DOMContentLoaded', function () {

  //filter//
  // Get the button elements 获取按钮元素
  const gallery = document.querySelector('.gallery');
  const buttonContainer = document.querySelector('.button-container');
  let currentCategory = '';
  let projectsData = []; // storing project data 用于存储项目数据
  let categories = []; // storing category data 用于存储类别数据

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

  // Create and display filtered projects 创建并显示筛选后的项目
  function displayFilteredProjects(filteredProjects) {
    gallery.innerHTML = '';
    if (filteredProjects.length > 0) {
      filteredProjects.forEach((project) => {
        const figure = document.createElement('figure');
        const image = document.createElement('img');
        image.src = project.imageUrl;
        image.alt = project.title;
        const figcaption = document.createElement('figcaption');
        figcaption.textContent = project.title;

        figure.appendChild(image);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
      });
    } else {
      gallery.innerHTML = '没有匹配的项目。';
    }
  }

  // Display all projects directly 直接显示所有项目
  function displayAllProjects(data) {
    gallery.innerHTML = '';
    data.forEach((project) => {
      const figure = document.createElement('figure');
      const image = document.createElement('img');
      image.src = project.imageUrl;
      image.alt = project.title;
      const figcaption = document.createElement('figcaption');
      figcaption.textContent = project.title;

      figure.appendChild(image);
      figure.appendChild(figcaption);
      gallery.appendChild(figure);
    });
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
    //  Add the "All" button
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
//end of filter//


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

  // popup//
  // Get the overlay and element 获取弹窗和遮罩层元素
  const overlay = document.getElementById("overlay-id");
  const popup = overlay.querySelector(".popup");
  const projetsEditIcon = document.getElementById("edit-button");
  const closeIcon = document.querySelector(".close-popup");

  //  Show the popup when the "projets" edit icon is clicked 点击 "projets" 编辑图标时显示弹窗
  projetsEditIcon.addEventListener("click", () => {
    overlay.style.display = "block";
    console.log("Edit icon clicked");
  });

  // Hide the popup when the close icon is clicked 点击关闭图标时隐藏弹窗
  closeIcon.addEventListener("click", () => {
    console.log("Close icon clicked");
    overlay.style.display = "none";
    window.location.href = './index.html'
  });


  // Create an image block 创建图片盒子
  function createImageBlock(image) {
    const imageBlock = document.createElement('div');
    imageBlock.classList.add('image-block');
    imageBlock.setAttribute('data-image-id', image.id); 
    // To identify images for deletion 为了在删除时识别图片
    const imgElement = document.createElement('img');
    imgElement.src = image.imageUrl;
    imgElement.alt = image.title;

    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('fa-solid', 'fa-trash-can');
    deleteIcon.addEventListener('click', () => {
      deleteImage(image.id);
      //  Remove the image from the interface 从界面中删除图片
      imageBlock.remove();
    });

    imageBlock.appendChild(imgElement);
    imageBlock.appendChild(deleteIcon);

    return imageBlock;
  }

  // Delete an image 删除图片
  async function deleteImage(imageId) {
    try {
      const response = await fetch(`http://localhost:5678/api/works/${imageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log(`Image with ID ${imageId} deleted successfully.`);
        // Remove the image block from the DOM
        const imageBlock = document.querySelector(`.image-block[data-image-id="${imageId}"]`);
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
        // Render each image 渲染每张图片
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


// 获取按钮和两个弹窗元素
const addPhotoButton = document.querySelector(".add-photo-button");
const firstPopup = document.getElementById("first-popup");
const secondPopup = document.getElementById("second-popup");

addPhotoButton.addEventListener("click", () => {
  firstPopup.style.display = "none";
  console.log("First popup hidden");
  secondPopup.style.display = "block";
  console.log("Second popup shown"); 
});





});


