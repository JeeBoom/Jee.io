// 存储每个标签页的模糊状态
const tabStates = new Map();

// 监听插件安装事件
chrome.runtime.onInstalled.addListener(() => {
  console.log("Web Blur extension installed");
  // 设置默认模糊值
  chrome.storage.sync.get(["blurAmount"], function (result) {
    if (!result.blurAmount) {
      chrome.storage.sync.set({ blurAmount: 5 });
    }
  });
});

// 监听标签页关闭事件，清理状态
chrome.tabs.onRemoved.addListener((tabId) => {
  tabStates.delete(tabId);
});

// 监听标签页更新事件
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url.startsWith("http")) {
    // 当页面加载完成时，检查是否需要应用模糊效果
    const isBlurred = tabStates.get(tabId);
    if (isBlurred) {
      // 获取保存的模糊值
      chrome.storage.sync.get(["blurAmount"], function (result) {
        const blurAmount = result.blurAmount || 5;
        chrome.tabs.sendMessage(tabId, {
          action: "toggleBlur",
          blurAmount: blurAmount,
        });
      });
    }
  }
});

// 监听快捷键命令
chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle-blur") {
    // 获取当前标签页
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0]) {
        const tabId = tabs[0].id;
        // 获取当前标签页的模糊状态
        const isBlurred = tabStates.get(tabId) || false;

        // 获取保存的模糊值
        chrome.storage.sync.get(["blurAmount"], function (result) {
          const blurAmount = result.blurAmount || 5;

          // 发送消息到content script
          chrome.tabs
            .sendMessage(tabId, {
              action: "toggleBlur",
              blurAmount: isBlurred ? 0 : blurAmount,
            })
            .catch((error) => {
              console.error("Error sending message:", error);
              // 如果发送消息失败，尝试重新注入content script
              chrome.scripting
                .executeScript({
                  target: { tabId: tabId },
                  files: ["content.js"],
                })
                .then(() => {
                  // 重新发送消息
                  chrome.tabs.sendMessage(tabId, {
                    action: "toggleBlur",
                    blurAmount: isBlurred ? 0 : blurAmount,
                  });
                });
            });

          // 更新状态
          tabStates.set(tabId, !isBlurred);
        });
      }
    });
  }
});

// 监听来自content script的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateBlurState" && sender.tab) {
    tabStates.set(sender.tab.id, request.isBlurred);
  }
  return true;
});
