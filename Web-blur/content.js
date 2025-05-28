let blurOverlay = null;
let isBlurred = false;

// 创建模糊遮罩层
function createBlurOverlay() {
  if (!blurOverlay) {
    blurOverlay = document.createElement("div");
    blurOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      backdrop-filter: blur(0px);
      -webkit-backdrop-filter: blur(0px);
      z-index: 2147483647;
      pointer-events: none;
      transition: backdrop-filter 0.3s ease;
    `;
    document.documentElement.appendChild(blurOverlay);
  }
  return blurOverlay;
}

// 更新模糊效果
function updateBlur(amount) {
  const overlay = createBlurOverlay();
  const blurValue = `${amount}px`;
  overlay.style.backdropFilter = `blur(${blurValue})`;
  overlay.style.webkitBackdropFilter = `blur(${blurValue})`;
  overlay.style.display = amount > 0 ? "block" : "none";

  // 更新状态
  isBlurred = amount > 0;
  // 通知background script更新状态
  chrome.runtime.sendMessage({
    action: "updateBlurState",
    isBlurred: isBlurred,
  });
}

// 移除模糊效果
function removeBlur() {
  if (blurOverlay) {
    blurOverlay.remove();
    blurOverlay = null;
  }
  isBlurred = false;
  // 通知background script更新状态
  chrome.runtime.sendMessage({
    action: "updateBlurState",
    isBlurred: false,
  });
}

// 确保在页面加载完成后初始化
function initialize() {
  // 检查是否已经存在模糊效果
  if (document.querySelector(".blur-overlay")) {
    removeBlur();
  }
}

// 页面加载完成后初始化
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialize);
} else {
  initialize();
}

// 监听来自popup的消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("Received message:", request); // 调试日志

  if (request.action === "toggleBlur") {
    if (request.blurAmount > 0) {
      updateBlur(request.blurAmount);
    } else {
      removeBlur();
    }
  } else if (request.action === "updateBlur") {
    updateBlur(request.blurAmount);
  }

  // 发送响应
  sendResponse({ success: true });
  return true;
});
