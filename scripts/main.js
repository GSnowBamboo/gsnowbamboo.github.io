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
    setupColumnEditorEvents();
    setupRowEditorEvents();
});
