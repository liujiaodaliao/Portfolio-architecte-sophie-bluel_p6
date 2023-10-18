document.addEventListener('DOMContentLoaded', function () {

// 获取按钮元素
const gallery = document.querySelector('.gallery');
const buttonContainer = document.querySelector('.button-container');
let currentCategory = '';
let projectsData = []; // 用于存储项目数据
let categories = []; // 用于存储类别数据

//  筛选项目
function filterProjects(category) {
  if (category === 'tous') {
    // 如果点击的是 "Tous" 按钮，直接显示所有项目
    displayAllProjects(projectsData);
  } else {
    // 否则，根据选定的类别筛选项目
    const filteredProjects = projectsData.filter((project) => project.category.name === category);
    displayFilteredProjects(filteredProjects);
  }
}

// 创建并显示筛选后的项目
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

// 直接显示所有项目
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

//  创建筛选按钮（添加事件监听器）
buttonContainer.addEventListener('click', (event) => {
  if (event.target.classList.contains('filter-button')) {
    const selectedCategory = event.target.id;
    console.log('Selected category:', selectedCategory);
    // 检查是否已经选中相同类别，如果是则返回
    if (selectedCategory === currentCategory) {
      return;
    }
    // 移除上一个按钮的激活状态
    const currentActiveButton = document.querySelector('.filter-button.active');
    if (currentActiveButton) {
      currentActiveButton.classList.remove('active');
    }
    // 更新当前选中的类别
    currentCategory = selectedCategory;
    // 给当前按钮添加激活状态
    event.target.classList.add('active');
    // 调用筛选项目函数，并传递所选的类别
    filterProjects(currentCategory);
  }
});

//  加载类别数据
loadCategories();

async function loadCategories() {
  try {
    const response = await fetch('http://localhost:5678/api/categories');
    if (response.ok) {
      const data = await response.json();
      categories = data;  // 将类别数据存储到全局变量
      console.log('Loaded categories:', categories);
      // 创建其他类别按钮并添加到页面
      createCategoryButtons(categories);
      await loadData(); //  加载项目数据
    } else {
      throw new Error('Failed to fetch categories');
    }
  } catch (error) {
    console.error('Failed to load categories:', error);
  }
}

// 创建其他类别筛选按钮并添加到页面
function createCategoryButtons(categories) {
  buttonContainer.innerHTML = ''; //先清空
   // 添加 "Tous" 按钮
   const tousButton = document.createElement('button');
   tousButton.id = 'tous';
   tousButton.className = 'filter-button';
   tousButton.textContent = 'Tous';
   buttonContainer.appendChild(tousButton);
  // 遍历其他类别数据并创建按钮
  categories.forEach((category) => {
    const button = document.createElement('button');
    button.id = category.name;
    button.className = 'filter-button';
    button.textContent = category.name;
    buttonContainer.appendChild(button);
  });
 
}
  // 加载项目数据
  async function loadData() {
    try {
      const response = await fetch('http://localhost:5678/api/works');
      if (response.ok) {
        const data = await response.json();
        projectsData = data; // 将项目数据存储到全局变量
        console.log('Loaded data:', projectsData);
        // 页面加载后显示所有项目
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


 
 











});


