import { 
    tableData, 
    loadDefaultExcel, 
    saveToCache, 
    showCacheIndicator 
} from './data.js';
import { 
    populateTable, 
    setupTableEvents 
} from './table.js';
import { setupCardEvents } from './card.js';
import { setupPlaylistEvents } from './playlist.js';
import { showPlaylist } from './playlist.js';

document.addEventListener('DOMContentLoaded', function() {
    // 元素引用
    const editColumnsBtn = document.getElementById('editColumnsBtn');
    const playlistBtn = document.getElementById('playlistBtn');
    const rowEditBtn = document.getElementById('rowEditBtn');
    const columnEditor = document.getElementById('columnEditor');
    const rowEditor = document.getElementById('rowEditor');
    const table = document.getElementById('dialogueTable');
    const tableContainer = document.getElementById('tableContainer');
    const tableBody = table.querySelector('tbody');
    const overlay = document.getElementById('overlay');
    const playlistOverlay = document.getElementById('playlistOverlay');
    const cacheIndicator = document.getElementById('cacheIndicator');
    const syntaxTooltip = document.getElementById('syntaxTooltip');
    const selectAllPlaylist = document.getElementById('selectAllPlaylist');
    
    // 背景音乐控制
    const backgroundMusic = document.getElementById('backgroundMusic');
    const backgroundVideo = document.getElementById('backgroundVideo');
    
    initMedia(); // 初始化媒体但不自动播放

    // 尝试播放背景音乐（需要用户交互）
    function tryPlayBackgroundMusic() {
        if (backgroundMusic) {
            backgroundMusic.volume = 1;
            const playPromise = backgroundMusic.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    // 自动播放被阻止，需要用户交互
                    console.log('背景音乐需要用户交互后才能播放');
                });
            }
        }
        
        // 添加视频播放尝试
        if (backgroundVideo) {
            const videoPlayPromise = backgroundVideo.play();
            if (videoPlayPromise !== undefined) {
                videoPlayPromise.catch(error => {
                    console.log('背景视频需要用户交互后才能播放');
                });
            }
        }
    }

    
    // 页面加载后尝试播放背景音乐
    tryPlayBackgroundMusic();
    
    // 添加播放/暂停背景音乐的按钮
    const musicControlBtn = document.createElement('button');
    musicControlBtn.innerHTML = '🔇';
    musicControlBtn.style.position = 'fixed';
    musicControlBtn.style.bottom = '20px';
    musicControlBtn.style.right = '20px';
    musicControlBtn.style.zIndex = '1000';
    musicControlBtn.style.width = '40px';
    musicControlBtn.style.height = '40px';
    musicControlBtn.style.borderRadius = '50%';
    musicControlBtn.style.border = 'none';
    musicControlBtn.style.background = 'rgba(0, 0, 0, 0.5)';
    musicControlBtn.style.color = 'white';
    musicControlBtn.style.cursor = 'pointer';
    musicControlBtn.style.fontSize = '20px';
    
    document.body.appendChild(musicControlBtn);
    
    // 音乐控制按钮点击事件
    musicControlBtn.addEventListener('click', async function() {
        try {
            if (backgroundMusic.paused) {
                // 先暂停再播放，避免冲突
                backgroundMusic.pause();
                backgroundVideo.pause();
                
                // 添加短暂延迟确保状态稳定
                await new Promise(resolve => setTimeout(resolve, 100));
                
                // 播放音乐和视频
                await backgroundMusic.play();
                await backgroundVideo.play();
                musicControlBtn.innerHTML = '🔊';
            } else {
                // 暂停音乐和视频
                backgroundMusic.pause();
                backgroundVideo.pause();
                musicControlBtn.innerHTML = '🔇';
            }
        } catch (e) {
            console.error('媒体控制错误:', e);
            
            // 如果播放失败，尝试单独播放音乐
            if (backgroundMusic.paused) {
                try {
                    await backgroundMusic.play();
                    musicControlBtn.innerHTML = '🔊';
                } catch (musicError) {
                    console.error('播放音乐失败:', musicError);
                    alert('无法播放背景音乐，请检查文件路径');
                }
            } else {
                backgroundMusic.pause();
                musicControlBtn.innerHTML = '🔇';
            }
        }
    });
    
    // 修改视频和音乐的初始化
    function initMedia() {
        // 设置媒体属性但不自动播放
        if (backgroundMusic) {
            backgroundMusic.volume = 1;
            backgroundMusic.preload = 'auto';
        }
        
        if (backgroundVideo) {
            backgroundVideo.preload = 'auto';
            backgroundVideo.muted = true; // 确保视频静音，提高自动播放成功率
        }
    }

    
    // 更新按钮状态
    backgroundMusic.addEventListener('play', function() {
        musicControlBtn.innerHTML = '🔊';
    });
    
    backgroundMusic.addEventListener('pause', function() {
        musicControlBtn.innerHTML = '🔇';
    });

    // 添加视频错误处理
    backgroundVideo.addEventListener('error', function() {
        console.error('视频加载失败，请检查文件路径:', this.src);
        alert('背景视频加载失败，请检查background.mp4文件是否存在');
    });

    // 添加音乐错误处理
    backgroundMusic.addEventListener('error', function() {
        console.error('音乐加载失败，请检查文件路径:', this.src);
        alert('背景音乐加载失败，请检查background.mp3文件是否存在');
    });

    // 从缓存加载数据
    loadDefaultExcel();
    
    // 监听数据加载完成事件
    window.addEventListener('dataLoaded', function() {
        // 填充表格
        populateTable();
        
        // 设置事件监听器
        setupTableEvents();
        setupCardEvents();
        setupPlaylistEvents();
    });
    
    // 绑定全局事件
    // function setupColumnEditorEvents() {
    //     editColumnsBtn.addEventListener('click', function() {
    //         columnEditor.style.display = columnEditor.style.display === 'block' ? 'none' : 'block';
    //         rowEditor.style.display = 'none';
    //     });
    // }
    
    function setupRowEditorEvents() {
        rowEditBtn.addEventListener('click', function() {
            const isVisible = rowEditor.style.display === 'block';
            rowEditor.style.display = isVisible ? 'none' : 'block';
            columnEditor.style.display = 'none';
            
            // 切换行选择列的显示
            if (isVisible) {
                tableContainer.classList.remove('row-editor-visible');
            } else {
                tableContainer.classList.add('row-editor-visible');
            }
        });
    }
    
    // 列表播放按钮事件
    playlistBtn.addEventListener('click', function() {
        // 确保播放列表显示最新数据
        showPlaylist();
        playlistOverlay.style.display = 'flex';
    });
    
    // 关闭播放列表事件
    playlistOverlay.addEventListener('click', function(e) {
        if (e.target === playlistOverlay) {
            playlistOverlay.style.display = 'none';
        }
    });
    
    // 初始化列编辑器和行编辑器事件
    // setupColumnEditorEvents();
    // setupRowEditorEvents();
});

// 添加页面点击事件，允许用户交互后播放
document.addEventListener('click', function() {
    // 尝试播放视频（静音状态下更可能成功）
    if (backgroundVideo && backgroundVideo.paused) {
        backgroundVideo.play().catch(e => {
            console.log('视频自动播放被阻止，需要用户明确交互');
        });
    }
}, { once: true }); // 只执行一次
