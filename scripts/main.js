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
    // const backgroundMusic = document.getElementById('backgroundMusic');
    // const backgroundVideo = document.getElementById('backgroundVideo');
    
    // 尝试播放背景音乐（需要用户交互）
    // function tryPlayBackgroundMusic() {
    //     if (backgroundMusic) {
    //         backgroundMusic.volume = 0.3; // 设置音量
    //         const playPromise = backgroundMusic.play();
            
    //         if (playPromise !== undefined) {
    //             playPromise.catch(error => {
    //                 // 自动播放被阻止，需要用户交互
    //                 console.log('背景音乐需要用户交互后才能播放');
    //             });
    //         }
    //     }
    // }
    
    // 页面加载后尝试播放背景音乐
    // tryPlayBackgroundMusic();
    
    // 添加播放/暂停背景音乐的按钮
    // const musicControlBtn = document.createElement('button');
    // musicControlBtn.innerHTML = '🔇';
    // musicControlBtn.style.position = 'fixed';
    // musicControlBtn.style.bottom = '20px';
    // musicControlBtn.style.right = '20px';
    // musicControlBtn.style.zIndex = '1000';
    // musicControlBtn.style.width = '40px';
    // musicControlBtn.style.height = '40px';
    // musicControlBtn.style.borderRadius = '50%';
    // musicControlBtn.style.border = 'none';
    // musicControlBtn.style.background = 'rgba(0, 0, 0, 0.5)';
    // musicControlBtn.style.color = 'white';
    // musicControlBtn.style.cursor = 'pointer';
    // musicControlBtn.style.fontSize = '20px';
    
    // document.body.appendChild(musicControlBtn);
    
    // 音乐控制按钮点击事件
    // musicControlBtn.addEventListener('click', function() {
    //     if (backgroundMusic.paused) {
    //         backgroundMusic.play();
    //         musicControlBtn.innerHTML = '🔊';
    //     } else {
    //         backgroundMusic.pause();
    //         musicControlBtn.innerHTML = '🔇';
    //     }
    // });
    
    // 更新按钮状态
    // backgroundMusic.addEventListener('play', function() {
    //     musicControlBtn.innerHTML = '🔊';
    // });
    
    // backgroundMusic.addEventListener('pause', function() {
    //     musicControlBtn.innerHTML = '🔇';
    // });

    // 从缓存加载数据
    // loadDefaultExcel();
    
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
