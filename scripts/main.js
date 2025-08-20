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
    
    // 初始化媒体但不自动播放
    function initMedia() {
        if (backgroundMusic) {
            backgroundMusic.volume = 0.3;
            backgroundMusic.preload = 'auto';
        }
        
        if (backgroundVideo) {
            backgroundVideo.preload = 'auto';
            backgroundVideo.muted = true; // 确保视频静音
        }
    }
    
    initMedia();
    
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
    musicControlBtn.addEventListener('click', function() {
        try {
            if (backgroundMusic.paused) {
                backgroundMusic.play()
                    .then(() => {
                        // 如果音乐播放成功，也尝试播放视频
                        if (backgroundVideo.paused) {
                            backgroundVideo.play().catch(e => console.error('播放视频失败:', e));
                        }
                        musicControlBtn.innerHTML = '🔊';
                    })
                    .catch(e => {
                        console.error('播放音乐失败:', e);
                        alert('请先点击页面任意位置激活媒体播放');
                    });
            } else {
                backgroundMusic.pause();
                backgroundVideo.pause();
                musicControlBtn.innerHTML = '🔇';
            }
        } catch (e) {
            console.error('媒体控制错误:', e);
        }
    });
    
    // 更新按钮状态
    backgroundMusic.addEventListener('play', function() {
        musicControlBtn.innerHTML = '🔊';
    });
    
    backgroundMusic.addEventListener('pause', function() {
        musicControlBtn.innerHTML = '🔇';
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
    
    // 添加页面点击事件，用户第一次点击页面时播放媒体
    document.addEventListener('click', function initMediaOnFirstInteraction() {
        try {
            // 播放视频（静音状态下通常允许自动播放）
            if (backgroundVideo && backgroundVideo.paused) {
                backgroundVideo.play().catch(e => {
                    console.log('视频播放失败:', e);
                });
            }
            
            // 尝试播放音乐
            if (backgroundMusic && backgroundMusic.paused) {
                backgroundMusic.play().then(() => {
                    musicControlBtn.innerHTML = '🔊';
                }).catch(e => {
                    console.log('音乐需要更多用户交互后才能播放');
                });
            }
            
            // 移除事件监听，只执行一次
            document.removeEventListener('click', initMediaOnFirstInteraction);
        } catch (e) {
            console.error('初始化媒体播放失败:', e);
        }
    }, { once: true }); // 使用 { once: true } 确保只执行一次
    
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
