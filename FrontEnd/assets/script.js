document.addEventListener('DOMContentLoaded', function () {

// filter 
const gallery = document.querySelector('.gallery');
  const filterButtons = document.querySelectorAll('.filter-button');
  let currentCategory = '';
  let projectsData = []; // 用于存储项目数据

  // 步骤 4: 筛选项目
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

  // 步骤 3: 创建筛选按钮（添加事件监听器）
  filterButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const selectedCategory = this.id;
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
      this.classList.add('active');

      // 调用筛选项目函数，并传递所选的类别
      filterProjects(currentCategory);
    });
  });

  // 初始化页面加载数据
  loadData();

  function loadData() {
    fetch('http://localhost:5678/api/works')
      .then((response) => response.json())
      .then((data) => {
        projectsData = data; // 将数据存储到全局变量
        console.log('Loaded data:', projectsData);
        // 页面加载后显示所有项目
        displayAllProjects(projectsData);
      })
      .catch((error) => {
        console.error('Failed to load data:', error);
      });
  }


// Get login status
// const email = localStorage.getItem('email');
const userId = localStorage.getItem('userId');
const loginLink = document.getElementById('login-link');

// Check if user is logged in
console.log('User ID:', userId);

if (userId) {
    loginLink.textContent = 'logout'; //   login to logout
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


