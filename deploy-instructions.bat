@echo off
echo ========================================
echo   Deploy to GitHub Pages
echo ========================================
echo.
echo Please follow these steps:
echo.
echo 1. Create a new repository on GitHub:
echo    https://github.com/new
echo.
echo 2. After creating, run these commands:
echo.
echo    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
echo    git push -u origin main
echo.
echo 3. Then enable GitHub Pages:
echo    - Go to your repo Settings ^> Pages
echo    - Source: Deploy from branch
echo    - Branch: main, folder: / (root)
echo    - Click Save
echo.
echo 4. Your website will be live at:
echo    https://YOUR_USERNAME.github.io/YOUR_REPO_NAME
echo.
echo ========================================
echo.
echo Replace YOUR_USERNAME with your GitHub username
echo Replace YOUR_REPO_NAME with your repository name
echo.
pause
